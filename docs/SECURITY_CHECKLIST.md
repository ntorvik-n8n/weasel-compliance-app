# Security Best Practices - Weasel Compliance Monitor

## Environment Variables & Secrets Management

### ✅ Current Security Posture

**What's Protected:**
- ✅ Anthropic API keys stored in Azure Static Web App configuration (NOT in Git)
- ✅ Azure Storage connection strings stored in Azure Static Web App configuration (NOT in Git)
- ✅ `.env` file excluded from version control
- ✅ No secrets in Git history

**What's in Git History (Low Risk):**
- Azure Subscription ID: `5bd36c9b-9223-40e7-90e7-62661752a23c` (public identifier, not a secret)
- Azure Tenant ID: `7bbb31bb-c849-4730-b411-2c2d3ddf23fa` (public identifier, not a secret)

### 🔒 Secret Storage Locations

**Production (Azure Static Web Apps):**
```
Azure Portal → Static Web App → Configuration → Application settings
- ANTHROPIC_API_KEY: [Stored securely in Azure]
- AZURE_STORAGE_CONNECTION_STRING: [Stored securely in Azure]
```

**Local Development:**
```
.env (local file, NOT in Git)
- AZURE_SUBSCRIPTION_ID
- AZURE_TENANT_ID
- ANTHROPIC_API_KEY (for local testing)
- AZURE_STORAGE_CONNECTION_STRING (for local testing)
```

### 📋 Security Checklist

**Before Every Commit:**
- [ ] Run `git status` to check staged files
- [ ] Verify no `.env`, `.env.local`, or secret files are staged
- [ ] Check diff for any API keys, passwords, or connection strings
- [ ] Use `.env.example` for documentation, never actual values

**Setting Up New Developers:**
1. Clone repository
2. Copy `.env.example` to `.env`
3. Get secrets from Azure Portal or team lead
4. Never commit `.env` to Git

**Rotating Secrets:**
- [ ] Update in Azure Static Web App configuration
- [ ] Update local `.env` files (notify team)
- [ ] Test deployment after rotation
- [ ] Document rotation date

### 🚨 If Secrets Are Exposed

**Immediate Actions:**
1. **Rotate exposed secrets immediately**
   - Azure Storage: Regenerate access keys
   - Anthropic: Regenerate API key
2. **Remove from Git history** (use BFG Repo-Cleaner or git filter-branch)
3. **Force push** to rewrite public history
4. **Notify team** if private repo with collaborators
5. **Monitor for abuse** (Azure cost anomalies, API usage spikes)

### 🔍 Regular Security Audits

**Monthly:**
- [ ] Review Azure cost reports for anomalies
- [ ] Check API usage patterns
- [ ] Verify no unauthorized access in Azure logs

**Quarterly:**
- [ ] Rotate API keys
- [ ] Review Git history for accidental commits
- [ ] Update dependencies (`npm audit`)
- [ ] Review access controls

### 📚 Additional Resources

- [Azure Key Vault](https://learn.microsoft.com/en-us/azure/key-vault/) - For production secret management
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning) - Automated detection
- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/) - Remove secrets from Git history
- [OWASP Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

---

**Last Updated:** October 20, 2025  
**Status:** ✅ Secure - No secrets exposed
