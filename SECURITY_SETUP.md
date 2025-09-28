# 🔐 Security Setup Guide

## ⚠️ IMPORTANT: Complete These Security Steps Immediately

### 1. **Secure Your Database Credentials**

1. **Create a new `.env` file** in `/backend/` folder with your OWN credentials:

```
PORT=4000
MONGO_URI=your_new_mongodb_connection_string
JWT_SECRET=your_super_secret_random_string_here_change_this
```

2. **Never commit the `.env` file** to git (it's now in .gitignore)

### 2. **Create Your Personal Admin Account**

Run this command to create YOUR private admin account:

```bash
cd backend
node src/createPersonalAdmin.js
```

**This will:**

- Generate a secure random password for YOU
- Create an admin account with YOUR email
- Remove all test admin accounts
- Give you private credentials to manage your site

### 3. **Change the Default Email**

In `createPersonalAdmin.js`, change this line:

```javascript
email: 'owner@yourcompany.com', // Change this to YOUR real email
```

### 4. **Security Best Practices**

✅ **DO:**

- Use a strong, unique password
- Store credentials in a password manager
- Use your real email address
- Keep admin credentials private
- Regularly change passwords

❌ **DON'T:**

- Share admin credentials
- Use simple passwords
- Commit credentials to git
- Leave test accounts active
- Use the same password everywhere

### 5. **Remove Public Credentials**

The following accounts are now REMOVED for security:

- `admin@codveda.com`
- `superadmin@codveda.com`
- `admin@example.com`

### 6. **Deploy Securely**

When deploying to production:

- Use environment variables for all secrets
- Use HTTPS only
- Set up proper firewall rules
- Monitor for unauthorized access
- Regular security audits

## 🚨 If Credentials Are Compromised

If someone gains access to your admin account:

1. Change password immediately
2. Check for unauthorized changes
3. Review audit logs
4. Consider regenerating JWT secrets
5. Monitor for suspicious activity

## 📞 Need Help?

If you need assistance with security setup, consider hiring a cybersecurity professional to audit your application.
