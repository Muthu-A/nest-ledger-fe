# Security Agent Guidelines - Nest Ledger Application

## Purpose
This document defines automated security checks, vulnerability scanning procedures, and security compliance requirements for the Nest Ledger Family Budget Tracker application.

---

## 🔒 1. SECURITY SCANNING CHECKLIST

### 1.1 Dependency Vulnerability Scanning
Run these commands regularly to detect vulnerable dependencies:

```bash
# Check for vulnerabilities in npm packages
npm audit

# Fix vulnerabilities automatically
npm audit fix

# Check specific severity
npm audit --audit-level=moderate

# Generate detailed audit report
npm audit --json > audit-report.json

# Using Snyk (alternative)
npm install -g snyk
snyk test
snyk monitor
```

### 1.2 Static Code Analysis
Detect security issues in your source code:

```bash
# SonarQube / Code quality scan
npm install --save-dev sonarqube-scanner

# ESLint security plugin
npm install --save-dev eslint-plugin-security
npm install --save-dev eslint-plugin-no-secrets

# Run linting
npm run lint -- --ext .js,.jsx,.ts,.tsx

# Security scan only
npm run security:scan
```

### 1.3 OWASP Dependency Check
```bash
# Install OWASP Dependency Check
npm install --save-dev @owasp/dependency-check

# Run scan
dependency-check --project "Nest Ledger" --scan ./node_modules
```

---

## 🛡️ 2. SECURITY CHECKS BY LAYER

### 2.1 Frontend Security

#### Authentication & Authorization
- [ ] Verify JWT tokens are stored securely (httpOnly cookies preferred)
- [ ] Check for token expiration handling
- [ ] Verify no sensitive data in localStorage
- [ ] Test unauthorized access prevention
- [ ] Verify CORS headers are properly configured
- [ ] Check for XSS vulnerabilities in user input

```javascript
// ❌ BAD - Storing token in localStorage
localStorage.setItem('token', token);

// ✅ GOOD - Using httpOnly cookies
document.cookie = `token=${token}; httpOnly; secure; samesite=strict`;
```

#### Input Validation
- [ ] Validate all user inputs (client-side)
- [ ] Sanitize HTML/JavaScript inputs
- [ ] Check for SQL injection attempts in inputs
- [ ] Verify file upload restrictions
- [ ] Test input length limits

```bash
# Install input validation library
npm install validator sanitize-html
```

#### API Security
- [ ] Verify HTTPS only (no HTTP)
- [ ] Check API rate limiting
- [ ] Verify API authentication required
- [ ] Test API authorization checks
- [ ] Validate request/response headers

#### CSP (Content Security Policy)
```javascript
// Add to your Express backend
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self'");
  next();
});
```

### 2.2 Backend Security

#### Authentication
- [ ] Password hashing (bcrypt, argon2)
- [ ] No passwords in logs
- [ ] No passwords in environment files committed to git
- [ ] Verify password strength requirements
- [ ] Test login rate limiting

```javascript
// ✅ GOOD - Password hashing
const bcrypt = require('bcrypt');
const hashedPassword = await bcrypt.hash(password, 10);
```

#### API Security
- [ ] All endpoints require authentication
- [ ] Implement JWT or OAuth
- [ ] Add API rate limiting
- [ ] Implement request validation
- [ ] Add CORS properly configured

```bash
npm install express-ratelimit helmet
```

#### Database Security
- [ ] Use parameterized queries (never raw SQL)
- [ ] No hardcoded database credentials
- [ ] Database connection uses encryption
- [ ] Implement principle of least privilege
- [ ] Regular database backups configured

```javascript
// ❌ BAD - SQL Injection vulnerable
const query = `SELECT * FROM users WHERE email = '${email}'`;

// ✅ GOOD - Parameterized query
const query = 'SELECT * FROM users WHERE email = ?';
db.query(query, [email]);
```

#### Environment Variables
- [ ] All secrets in .env file
- [ ] .env file in .gitignore
- [ ] No secrets in code
- [ ] Verify no .env committed to git

```bash
# Check git history for secrets
git log --all --source -S "password" -S "api_key" -S "secret"

# Or use git-secrets
npm install -g git-secrets
git secrets --install
```

### 2.3 Data Security

#### Encryption
- [ ] Sensitive data encrypted at rest
- [ ] HTTPS/TLS for data in transit
- [ ] Encryption keys stored securely
- [ ] No plaintext passwords/tokens in database

#### Data Privacy
- [ ] GDPR compliance (if EU users)
- [ ] User data not logged
- [ ] Sensitive data not exposed in APIs
- [ ] Data retention policies defined
- [ ] User deletion functionality

```javascript
// ❌ BAD - Logging sensitive data
console.log('User password:', password);

// ✅ GOOD - Only log non-sensitive info
console.log('Login attempt for user:', userId);
```

#### PII Protection
- [ ] Mask PII in logs
- [ ] Encrypt SSN/Credit card data
- [ ] No PII in URLs
- [ ] No PII in error messages

---

## 🚨 3. VULNERABILITY DETECTION

### 3.1 Common Vulnerabilities to Check

```
✓ SQL Injection
✓ Cross-Site Scripting (XSS)
✓ Cross-Site Request Forgery (CSRF)
✓ Broken Authentication
✓ Sensitive Data Exposure
✓ XML External Entities (XXE)
✓ Broken Access Control
✓ Security Misconfiguration
✓ Using Components with Known Vulnerabilities
✓ Insufficient Logging & Monitoring
```

### 3.2 Automated Scanning

```bash
# Run all security checks
npm run security:audit

# Static code analysis
npm run security:static

# Dependency check
npm run security:deps

# Container scanning (if using Docker)
docker scan your-image-name

# SAST (Static Application Security Testing)
npm install --save-dev @checkmarx/ast-cli-javascript
```

### 3.3 Manual Testing

- [ ] Test SQL injection on login form
- [ ] Test XSS in comment/description fields
- [ ] Test CSRF with token manipulation
- [ ] Test unauthorized access to protected routes
- [ ] Test privilege escalation
- [ ] Test sensitive data leakage

---

## 🔐 4. AUTHENTICATION & AUTHORIZATION CHECKS

### 4.1 Authentication

```javascript
// ✅ GOOD - Secure password requirements
const passwordRequirements = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  expiryDays: 90 // Force password change
};

// ✅ GOOD - Password hashing
const saltRounds = 10;
const hashedPassword = await bcrypt.hash(password, saltRounds);

// ✅ GOOD - Account lockout after failed attempts
if (failedAttempts > 5) {
  lockAccount(userId);
  notifyUser('Account locked for security');
}
```

### 4.2 Authorization

```javascript
// ✅ GOOD - Role-based access control
const checkPermission = (user, resource, action) => {
  const permissions = {
    admin: ['create', 'read', 'update', 'delete'],
    user: ['read', 'update_own'],
    guest: ['read']
  };
  return permissions[user.role].includes(action);
};

// ✅ GOOD - Middleware to verify ownership
app.get('/api/budgets/:id', (req, res) => {
  const budget = getBudget(req.params.id);
  if (budget.userId !== req.user.id) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  res.json(budget);
});
```

### 4.3 Session Management

- [ ] Sessions expire after inactivity
- [ ] Verify session tokens are secure
- [ ] Implement logout functionality
- [ ] Clear session on browser close
- [ ] Prevent session fixation attacks

---

## 🗂️ 5. CODE REVIEW CHECKLIST

Before committing code, verify:

- [ ] No hardcoded credentials or secrets
- [ ] No console.log of sensitive data
- [ ] Input validation on all user inputs
- [ ] Output encoding for XSS prevention
- [ ] Error messages don't expose system info
- [ ] No SQL injection vulnerabilities
- [ ] HTTPS enforced
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] Logging is not excessive
- [ ] Comments explain security decisions

```bash
# Pre-commit hook to prevent secrets
npm install --save-dev husky lint-staged

# .husky/pre-commit
#!/bin/sh
npm run security:scan
npm run lint
npm run test
```

---

## 🔧 6. TOOLS & COMMANDS

### Package.json Scripts

```json
{
  "scripts": {
    "security:audit": "npm audit && npm audit fix",
    "security:scan": "eslint --plugin security src/",
    "security:deps": "npm audit --json > audit.json",
    "security:sast": "sonar-scanner",
    "security:check": "npm run security:audit && npm run security:scan && npm run security:deps",
    "security:secrets": "git-secrets --scan",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "test:security": "npm run security:check"
  }
}
```

### Installation Commands

```bash
# Core security tools
npm install --save-dev eslint eslint-plugin-security
npm install --save-dev helmet express-ratelimit
npm install --save-dev dotenv
npm install --save-dev bcrypt

# Database security
npm install --save-dev mysql2/promise pg/promise

# Input validation
npm install validator sanitize-html

# Git security
npm install -g git-secrets
git secrets --install

# OWASP Dependency Check
npm install --save-dev @owasp/dependency-check-npm

# Snyk
npm install -g snyk
snyk auth
snyk test
```

---

## 📋 7. ENVIRONMENT VARIABLES SECURITY

### .env.example (Safe to commit)
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nest_ledger_db
API_TIMEOUT=5000
LOG_LEVEL=info
```

### .env (DO NOT COMMIT)
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nest_ledger_db
DB_USER=admin
DB_PASSWORD=SecurePassword123!
JWT_SECRET=your-super-secret-jwt-key
API_KEY=sk_test_4eC39HqLyjWDarhtT657j
STRIPE_SECRET_KEY=sk_test_xxxxx
```

### Verification
```bash
# Ensure .env is in .gitignore
echo ".env" >> .gitignore

# Check if any .env was committed
git log --all --source -- ".env"

# Find secrets in code
npm install --save-dev detect-secrets
detect-secrets scan
```

---

## 🔍 8. REGULAR AUDIT SCHEDULE

### Daily
```bash
# Check for new vulnerabilities
npm audit
```

### Weekly
```bash
# Run full security scan
npm run security:check
```

### Monthly
- [ ] Review access logs
- [ ] Review failed login attempts
- [ ] Audit user permissions
- [ ] Check for outdated dependencies
- [ ] Review security patches

### Quarterly
- [ ] Penetration testing
- [ ] Security audit
- [ ] Compliance review
- [ ] Update security policies

---

## 🚀 9. CI/CD SECURITY INTEGRATION

### GitHub Actions Workflow

```yaml
name: Security Scan
on: [push, pull_request]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install dependencies
        run: npm install
      
      - name: Run npm audit
        run: npm audit --audit-level=moderate
      
      - name: Run security linting
        run: npm run lint -- --plugin security
      
      - name: Check for secrets
        run: git secrets --scan
      
      - name: OWASP Dependency Check
        run: npx @owasp/dependency-check --project "Nest Ledger" --scan .
      
      - name: Snyk Security Scan
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        run: npx snyk test
```

---

## 📊 10. SECURITY METRICS & REPORTING

### Track These Metrics

```javascript
{
  "vulnerabilities": {
    "critical": 0,
    "high": 0,
    "medium": 0,
    "low": 0
  },
  "codeQuality": {
    "duplicateLines": "< 5%",
    "complexity": "< 15",
    "coverage": "> 80%"
  },
  "dependencies": {
    "outdated": 0,
    "vulnerable": 0
  },
  "failedLogins": "< 10 per day per user",
  "apiRateLimitViolations": "< 1%"
}
```

### Generate Reports

```bash
# Generate audit report
npm audit --json > security-report.json

# Code quality report
sonar-scanner -Dsonar.sources=src

# Coverage report
npm test -- --coverage
```

---

## ✅ 11. DEPLOYMENT CHECKLIST

Before deploying to production:

- [ ] All dependencies updated and audited
- [ ] No console.log statements in code
- [ ] Environment variables set correctly
- [ ] Database migrations tested
- [ ] SSL/TLS certificates valid
- [ ] API rate limiting enabled
- [ ] Logging and monitoring configured
- [ ] Backup procedures tested
- [ ] Disaster recovery plan documented
- [ ] Security headers configured
- [ ] CORS properly restricted
- [ ] Database credentials rotated
- [ ] All secrets removed from code
- [ ] Security tests passing
- [ ] Penetration testing completed

---

## 🔐 12. SECURITY HEADERS

### Express.js Configuration

```javascript
const helmet = require('helmet');

app.use(helmet());

// Custom security headers
app.use((req, res, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prevent MIME sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // CSP
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  
  // HSTS
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  
  next();
});

// CORS Configuration
const cors = require('cors');
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

## 📞 13. INCIDENT RESPONSE

### If Vulnerability Found

1. **Assess Severity**
   - Critical: Patch immediately
   - High: Patch within 24 hours
   - Medium: Patch within 1 week
   - Low: Patch within 1 month

2. **Develop Patch**
   - Create secure fix
   - Test thoroughly
   - Review by another developer

3. **Deploy**
   - Deploy to staging first
   - Run full test suite
   - Deploy to production
   - Monitor for issues

4. **Document**
   - Log incident
   - Document fix
   - Update security policies
   - Notify users if necessary

---

## 🎯 14. COMPLIANCE REQUIREMENTS

### Standards to Follow

- [ ] OWASP Top 10
- [ ] NIST Cybersecurity Framework
- [ ] PCI DSS (if handling payments)
- [ ] GDPR (if EU users)
- [ ] SOC 2 (if required by clients)

### Audit Trail

```javascript
// Log all sensitive actions
const auditLog = (userId, action, details) => {
  const log = {
    timestamp: new Date(),
    userId,
    action,
    details,
    ipAddress: req.ip
  };
  // Store in database
  AuditLog.create(log);
};

app.post('/api/delete-account', (req, res) => {
  auditLog(req.user.id, 'DELETE_ACCOUNT', { deletedAt: new Date() });
  // ... delete account
});
```

---

## 📚 15. RESOURCES & REFERENCES

### Documentation
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheets](https://cheatsheetseries.owasp.org/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security](https://expressjs.com/en/advanced/best-practice-security.html)

### Tools
- npm audit
- Snyk (https://snyk.io/)
- SonarQube
- OWASP ZAP
- Burp Suite Community
- git-secrets

### Communities
- OWASP
- Node.js Security Working Group
- GitHub Security Advisory

---

## 📝 CHECKLIST SUMMARY

```
BEFORE EVERY COMMIT:
☐ npm audit
☐ npm run lint
☐ npm run test
☐ No console.log of sensitive data
☐ No hardcoded secrets
☐ Input validation added
☐ Security headers checked

BEFORE EVERY DEPLOYMENT:
☐ Full security scan passed
☐ All tests passing
☐ No vulnerabilities
☐ Environment variables set
☐ SSL/TLS configured
☐ Backup tested
☐ Monitoring configured
☐ Rate limiting enabled
☐ Database secured
☐ Logging reviewed

MONTHLY:
☐ Update dependencies
☐ Review access logs
☐ Audit user permissions
☐ Check compliance

QUARTERLY:
☐ Penetration testing
☐ Security audit
☐ Policy review
```

---

**Last Updated:** 2024  
**Version:** 1.0  
**Owner:** Security Team  
**Next Review:** Quarterly