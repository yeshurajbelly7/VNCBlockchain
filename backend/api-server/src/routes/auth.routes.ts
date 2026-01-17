/**
 * Authentication Routes
 * Handles user login, signup, 2FA
 */

import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { body, validationResult } from 'express-validator';
import prisma from '../config/database';
import { authenticate } from '../middleware/auth.middleware';
import { sendEmail } from '../services/email.service';
import crypto from 'crypto';

const router = express.Router();

/**
 * POST /api/auth/signup
 * Register new user
 */
router.post('/signup',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
    body('name').notEmpty().trim(),
    body('phone').optional().isMobilePhone('any')
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, name, phone, walletAddress, mnemonic } = req.body;

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(409).json({
          error: 'Conflict',
          message: 'User with this email already exists'
        });
      }

      // Hash password
      const password_hash = await bcrypt.hash(password, 12);

      // Encrypt mnemonic if provided
      let mnemonic_encrypted = null;
      if (mnemonic) {
        const cipher = crypto.createCipher('aes-256-cbc', process.env.JWT_SECRET!);
        mnemonic_encrypted = cipher.update(mnemonic, 'utf8', 'hex') + cipher.final('hex');
      }

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          password_hash,
          name,
          phone,
          wallet_address: walletAddress,
          mnemonic_encrypted,
          role: 'USER'
        }
      });

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET as jwt.Secret,
        { expiresIn: '7d' } as jwt.SignOptions
      );

      // Send welcome email
      await sendEmail({
        to: user.email,
        subject: 'Welcome to VNC Blockchain',
        template: 'welcome',
        data: { name: user.name }
      });

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          walletAddress: user.wallet_address
        }
      });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to register user'
      });
    }
  }
);

/**
 * POST /api/auth/login
 * User login
 */
router.post(
  '/login',
  [body('email').isEmail().normalizeEmail(), body('password').notEmpty()],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Find user
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Invalid email or password'
        });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Invalid email or password'
        });
      }

      // Check if account is active
      if (!user.is_active || user.is_suspended) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'Account is suspended or inactive'
        });
      }

      // Check if 2FA is enabled
      if (user.two_fa_enabled) {
        // Return temp token for 2FA verification
        const tempToken = jwt.sign(
          { userId: user.id, type: '2FA_PENDING' },
          process.env.JWT_SECRET!,
          { expiresIn: '5m' }
        );

        return res.json({
          message: '2FA required',
          require2FA: true,
          tempToken
        });
      }

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { last_login: new Date() }
      });

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET as jwt.Secret,
        { expiresIn: '7d' } as jwt.SignOptions
      );

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          wallet_address: user.wallet_address
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to login'
      });
    }
  }
);

/**
 * POST /api/auth/verify-2fa
 * Verify 2FA code
 */
router.post('/verify-2fa',
  [
    body('tempToken').notEmpty(),
    body('code').isLength({ min: 6, max: 6 })
  ],
  async (req: Request, res: Response) => {
    try {
      const { tempToken, code } = req.body;

      // Verify temp token
      const decoded = jwt.verify(tempToken, process.env.JWT_SECRET!) as any;
      if (decoded.type !== '2FA_PENDING') {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Invalid token'
        });
      }

      // Get user
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId }
      });

      if (!user || !user.two_fa_secret) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Invalid user or 2FA not enabled'
        });
      }

      // Verify 2FA code
      const isValid = speakeasy.totp.verify({
        secret: user.two_fa_secret,
        encoding: 'base32',
        token: code,
        window: 2
      });

      if (!isValid) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Invalid 2FA code'
        });
      }

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { last_login: new Date() }
      });

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET as jwt.Secret,
        { expiresIn: '7d' } as jwt.SignOptions
      );

      res.json({
        message: '2FA verification successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          walletAddress: user.wallet_address
        }
      });
    } catch (error) {
      console.error('2FA verification error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to verify 2FA'
      });
    }
  }
);

/**
 * POST /api/auth/setup-2fa
 * Setup 2FA for user account
 */
router.post('/setup-2fa', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    // Generate secret
    const secret = speakeasy.generateSecret({
      name: `${process.env.TWO_FACTOR_APP_NAME} (${req.user!.email})`,
      length: 32
    });

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!);

    // Store secret temporarily (will be confirmed later)
    await prisma.user.update({
      where: { id: userId },
      data: { two_fa_secret: secret.base32 }
    });

    res.json({
      message: '2FA setup initiated',
      secret: secret.base32,
      qrCode: qrCodeUrl,
      manualEntryKey: secret.base32
    });
  } catch (error) {
    console.error('2FA setup error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to setup 2FA'
    });
  }
});

/**
 * POST /api/auth/enable-2fa
 * Enable 2FA after verification
 */
router.post('/enable-2fa',
  authenticate,
  [body('code').isLength({ min: 6, max: 6 })],
  async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      const { code } = req.body;

      // Get user
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user || !user.two_fa_secret) {
        return res.status(400).json({
          error: 'Bad Request',
          message: '2FA not setup. Call /setup-2fa first'
        });
      }

      // Verify code
      const isValid = speakeasy.totp.verify({
        secret: user.two_fa_secret,
        encoding: 'base32',
        token: code,
        window: 2
      });

      if (!isValid) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Invalid 2FA code'
        });
      }

      // Enable 2FA
      await prisma.user.update({
        where: { id: userId },
        data: { two_fa_enabled: true }
      });

      // Send email notification
      await sendEmail({
        to: user.email,
        subject: '2FA Enabled on Your Account',
        template: '2fa-enabled',
        data: { name: user.name }
      });

      res.json({
        message: '2FA enabled successfully'
      });
    } catch (error) {
      console.error('2FA enable error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to enable 2FA'
      });
    }
  }
);

/**
 * POST /api/auth/disable-2fa
 * Disable 2FA
 */
router.post('/disable-2fa',
  authenticate,
  [body('code').isLength({ min: 6, max: 6 })],
  async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      const { code } = req.body;

      // Get user
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user || !user.two_fa_secret || !user.two_fa_enabled) {
        return res.status(400).json({
          error: 'Bad Request',
          message: '2FA is not enabled'
        });
      }

      // Verify code
      const isValid = speakeasy.totp.verify({
        secret: user.two_fa_secret,
        encoding: 'base32',
        token: code,
        window: 2
      });

      if (!isValid) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Invalid 2FA code'
        });
      }

      // Disable 2FA
      await prisma.user.update({
        where: { id: userId },
        data: {
          two_fa_enabled: false,
          two_fa_secret: null
        }
      });

      res.json({
        message: '2FA disabled successfully'
      });
    } catch (error) {
      console.error('2FA disable error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to disable 2FA'
      });
    }
  }
);

export default router;
