import { NextRequest, NextResponse } from 'next/server';
import { getBlobStorageService } from '@/lib/azure/blobStorageClient';

/**
 * POST /api/admin/init-storage
 * Initialize Azure Blob Storage containers
 *
 * This endpoint should be called once during initial setup to create
 * the required containers in Azure Blob Storage.
 *
 * Security Note: In production, this endpoint should be protected with
 * authentication and authorization (admin only).
 */
export async function POST(request: NextRequest) {
  try {
    // TODO: Add authentication check in production
    // const session = await getServerSession();
    // if (!session || !session.user.isAdmin) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    console.log('Starting Azure Blob Storage initialization...');

    // Get Blob Storage service
    const blobService = getBlobStorageService();

    // Initialize containers
    await blobService.initializeContainers();

    console.log('Azure Blob Storage containers initialized successfully');

    return NextResponse.json({
      success: true,
      message: 'Azure Blob Storage initialized successfully',
      containers: {
        raw: process.env.AZURE_STORAGE_CONTAINER_RAW || 'call-logs-raw',
        processed: process.env.AZURE_STORAGE_CONTAINER_PROCESSED || 'call-logs-processed',
        backups: process.env.AZURE_STORAGE_CONTAINER_BACKUPS || 'call-logs-backups',
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Azure Blob Storage initialization failed:', error);

    // Check for specific error types
    if (error instanceof Error) {
      if (error.message.includes('AZURE_STORAGE_CONNECTION_STRING')) {
        return NextResponse.json(
          {
            error: 'Azure Storage not configured',
            details: 'AZURE_STORAGE_CONNECTION_STRING environment variable is not set',
            setup: 'Please configure Azure Storage connection string in .env.local',
          },
          { status: 500 }
        );
      }

      if (error.message.includes('authorization') || error.message.includes('forbidden')) {
        return NextResponse.json(
          {
            error: 'Azure Storage authorization failed',
            details: error.message,
            setup: 'Please check your Azure Storage connection string and permissions',
          },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(
      {
        error: 'Storage initialization failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/init-storage
 * Check Azure Blob Storage connection status
 */
export async function GET(request: NextRequest) {
  try {
    const blobService = getBlobStorageService();

    // Try to list containers (lightweight operation to test connection)
    await blobService.initializeContainers();

    return NextResponse.json({
      status: 'connected',
      message: 'Azure Blob Storage is connected and containers exist',
      containers: {
        raw: process.env.AZURE_STORAGE_CONTAINER_RAW || 'call-logs-raw',
        processed: process.env.AZURE_STORAGE_CONTAINER_PROCESSED || 'call-logs-processed',
        backups: process.env.AZURE_STORAGE_CONTAINER_BACKUPS || 'call-logs-backups',
      },
    });

  } catch (error) {
    console.error('Azure Blob Storage connection check failed:', error);

    if (error instanceof Error && error.message.includes('AZURE_STORAGE_CONNECTION_STRING')) {
      return NextResponse.json(
        {
          status: 'not_configured',
          error: 'Azure Storage connection string not configured',
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}
