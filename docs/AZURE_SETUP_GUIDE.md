# Azure Blob Storage Setup Guide

**Project:** Weasel (Collections Call Monitor Evaluation App)
**Last Updated:** 2025-10-10

This guide explains how to set up Azure Blob Storage for the Weasel application.

---

## Overview

Weasel uses Azure Blob Storage to persist call log files with the following architecture:

- **Container: `call-logs-raw`** - Original uploaded call log files
- **Container: `call-logs-processed`** - AI-analyzed files with FDCPA compliance results
- **Container: `call-logs-backups`** - Backup copies created during file replacement

Files are organized with date-based paths: `/YYYY/MM/DD/filename.json`

---

## Prerequisites

- Azure subscription (free tier works for POC)
- Azure CLI installed (optional, for command-line setup)
- Node.js 18+ and npm installed

---

## Option 1: Azure Portal Setup (Recommended for POC)

### Step 1: Create Storage Account

1. Go to [Azure Portal](https://portal.azure.com)
2. Click **"Create a resource"** → **"Storage account"**
3. Fill in the following:
   - **Subscription:** Your Azure subscription
   - **Resource group:** Create new or select existing (e.g., `rg-weasel-poc`)
   - **Storage account name:** `weaselstorage` (must be globally unique, lowercase, no spaces)
   - **Region:** Choose region close to your users (e.g., `East US`)
   - **Performance:** **Standard** (suitable for POC)
   - **Redundancy:** **LRS (Locally Redundant Storage)** (cheapest for POC)
4. Click **"Review + create"** → **"Create"**
5. Wait for deployment to complete

### Step 2: Get Connection String

1. Once deployed, go to the storage account
2. In the left menu, click **"Access keys"** under **"Security + networking"**
3. Click **"Show"** next to **key1** → **Connection string**
4. Copy the connection string (starts with `DefaultEndpointsProtocol=https;AccountName=...`)
5. **IMPORTANT:** Keep this secret! Never commit to Git.

### Step 3: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   copy .env.example .env.local  # Windows
   cp .env.example .env.local    # Mac/Linux
   ```

2. Edit `.env.local` and add your connection string:
   ```bash
   AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=weaselstorage;AccountKey=YOUR_KEY;EndpointSuffix=core.windows.net
   AZURE_STORAGE_CONTAINER_RAW=call-logs-raw
   AZURE_STORAGE_CONTAINER_PROCESSED=call-logs-processed
   AZURE_STORAGE_CONTAINER_BACKUPS=call-logs-backups
   ```

3. **Verify `.env.local` is in `.gitignore`** to prevent accidental commits

### Step 4: Initialize Containers

Run the initialization endpoint to create the three required containers:

#### Option A: Using the API (when app is running)

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Call the initialization endpoint:
   ```bash
   # Windows (PowerShell)
   Invoke-WebRequest -Method POST http://localhost:3000/api/admin/init-storage

   # Mac/Linux
   curl -X POST http://localhost:3000/api/admin/init-storage
   ```

3. You should see:
   ```json
   {
     "success": true,
     "message": "Azure Blob Storage initialized successfully",
     "containers": {
       "raw": "call-logs-raw",
       "processed": "call-logs-processed",
       "backups": "call-logs-backups"
     }
   }
   ```

#### Option B: Verify in Azure Portal

1. Go to your storage account in Azure Portal
2. Click **"Containers"** under **"Data storage"**
3. You should see three containers:
   - `call-logs-raw`
   - `call-logs-processed`
   - `call-logs-backups`

---

## Option 2: Azure CLI Setup (Advanced)

### Step 1: Install Azure CLI

```bash
# Windows (using winget)
winget install Microsoft.AzureCLI

# Mac (using Homebrew)
brew install azure-cli

# Linux
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
```

### Step 2: Login to Azure

```bash
az login
```

### Step 3: Create Storage Account

```bash
# Set variables
RESOURCE_GROUP="rg-weasel-poc"
LOCATION="eastus"
STORAGE_ACCOUNT="weaselstorage"

# Create resource group
az group create --name $RESOURCE_GROUP --location $LOCATION

# Create storage account
az storage account create \
  --name $STORAGE_ACCOUNT \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --sku Standard_LRS \
  --kind StorageV2

# Get connection string
az storage account show-connection-string \
  --name $STORAGE_ACCOUNT \
  --resource-group $RESOURCE_GROUP \
  --output tsv
```

### Step 4: Create Containers

```bash
# Get connection string
CONNECTION_STRING=$(az storage account show-connection-string \
  --name $STORAGE_ACCOUNT \
  --resource-group $RESOURCE_GROUP \
  --output tsv)

# Create containers
az storage container create --name call-logs-raw --connection-string $CONNECTION_STRING
az storage container create --name call-logs-processed --connection-string $CONNECTION_STRING
az storage container create --name call-logs-backups --connection-string $CONNECTION_STRING

# Verify containers
az storage container list --connection-string $CONNECTION_STRING --output table
```

---

## Verifying the Setup

### Test Connection

Run the health check endpoint:

```bash
# Windows (PowerShell)
Invoke-WebRequest -Method GET http://localhost:3000/api/admin/init-storage

# Mac/Linux
curl http://localhost:3000/api/admin/init-storage
```

Expected response:
```json
{
  "status": "connected",
  "message": "Azure Blob Storage is connected and containers exist",
  "containers": {
    "raw": "call-logs-raw",
    "processed": "call-logs-processed",
    "backups": "call-logs-backups"
  }
}
```

### Test File Upload

1. Navigate to http://localhost:3000/test/upload
2. Upload a sample JSON file
3. Check Azure Portal → Storage Account → Containers → `call-logs-raw`
4. You should see your file under `/YYYY/MM/DD/filename.json`

---

## Security Best Practices

### For Development

✅ **DO:**
- Use `.env.local` for connection strings
- Verify `.env.local` is in `.gitignore`
- Never commit connection strings to Git
- Rotate keys if accidentally exposed

❌ **DON'T:**
- Commit `.env.local` to version control
- Share connection strings in chat/email
- Use production keys in development

### For Production

1. **Use Azure Key Vault** instead of environment variables:
   ```typescript
   // lib/azure/keyVaultClient.ts
   import { SecretClient } from '@azure/keyvault-secrets';
   import { DefaultAzureCredential } from '@azure/identity';

   const credential = new DefaultAzureCredential();
   const client = new SecretClient(
     process.env.AZURE_KEY_VAULT_URL!,
     credential
   );

   const secret = await client.getSecret('storage-connection-string');
   const connectionString = secret.value;
   ```

2. **Use Managed Identity** for authentication (no connection strings!)

3. **Enable Soft Delete** for recovery:
   ```bash
   az storage account blob-service-properties update \
     --account-name $STORAGE_ACCOUNT \
     --enable-delete-retention true \
     --delete-retention-days 7
   ```

4. **Enable Versioning** for accidental overwrites:
   ```bash
   az storage account blob-service-properties update \
     --account-name $STORAGE_ACCOUNT \
     --enable-versioning true
   ```

5. **Set up Lifecycle Policies** to manage costs:
   - Move old files to Cool tier after 30 days
   - Delete backups after 90 days

---

## Troubleshooting

### Error: "AZURE_STORAGE_CONNECTION_STRING environment variable is not set"

**Solution:** Make sure `.env.local` exists and contains the connection string. Restart your dev server after creating/editing `.env.local`.

### Error: "Container already exists"

**Solution:** This is not an error! The initialization is idempotent and will succeed even if containers already exist.

### Error: "Authorization failed" or "403 Forbidden"

**Solution:**
1. Verify your connection string is correct
2. Check that you copied the entire connection string (it's very long)
3. Ensure the storage account key hasn't been rotated
4. Try regenerating the key in Azure Portal → Access keys

### Error: "The specified container does not exist"

**Solution:** Run the initialization endpoint to create containers:
```bash
curl -X POST http://localhost:3000/api/admin/init-storage
```

### Files not appearing in Azure Portal

**Solution:**
1. Wait a few seconds and refresh the Azure Portal
2. Check the correct container (`call-logs-raw` for uploads)
3. Navigate into the date-based folder structure: `/YYYY/MM/DD/`
4. Check browser console for upload errors

---

## Cost Management

### POC Cost Estimates

Based on typical usage for proof of concept:

| Resource | Usage | Cost/Month |
|----------|-------|------------|
| Storage (LRS) | 5GB | $0.10 |
| Transactions (Write) | 5,000 uploads | $0.02 |
| Transactions (Read) | 10,000 reads | $0.004 |
| **Total** | | **~$0.12/month** |

### Monitoring Costs

1. Go to Azure Portal → Storage Account → **Cost Analysis**
2. View daily costs and trends
3. Set up budget alerts:
   ```bash
   az consumption budget create \
     --budget-name "weasel-storage-budget" \
     --amount 10 \
     --time-grain Monthly \
     --resource-group $RESOURCE_GROUP
   ```

---

## Local Development with Azurite (Optional)

For fully offline development, use the Azurite emulator:

### Install Azurite

```bash
npm install -g azurite
```

### Start Azurite

```bash
azurite --silent --location ./azurite-data
```

### Configure Connection String

Use the Azurite connection string in `.env.local`:

```bash
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;
```

**Note:** This only works locally. Files won't persist to Azure.

---

## Next Steps

1. ✅ Azure Blob Storage configured
2. ✅ Containers created and verified
3. ✅ Connection tested
4. → Proceed with file uploads and analysis
5. → Set up Azure Application Insights for monitoring (optional)

---

## Resources

- [Azure Blob Storage Documentation](https://learn.microsoft.com/en-us/azure/storage/blobs/)
- [Azure Storage Pricing](https://azure.microsoft.com/en-us/pricing/details/storage/blobs/)
- [Azure Key Vault Documentation](https://learn.microsoft.com/en-us/azure/key-vault/)
- [Azurite Emulator](https://github.com/Azure/Azurite)

---

**Questions or Issues?**
Check the [troubleshooting section](#troubleshooting) or create an issue in the project repository.
