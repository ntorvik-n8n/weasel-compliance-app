import { getBlobStorageService } from '@/lib/azure/blobStorageClient';

type AzureMockState = {
  upload: jest.Mock;
  getProperties: jest.Mock;
  setMetadata: jest.Mock;
  exists: jest.Mock;
  delete: jest.Mock;
  download: jest.Mock;
  beginCopyFromURL: jest.Mock;
  getContainerClient: jest.Mock;
};

jest.mock('@azure/storage-blob', () => {
  const mockState: AzureMockState = {
    upload: jest.fn(),
    getProperties: jest.fn(),
    setMetadata: jest.fn(),
    exists: jest.fn(),
    delete: jest.fn(),
    download: jest.fn(),
    beginCopyFromURL: jest.fn(),
    getContainerClient: jest.fn(),
  };

  const blockBlobClient = {
    upload: mockState.upload,
    getProperties: mockState.getProperties,
    setMetadata: mockState.setMetadata,
    exists: mockState.exists,
    delete: mockState.delete,
    download: mockState.download,
    beginCopyFromURL: mockState.beginCopyFromURL,
  };

  const containerClient = {
    getBlockBlobClient: jest.fn(() => blockBlobClient),
    createIfNotExists: jest.fn(),
    listBlobsFlat: jest.fn(() => ({
      async *[Symbol.asyncIterator]() {
        // No blobs for these tests
      },
    })),
  };

  mockState.getContainerClient.mockImplementation(() => containerClient);

  (globalThis as any).__azureBlobMockState = mockState;

  return {
    BlobServiceClient: {
      fromConnectionString: jest.fn(() => ({
        getContainerClient: mockState.getContainerClient,
      })),
    },
  };
});

describe('BlobStorageService metadata handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    process.env.AZURE_STORAGE_CONNECTION_STRING = 'UseDevelopmentStorage=true;';
    process.env.AZURE_STORAGE_CONTAINER_RAW = 'raw';
    process.env.AZURE_STORAGE_CONTAINER_PROCESSED = 'processed';
    process.env.AZURE_STORAGE_CONTAINER_BACKUPS = 'backups';

    const baseMetadata = {
      originalfilename: 'call-log.json',
      uploadedat: '2025-10-14T12:00:00.000Z',
      size: '512',
      status: 'uploaded',
      contenttype: 'application/json',
      uploaderid: '',
      processingstartedat: '',
      processingcompletedat: '',
      errormessage: '',
      callid: 'CALL-123',
      agentname: 'Agent Smith',
      agentid: 'AGENT-456',
      callduration: '600',
      calltimestamp: '2025-10-14T11:59:00.000Z',
      calloutcome: 'Promise to pay',
      riskscore: '3.5',
    };

    const mockState = (globalThis as any).__azureBlobMockState as AzureMockState;

    mockState.getProperties.mockResolvedValue({ metadata: { ...baseMetadata } });
    mockState.setMetadata.mockImplementation(async () => undefined);
  });

  afterEach(() => {
    delete process.env.AZURE_STORAGE_CONNECTION_STRING;
    delete process.env.AZURE_STORAGE_CONTAINER_RAW;
    delete process.env.AZURE_STORAGE_CONTAINER_PROCESSED;
    delete process.env.AZURE_STORAGE_CONTAINER_BACKUPS;
  });

  it('serializes merged metadata with lowercase keys and string values', async () => {
    const service = getBlobStorageService();

    const mockState = (globalThis as any).__azureBlobMockState as AzureMockState;

    await service.updateMetadata('call-log.json', {
      status: 'processing',
      riskScore: '4.2',
    });

    expect(mockState.setMetadata).toHaveBeenCalledTimes(1);
    const [metadataArg] = mockState.setMetadata.mock.calls[0];

    // Ensure keys are lowercase
    expect(Object.keys(metadataArg).every(key => key === key.toLowerCase())).toBe(true);

    expect(metadataArg).toMatchObject({
      originalfilename: 'call-log.json',
      uploadedat: '2025-10-14T12:00:00.000Z',
      size: '512',
      status: 'processing',
      contenttype: 'application/json',
      riskscore: '4.2',
    });

    // No camelCase remnants should exist
    expect(metadataArg.originalFilename).toBeUndefined();
    expect(metadataArg.uploadedAt).toBeUndefined();
  });

  it('deserializes lowercase metadata back into FileMetadata shape', async () => {
    const service = getBlobStorageService();

    const mockState = (globalThis as any).__azureBlobMockState as AzureMockState;

    mockState.getProperties.mockResolvedValueOnce({
      metadata: {
        originalfilename: 'call-log.json',
        uploadedat: '2025-10-14T12:00:00.000Z',
        size: '512',
        status: 'uploaded',
        contenttype: 'application/json',
        uploaderid: '',
        processingstartedat: '',
        processingcompletedat: '',
        errormessage: '',
        callid: 'CALL-123',
        agentname: 'Agent Smith',
        agentid: 'AGENT-456',
        callduration: '600',
        calltimestamp: '2025-10-14T11:59:00.000Z',
        calloutcome: 'Promise to pay',
        riskscore: '3.5',
      },
    });

    const metadata = await service.getFileMetadata('call-log.json');

    expect(metadata).not.toBeNull();
    expect(metadata?.originalFilename).toBe('call-log.json');
    expect(metadata?.status).toBe('uploaded');
    expect(metadata?.size).toBe(512);
    expect(metadata?.contentType).toBe('application/json');
    expect(metadata?.callId).toBe('CALL-123');
    expect(metadata?.riskScore).toBe('3.5');
  });
});
