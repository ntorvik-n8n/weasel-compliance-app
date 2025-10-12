import { NextResponse } from 'next/server';
import { getBlobStorageService } from '@/lib/azure/blobStorageClient';

/**
 * DELETE /api/admin/clear-storage
 * Clear all files from Azure Blob Storage (for development/testing only)
 */
export async function DELETE() {
  try {
    const blobService = getBlobStorageService();

    // List all files
    const fileList = await blobService.listFiles();
    const allFiles = fileList.files;

    console.log(`[Clear Storage] Found ${allFiles.length} files to delete`);

    // Delete each file
    let successCount = 0;
    let failCount = 0;

    for (const file of allFiles) {
      try {
        if (file.uploadedAt) {
          const uploadDate = new Date(file.uploadedAt);
          await blobService.deleteFile(file.name, uploadDate, 'raw');
          await blobService.deleteFile(file.name, uploadDate, 'processed').catch(() => {});
          successCount++;
          console.log(`[Clear Storage] Deleted: ${file.name}`);
        }
      } catch (error) {
        failCount++;
        console.error(`[Clear Storage] Failed to delete ${file.name}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Storage cleared. Deleted ${successCount} files, ${failCount} failures.`,
      deletedCount: successCount,
      failedCount: failCount,
    });

  } catch (error) {
    console.error('[Clear Storage] Error:', error);
    return NextResponse.json(
      { error: 'Failed to clear storage', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
