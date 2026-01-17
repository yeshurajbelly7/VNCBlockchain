# VNC Blockchain Backend - cPanel Deployment

## Installation Steps

1. Extract this ZIP file to ~/nodejs-app/ folder
2. Create .env file with your database credentials
3. Run: npm install --only=production
4. Run migrations: npx prisma migrate deploy
5. Setup Node.js app in cPanel with Node.js 20.x
6. Set startup file: dist/server.js
7. Start the application

## Environment Variables Required

See .env.example for all required variables.

