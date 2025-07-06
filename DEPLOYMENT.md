# Deployment Guide

This guide covers deploying the Monster Maker application to various platforms.

## Prerequisites

1. **Supabase Setup Complete**
   - Database schema applied
   - Environment variables configured
   - Authentication enabled

2. **Local Development Working**
   - Application runs locally without errors
   - All features tested

## Frontend Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Build the Application**
   ```bash
   cd client
   npm run build
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Configure Environment Variables**
   - Go to Vercel Dashboard > Project Settings > Environment Variables
   - Add:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

5. **Update API Proxy**
   - In `client/vite.config.js`, update the proxy target to your backend URL
   - Or configure Vercel rewrites in `vercel.json`:

   ```json
   {
     "rewrites": [
       {
         "source": "/api/:path*",
         "destination": "https://your-backend-url.com/api/:path*"
       }
     ]
   }
   ```

### Netlify

1. **Build the Application**
   ```bash
   cd client
   npm run build
   ```

2. **Deploy**
   - Drag and drop the `dist` folder to Netlify
   - Or connect your GitHub repository

3. **Configure Environment Variables**
   - Go to Site Settings > Environment Variables
   - Add the required Vite environment variables

4. **Configure Redirects**
   Create `_redirects` file in `client/public`:
   ```
   /api/*  https://your-backend-url.com/api/:splat  200
   ```

## Backend Deployment

### Railway

1. **Connect Repository**
   - Connect your GitHub repository to Railway
   - Set the root directory to `server`

2. **Configure Environment Variables**
   - Add all required environment variables
   - Set `NODE_ENV=production`

3. **Deploy**
   - Railway will automatically detect Node.js and deploy

### Render

1. **Create New Web Service**
   - Connect your GitHub repository
   - Set root directory to `server`

2. **Configure Build Settings**
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Environment Variables**
   - Add all required environment variables

### Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Create App**
   ```bash
   heroku create your-app-name
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set SUPABASE_URL=your_url
   heroku config:set SUPABASE_SERVICE_ROLE_KEY=your_key
   heroku config:set SUPABASE_ANON_KEY=your_key
   ```

4. **Deploy**
   ```bash
   git subtree push --prefix server heroku main
   ```

## Environment Variables Checklist

### Frontend (.env)
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Backend (.env)
```env
PORT=3001
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key
NODE_ENV=production
```

## Post-Deployment Checklist

1. **Test Authentication**
   - Register a new user
   - Login with existing user
   - Verify email confirmation works

2. **Test Monster Creation**
   - Create a new monster
   - Edit monster details
   - Delete a monster

3. **Test Export Functionality**
   - Export a monster as JSON
   - Verify FoundryVTT compatibility

4. **Test Responsive Design**
   - Check mobile layout
   - Test tablet view

5. **Performance Check**
   - Monitor load times
   - Check for console errors

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend CORS is configured for your frontend domain
   - Check environment variables are correct

2. **Authentication Failures**
   - Verify Supabase URL and keys
   - Check RLS policies are applied

3. **Build Failures**
   - Ensure all dependencies are installed
   - Check for TypeScript/ESLint errors

4. **API 404 Errors**
   - Verify API routes are correct
   - Check proxy configuration

### Debug Commands

```bash
# Check environment variables
echo $VITE_SUPABASE_URL

# Test API connectivity
curl https://your-backend-url.com/api/health

# Check build output
cd client && npm run build
```

## Monitoring

### Recommended Tools

1. **Error Tracking**
   - Sentry for error monitoring
   - LogRocket for session replay

2. **Performance**
   - Vercel Analytics
   - Google Analytics

3. **Uptime**
   - UptimeRobot
   - Pingdom

## Security Considerations

1. **Environment Variables**
   - Never commit `.env` files
   - Use secure key management

2. **CORS Configuration**
   - Restrict to specific domains
   - Avoid wildcard origins

3. **Rate Limiting**
   - Implement API rate limiting
   - Monitor for abuse

4. **Database Security**
   - Enable RLS policies
   - Regular security audits

## Support

For deployment issues:
1. Check the troubleshooting section
2. Review platform-specific documentation
3. Open an issue on GitHub
4. Contact platform support 