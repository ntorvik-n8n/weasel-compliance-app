import type { FileMetadata } from '@/types/fileManagement';

// In-memory mock storage for testing - this persists between API calls during development
// Note: This will reset when the dev server restarts
let mockFiles: FileMetadata[] = [
  {
    id: 'standard-call.json',
    name: 'standard-call.json',
    originalName: 'standard-call.json',
    size: 1289,
    type: 'application/json',
    uploadedAt: new Date('2025-10-12T06:15:19.000Z'),
    lastModified: new Date('2025-10-12T06:15:19.000Z'),
    url: '',
    status: 'uploaded',
    callId: 'CALL-2025-001',
    agentName: 'John Smith',
    agentId: 'AGT-101',
    callDuration: 323,
    callTimestamp: '2025-10-10T09:30:00Z',
    riskScore: undefined
  },
  {
    id: 'compliant-call.json',
    name: 'compliant-call.json',
    originalName: 'compliant-call.json',
    size: 1498,
    type: 'application/json',
    uploadedAt: new Date('2025-10-12T01:56:42.000Z'),
    lastModified: new Date('2025-10-12T01:56:42.000Z'),
    url: '',
    status: 'analyzed',
    callId: 'CALL-2025-002',
    agentName: 'Jane Smith',
    agentId: 'AGT-102',
    callDuration: 245,
    callTimestamp: '2025-10-10T10:15:00Z',
    riskScore: 2
  },
  {
    id: 'high-risk-call.json',
    name: 'high-risk-call.json',
    originalName: 'high-risk-call.json',
    size: 1357,
    type: 'application/json',
    uploadedAt: new Date('2025-10-12T01:56:25.000Z'),
    lastModified: new Date('2025-10-12T01:56:25.000Z'),
    url: '',
    status: 'analyzed',
    callId: 'CALL-2025-003',
    agentName: 'Mike Wilson',
    agentId: 'AGT-103',
    callDuration: 380,
    callTimestamp: '2025-10-10T11:30:00Z',
    riskScore: 9
  }
];

export class MockStorageService {
  /**
   * Get all files
   */
  static getFiles(): FileMetadata[] {
    return [...mockFiles]; // Return a copy to prevent mutations
  }

  /**
   * Delete a file by name and uploadedAt
   */
  static deleteFile(filename: string, uploadedAt: string): boolean {
    const fileIndex = mockFiles.findIndex(
      file => file.name === filename && file.uploadedAt.toISOString() === uploadedAt
    );

    if (fileIndex !== -1) {
      mockFiles.splice(fileIndex, 1);
      return true;
    }
    return false;
  }

  /**
   * Add a new file (for upload testing)
   */
  static addFile(file: Omit<FileMetadata, 'id'>): FileMetadata {
    const newFile: FileMetadata = {
      ...file,
      id: file.name,
      uploadedAt: new Date(file.uploadedAt),
      lastModified: new Date(file.uploadedAt)
    };
    mockFiles.push(newFile);
    return newFile;
  }

  /**
   * Check if file exists
   */
  static fileExists(filename: string, uploadedAt: string): boolean {
    return mockFiles.some(
      file => file.name === filename && file.uploadedAt.toISOString() === uploadedAt
    );
  }

  /**
   * Clear all files (for testing)
   */
  static clearAllFiles(): void {
    mockFiles = [];
  }

  /**
   * Reset to initial state
   */
  static resetToInitialState(): void {
    mockFiles = [
      {
        id: 'standard-call.json',
        name: 'standard-call.json',
        originalName: 'standard-call.json',
        size: 1289,
        type: 'application/json',
        uploadedAt: new Date('2025-10-12T06:15:19.000Z'),
        lastModified: new Date('2025-10-12T06:15:19.000Z'),
        url: '',
        status: 'uploaded',
        callId: 'CALL-2025-001',
        agentName: 'John Smith',
        agentId: 'AGT-101',
        callDuration: 323,
        callTimestamp: '2025-10-10T09:30:00Z',
        riskScore: undefined
      },
      {
        id: 'compliant-call.json',
        name: 'compliant-call.json',
        originalName: 'compliant-call.json',
        size: 1498,
        type: 'application/json',
        uploadedAt: new Date('2025-10-12T01:56:42.000Z'),
        lastModified: new Date('2025-10-12T01:56:42.000Z'),
        url: '',
        status: 'analyzed',
        callId: 'CALL-2025-002',
        agentName: 'Jane Smith',
        agentId: 'AGT-102',
        callDuration: 245,
        callTimestamp: '2025-10-10T10:15:00Z',
        riskScore: 2
      },
      {
        id: 'high-risk-call.json',
        name: 'high-risk-call.json',
        originalName: 'high-risk-call.json',
        size: 1357,
        type: 'application/json',
        uploadedAt: new Date('2025-10-12T01:56:25.000Z'),
        lastModified: new Date('2025-10-12T01:56:25.000Z'),
        url: '',
        status: 'analyzed',
        callId: 'CALL-2025-003',
        agentName: 'Mike Wilson',
        agentId: 'AGT-103',
        callDuration: 380,
        callTimestamp: '2025-10-10T11:30:00Z',
        riskScore: 9
      }
    ];
  }
}