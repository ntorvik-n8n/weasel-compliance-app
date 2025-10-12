/**
 * Type definitions for Call Log data structures
 */

export interface TranscriptTurn {
  speaker: 'agent' | 'customer';
  timestamp: string;
  text: string;
}

export interface CallLog {
  callId: string;
  timestamp: string;
  duration: string;
  agentId: string;
  agentName: string;
  accountNumber: string;
  transcript: TranscriptTurn[];
  metadata: {
    callType: 'inbound' | 'outbound';
    accountBalance: number;
    previousContacts: number;
    callOutcome: string;
  };
}

/**
 * Extracted call log metadata for display in lists
 */
export interface CallLogDisplayMetadata {
  callId: string;
  agentName: string;
  agentId: string;
  callDuration: number; // Duration in seconds
  callTimestamp: string; // ISO 8601 datetime
  accountNumber?: string; // Optional for privacy
  callOutcome?: string;
}

/**
 * Extended file metadata with call log information
 */
export interface CallLogFileMetadata {
  // Base file metadata
  id: string;
  name: string;
  originalName: string;
  size: number;
  type: string;
  uploadedAt: Date;
  lastModified: Date;
  status: 'pending' | 'uploading' | 'success' | 'error';
  processingStatus: 'queued' | 'processing' | 'completed' | 'failed';
  url?: string;
  error?: string;

  // Call log specific metadata
  callLog?: CallLogDisplayMetadata;
}

/**
 * Validation result for call log JSON
 */
export interface CallLogValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
  metadata?: CallLogDisplayMetadata;
}
