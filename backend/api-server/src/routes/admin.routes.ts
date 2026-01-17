/**
 * Admin Routes (Super Admin only)
 */

import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import prisma from '../config/database';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = express.Router();

// All admin routes require authentication and SUPER_ADMIN or ADMIN role
router.use(authenticate);
router.use(authorize('SUPER_ADMIN', 'ADMIN'));

/**
 * GET /api/admin/users
 * List all users
 */
router.get('/users', async (req: Request, res: Response) => {
  try {
    const { limit = 50, offset = 0, role, kyc_status } = req.query;

    const where: any = {};
    if (role) where.role = role;
    if (kyc_status) where.kyc_status = kyc_status;

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        wallet_address: true,
        kyc_status: true,
        total_invested: true,
        tokens_owned: true,
        is_active: true,
        is_suspended: true,
        created_at: true,
        last_login: true
      },
      orderBy: { created_at: 'desc' },
      take: Number(limit),
      skip: Number(offset)
    });

    const total = await prisma.user.count({ where });

    res.json({
      users,
      pagination: {
        total,
        limit: Number(limit),
        offset: Number(offset)
      }
    });
  } catch (error) {
    console.error('List users error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch users'
    });
  }
});

/**
 * PUT /api/admin/users/:id/kyc
 * Approve/reject user KYC
 */
router.put('/users/:id/kyc',
  [
    body('status').isIn(['APPROVED', 'REJECTED']),
    body('reason').optional().trim()
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { status, reason } = req.body;
      const adminId = req.user!.id;

      const user = await prisma.user.update({
        where: { id },
        data: {
          kyc_status: status,
          kyc_approved_by: status === 'APPROVED' ? adminId : null,
          kyc_approved_at: status === 'APPROVED' ? new Date() : null
        }
      });

      // Create audit log
      await prisma.auditLog.create({
        data: {
          user_id: adminId,
          action: `KYC_${status}`,
          entity_type: 'User',
          entity_id: id,
          new_value: { status, reason }
        }
      });

      res.json({
        message: `KYC ${status.toLowerCase()} successfully`,
        user: {
          id: user.id,
          email: user.email,
          kyc_status: user.kyc_status
        }
      });
    } catch (error) {
      console.error('KYC update error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to update KYC status'
      });
    }
  }
);

/**
 * PUT /api/admin/users/:id/suspend
 * Suspend/unsuspend user
 */
router.put('/users/:id/suspend',
  [body('suspended').isBoolean()],
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { suspended } = req.body;
      const adminId = req.user!.id;

      const user = await prisma.user.update({
        where: { id },
        data: { is_suspended: suspended }
      });

      // Create audit log
      await prisma.auditLog.create({
        data: {
          user_id: adminId,
          action: suspended ? 'USER_SUSPENDED' : 'USER_UNSUSPENDED',
          entity_type: 'User',
          entity_id: id
        }
      });

      res.json({
        message: suspended ? 'User suspended' : 'User unsuspended',
        user: {
          id: user.id,
          email: user.email,
          is_suspended: user.is_suspended
        }
      });
    } catch (error) {
      console.error('Suspend user error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to update user status'
      });
    }
  }
);

/**
 * GET /api/admin/stats
 * Get admin dashboard stats
 */
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const [
      totalUsers,
      activeUsers,
      totalTransactions,
      pendingKYC,
      totalRaised,
      activePresale
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { is_active: true, is_suspended: false } }),
      prisma.transaction.count(),
      prisma.user.count({ where: { kyc_status: 'PENDING' } }),
      prisma.presale.aggregate({
        _sum: { total_raised: true }
      }),
      prisma.presale.findFirst({
        where: { is_active: true }
      })
    ]);

    res.json({
      stats: {
        totalUsers,
        activeUsers,
        totalTransactions,
        pendingKYC,
        totalRaised: totalRaised._sum.total_raised || 0,
        currentStage: activePresale?.stage || 1
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch stats'
    });
  }
});

/**
 * GET /api/admin/audit-logs
 * Get audit logs
 */
router.get('/audit-logs', async (req: Request, res: Response) => {
  try {
    const { limit = 100, offset = 0 } = req.query;

    const logs = await prisma.auditLog.findMany({
      include: {
        user: {
          select: {
            email: true,
            name: true,
            role: true
          }
        }
      },
      orderBy: { created_at: 'desc' },
      take: Number(limit),
      skip: Number(offset)
    });

    const total = await prisma.auditLog.count();

    res.json({
      logs,
      pagination: {
        total,
        limit: Number(limit),
        offset: Number(offset)
      }
    });
  } catch (error) {
    console.error('Get audit logs error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch audit logs'
    });
  }
});

export default router;
