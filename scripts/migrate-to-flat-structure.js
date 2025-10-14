/**
 * Migration script to flatten date-partitioned blob structure
 * Moves files from YYYY/MM/DD/filename.json to flat filename.json structure
 *
 * Usage: node scripts/migrate-to-flat-structure.js
 */

const { BlobServiceClient } = require('@azure/storage-blob');

// Load environment variables from .env.local manually
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      process.env[match[1].trim()] = match[2].trim();
    }
  });
}

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const rawContainer = process.env.AZURE_STORAGE_CONTAINER_RAW || 'call-logs-raw';
const processedContainer = process.env.AZURE_STORAGE_CONTAINER_PROCESSED || 'call-logs-processed';
const backupsContainer = process.env.AZURE_STORAGE_CONTAINER_BACKUPS || 'call-logs-backups';

if (!connectionString) {
  console.error('❌ AZURE_STORAGE_CONNECTION_STRING not found in environment');
  process.exit(1);
}

const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

async function migrateContainer(containerName) {
  console.log(`\n📦 Migrating container: ${containerName}`);
  const containerClient = blobServiceClient.getContainerClient(containerName);

  let migratedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  try {
    // List all blobs with date-partitioned paths (YYYY/MM/DD/filename pattern)
    const iterator = containerClient.listBlobsFlat({ includeMetadata: true });

    for await (const blob of iterator) {
      // Check if blob has date-partitioned path
      const pathParts = blob.name.split('/');

      if (pathParts.length === 4) {
        // Date-partitioned: YYYY/MM/DD/filename.json
        const [year, month, day, filename] = pathParts;

        // Validate it's actually a date partition
        if (/^\d{4}$/.test(year) && /^\d{2}$/.test(month) && /^\d{2}$/.test(day)) {
          console.log(`  📄 Found date-partitioned file: ${blob.name}`);

          try {
            // Check if flat version already exists
            const flatBlobClient = containerClient.getBlockBlobClient(filename);
            const exists = await flatBlobClient.exists();

            if (exists) {
              console.log(`  ⏭️  Flat file already exists, skipping: ${filename}`);
              skippedCount++;
              continue;
            }

            // Copy to flat structure
            const sourceBlobClient = containerClient.getBlockBlobClient(blob.name);
            await flatBlobClient.beginCopyFromURL(sourceBlobClient.url);

            // Wait for copy to complete (check status)
            let copyCompleted = false;
            for (let i = 0; i < 30; i++) {
              const props = await flatBlobClient.getProperties();
              if (props.copyStatus === 'success') {
                copyCompleted = true;
                break;
              }
              if (props.copyStatus === 'failed') {
                throw new Error(`Copy failed: ${props.copyStatusDescription}`);
              }
              // Wait 1 second before checking again
              await new Promise(resolve => setTimeout(resolve, 1000));
            }

            if (!copyCompleted) {
              throw new Error('Copy operation timed out');
            }

            // Copy metadata if present
            if (blob.metadata) {
              await flatBlobClient.setMetadata(blob.metadata);
            }

            console.log(`  ✅ Migrated: ${blob.name} → ${filename}`);
            migratedCount++;

            // Optional: Delete old date-partitioned file after successful migration
            // Uncomment the following lines to enable cleanup
            // await sourceBlobClient.delete();
            // console.log(`  🗑️  Deleted old file: ${blob.name}`);

          } catch (error) {
            console.error(`  ❌ Error migrating ${blob.name}:`, error.message);
            errorCount++;
          }
        }
      } else if (pathParts.length === 1) {
        // Already flat structure
        skippedCount++;
      }
    }

    console.log(`\n✅ Container ${containerName} migration complete:`);
    console.log(`   - Migrated: ${migratedCount}`);
    console.log(`   - Skipped: ${skippedCount}`);
    console.log(`   - Errors: ${errorCount}`);

  } catch (error) {
    console.error(`❌ Failed to migrate container ${containerName}:`, error);
  }
}

async function main() {
  console.log('🚀 Starting blob storage migration to flat structure...');
  console.log(`📡 Connection: ${connectionString.substring(0, 50)}...`);

  // Migrate all three containers
  await migrateContainer(rawContainer);
  await migrateContainer(processedContainer);
  await migrateContainer(backupsContainer);

  console.log('\n🎉 Migration complete!');
  console.log('\n⚠️  Note: Old date-partitioned files are NOT deleted automatically.');
  console.log('   Review the migrated files, then manually delete old files or');
  console.log('   uncomment the delete lines in this script to enable auto-cleanup.');
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
