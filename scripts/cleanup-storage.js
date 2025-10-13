/**
 * Cleanup Script - Delete ALL blobs from Azure Storage
 * WARNING: This will delete EVERYTHING in all containers
 */

const { BlobServiceClient } = require('@azure/storage-blob');

async function cleanupAllContainers() {
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

  if (!connectionString) {
    console.error('Error: AZURE_STORAGE_CONNECTION_STRING not found in environment');
    process.exit(1);
  }

  const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

  const containers = [
    'call-logs-raw',
    'call-logs-processed',
    'call-logs-backups'
  ];

  for (const containerName of containers) {
    console.log(`\n🧹 Cleaning container: ${containerName}`);
    const containerClient = blobServiceClient.getContainerClient(containerName);

    try {
      // Check if container exists
      const exists = await containerClient.exists();
      if (!exists) {
        console.log(`  ⚠️  Container does not exist, skipping`);
        continue;
      }

      let deletedCount = 0;

      // List all blobs in the container
      for await (const blob of containerClient.listBlobsFlat()) {
        console.log(`  🗑️  Deleting: ${blob.name}`);
        try {
          await containerClient.deleteBlob(blob.name);
          deletedCount++;
        } catch (err) {
          console.error(`  ❌ Failed to delete ${blob.name}:`, err.message);
        }
      }

      console.log(`  ✅ Deleted ${deletedCount} blobs from ${containerName}`);
    } catch (err) {
      console.error(`  ❌ Error accessing container ${containerName}:`, err.message);
    }
  }

  console.log('\n✨ Cleanup complete!');
}

cleanupAllContainers().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
