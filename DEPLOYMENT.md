# Deployment Guide

This guide covers various deployment options for the Rich Text Editor application.

## Table of Contents

1. [Docker Deployment](#docker-deployment)
2. [Vercel Deployment](#vercel-deployment)
3. [Netlify Deployment](#netlify-deployment)
4. [AWS S3 + CloudFront](#aws-s3--cloudfront)
5. [GitHub Pages](#github-pages)
6. [Traditional Server](#traditional-server)

## Docker Deployment

### Prerequisites
- Docker installed
- Docker Compose installed

### Steps

1. **Build and run with Docker Compose**:
```bash
docker-compose up --build
```

2. **Access the application**:
```
http://localhost:3000
```

3. **Stop the container**:
```bash
docker-compose down
```

### Production Deployment

For production, you can push the image to a registry:

```bash
# Build the image
docker build -t my-rich-text-editor:latest .

# Tag for registry
docker tag my-rich-text-editor:latest your-registry/my-rich-text-editor:latest

# Push to registry
docker push your-registry/my-rich-text-editor:latest
```

## Vercel Deployment

### Prerequisites
- Vercel account
- Vercel CLI installed (`npm i -g vercel`)

### Steps

1. **Install Vercel CLI**:
```bash
npm i -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Deploy**:
```bash
vercel
```

4. **Deploy to production**:
```bash
vercel --prod
```

### Configuration

Create `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

## Netlify Deployment

### Prerequisites
- Netlify account
- Netlify CLI installed (`npm i -g netlify-cli`)

### Steps

1. **Build the project**:
```bash
npm run build
```

2. **Deploy to Netlify**:
```bash
netlify deploy --prod --dir=dist
```

### Configuration

Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## AWS S3 + CloudFront

### Prerequisites
- AWS account
- AWS CLI configured

### Steps

1. **Build the project**:
```bash
npm run build
```

2. **Create S3 bucket**:
```bash
aws s3 mb s3://my-rich-text-editor
```

3. **Upload files**:
```bash
aws s3 sync dist/ s3://my-rich-text-editor --acl public-read
```

4. **Enable static website hosting**:
```bash
aws s3 website s3://my-rich-text-editor --index-document index.html
```

5. **Create CloudFront distribution** (optional for CDN):
- Go to AWS CloudFront console
- Create distribution
- Set origin to S3 bucket
- Configure caching and SSL

## GitHub Pages

### Prerequisites
- GitHub repository
- GitHub account

### Steps

1. **Install gh-pages**:
```bash
npm install --save-dev gh-pages
```

2. **Add scripts to package.json**:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. **Update vite.config.js**:
```javascript
export default defineConfig({
  base: '/my-rich-text-editor/',
  // ... rest of config
})
```

4. **Deploy**:
```bash
npm run deploy
```

5. **Configure GitHub Pages**:
- Go to repository settings
- Navigate to Pages section
- Select gh-pages branch
- Save

## Traditional Server

### Prerequisites
- Server with Node.js or web server (Nginx/Apache)
- SSH access

### Option 1: Node.js Server

1. **Build the project**:
```bash
npm run build
```

2. **Copy dist folder to server**:
```bash
scp -r dist/ user@server:/var/www/my-rich-text-editor
```

3. **Serve with a simple server**:
```bash
npx serve -s dist -p 3000
```

### Option 2: Nginx

1. **Build the project**:
```bash
npm run build
```

2. **Copy to server**:
```bash
scp -r dist/ user@server:/var/www/my-rich-text-editor
```

3. **Configure Nginx**:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/my-rich-text-editor;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

4. **Restart Nginx**:
```bash
sudo systemctl restart nginx
```

## Environment Variables

If you need environment variables:

1. **Create .env file**:
```bash
VITE_API_URL=https://api.example.com
```

2. **Access in code**:
```javascript
const apiUrl = import.meta.env.VITE_API_URL
```

3. **Set in deployment platform**:
- Vercel: Project Settings → Environment Variables
- Netlify: Site Settings → Build & Deploy → Environment
- Docker: Use docker-compose.yml env section

## CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm install
    
    - name: Run tests
      run: npm test
    
    - name: Build
      run: npm run build
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## Performance Optimization

### Build Optimization

1. **Analyze bundle size**:
```bash
npm run build -- --mode analyze
```

2. **Enable compression**:
- Gzip (enabled in nginx.conf)
- Brotli (optional)

3. **Code splitting**:
```javascript
// Lazy load components
const Editor = lazy(() => import('./components/RichTextEditor'))
```

### CDN Configuration

1. **Use CDN for static assets**
2. **Enable caching headers**
3. **Optimize images** (if added)

## Monitoring

### Add Analytics

```javascript
// Google Analytics
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
```

### Error Tracking

```javascript
// Sentry
import * as Sentry from "@sentry/react"

Sentry.init({
  dsn: "YOUR_DSN",
  environment: "production"
})
```

## Security

### HTTPS

Always use HTTPS in production:
- Let's Encrypt for free SSL
- CloudFlare for CDN + SSL
- AWS Certificate Manager

### Security Headers

Add to nginx.conf:
```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
```

## Troubleshooting

### Build Fails

```bash
# Clear cache
rm -rf node_modules dist
npm install
npm run build
```

### Docker Issues

```bash
# Rebuild without cache
docker-compose build --no-cache
docker-compose up
```

### Port Conflicts

```bash
# Change port in docker-compose.yml
ports:
  - "8080:80"  # Use 8080 instead of 3000
```

## Rollback Strategy

### Docker

```bash
# Tag versions
docker tag my-rich-text-editor:latest my-rich-text-editor:v1.0.0

# Rollback
docker-compose down
docker-compose up my-rich-text-editor:v1.0.0
```

### Vercel/Netlify

- Use platform's rollback feature
- Redeploy previous commit

## Health Checks

### Docker Health Check

Add to Dockerfile:
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost/ || exit 1
```

### Monitoring Endpoint

Create a simple health check:
```javascript
// public/health.json
{ "status": "ok", "version": "1.0.0" }
```

## Backup Strategy

1. **Code**: Git repository (GitHub)
2. **Builds**: Store in artifact repository
3. **Docker Images**: Push to registry
4. **Configuration**: Version control

## Scaling

### Horizontal Scaling

```yaml
# docker-compose.yml
services:
  editor:
    image: my-rich-text-editor
    deploy:
      replicas: 3
```

### Load Balancer

Use Nginx or cloud load balancer:
```nginx
upstream editor_backend {
    server editor1:80;
    server editor2:80;
    server editor3:80;
}
```

## Cost Optimization

### Free Tiers

- Vercel: Free for personal projects
- Netlify: Free for personal projects
- GitHub Pages: Free for public repos
- AWS Free Tier: 12 months free

### Paid Options

- Vercel Pro: $20/month
- Netlify Pro: $19/month
- AWS: Pay as you go
- DigitalOcean: $5/month droplet

## Conclusion

Choose the deployment method that best fits your needs:
- **Quick demo**: Vercel or Netlify
- **Production**: Docker + AWS/GCP
- **Enterprise**: Kubernetes cluster
- **Simple**: GitHub Pages

For this project, Docker Compose is recommended for easy setup and portability.
