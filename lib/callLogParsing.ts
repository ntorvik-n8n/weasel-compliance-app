/**
 * Call Log Parsing Utilities
 *
 * Extracts metadata from call log JSON files for display in lists and dashboards.
 */

import type { CallLog } from '@/types/callLog';
import type { FileMetadata } from '@/types/fileManagement';

/**
 * Parses the raw JSON content of a call log file to extract key metadata.
 *
 * @param json - The parsed JSON object from a call log file.
 * @returns An object containing the extracted metadata.
 */
export function parseCallLogMetadata(json: CallLog): Partial<FileMetadata> {
  // Parse duration - handle both "HH:MM:SS" string format and numeric values
  let durationInSeconds: number | undefined;
  if (typeof json.duration === 'string') {
    // Parse "HH:MM:SS" or "MM:SS" format
    const parts = json.duration.split(':').map(p => parseInt(p, 10));
    if (parts.length === 3) {
      // HH:MM:SS
      durationInSeconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      // MM:SS
      durationInSeconds = parts[0] * 60 + parts[1];
    }
  } else if (typeof json.duration === 'number') {
    durationInSeconds = json.duration;
  }

  return {
    callId: json.callId,
    agentName: json.agentName,
    agentId: json.agentId,
    callDuration: durationInSeconds,
    callTimestamp: json.timestamp,
    // riskAssessment will be added in Epic 3
  };
}

/**
 * Formats a duration from seconds into a MM:SS string format.
 *
 * @param seconds - The duration in seconds.
 * @returns A string formatted as MM:SS. Returns 'N/A' if seconds is undefined.
 */
export function formatDuration(seconds: number | undefined): string {
  if (seconds === undefined || seconds === null) {
    return 'N/A';
  }
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Formats a call ID for display, potentially shortening it.
 * Currently, it returns the original ID.
 *
 * @param callId - The call ID string.
 * @returns The formatted call ID. Returns an empty string if callId is undefined.
 */
export function formatCallId(callId: string | undefined): string {
  if (!callId) {
    return '';
  }
  // Example of shortening: 'CLG-2024-10-001' -> '...001'
  // const parts = callId.split('-');
  // return `...${parts[parts.length - 1]}`;
  return callId;
}

/**
 * Format agent name for display
 *
 * @param agentName - Full agent name
 * @returns Formatted agent name
 *
 * @example
 * formatAgentName("John Smith") // "John Smith"
 * formatAgentName("John Michael Smith") // "John M. Smith"
 */
export function formatAgentName(agentName: string): string {
  const trimmed = agentName.trim();
  const parts = trimmed.split(/\s+/);

  if (parts.length <= 2) {
    // First and last name - return trimmed
    return trimmed;
  } else {
    // Multiple names - abbreviate middle names
    const firstName = parts[0];
    const lastName = parts[parts.length - 1];
    const middleInitials = parts
      .slice(1, -1)
      .map((name) => `${name[0]}.`)
      .join(' ');
    return `${firstName} ${middleInitials} ${lastName}`;
  }
}

/**
 * Validate call log JSON structure
 *
 * @param json - Call log JSON object or string
 * @returns Validation result with errors and extracted metadata
 */
export function validateCallLogJSON(
  json: CallLog | string
): { isValid: boolean; errors: string[]; warnings?: string[]; metadata?: Partial<FileMetadata> } {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    const data: CallLog = typeof json === 'string' ? JSON.parse(json) : json;

    // Required fields validation
    if (!data.callId) {
      errors.push('Missing required field: callId');
    }
    if (!data.timestamp) {
      errors.push('Missing required field: timestamp');
    }
    if (!data.duration) {
      errors.push('Missing required field: duration');
    }
    if (!data.agentId) {
      errors.push('Missing required field: agentId');
    }
    if (!data.agentName) {
      errors.push('Missing required field: agentName');
    }
    if (!data.transcript || !Array.isArray(data.transcript)) {
      errors.push('Missing or invalid field: transcript (must be an array)');
    }
    if (!data.metadata || typeof data.metadata !== 'object') {
      errors.push('Missing or invalid field: metadata (must be an object)');
    }

    // Field format validation
    if (data.timestamp && !isValidISODateTime(data.timestamp)) {
      errors.push('Invalid timestamp format (must be ISO 8601)');
    }

    if (data.duration) {
      // Validate duration format (can be string like "HH:MM:SS" or "MM:SS", or a number)
      if (typeof data.duration === 'string') {
        const parts = data.duration.split(':').map(p => parseInt(p, 10));
        if (parts.length < 2 || parts.length > 3 || parts.some(p => isNaN(p))) {
          errors.push('Invalid duration format: must be "MM:SS" or "HH:MM:SS"');
        }
      } else if (typeof data.duration === 'number') {
        if (data.duration < 0 || !isFinite(data.duration)) {
          errors.push('Invalid duration: must be a positive number');
        }
      } else {
        errors.push('Invalid duration type: must be string or number');
      }
    }

    // Transcript validation
    if (Array.isArray(data.transcript)) {
      data.transcript.forEach((entry, index) => {
        if (!entry.speaker || !['agent', 'customer'].includes(entry.speaker)) {
          errors.push(
            `Invalid transcript entry ${index}: speaker must be 'agent' or 'customer'`
          );
        }
        if (!entry.text) {
          warnings.push(`Transcript entry ${index} has empty text`);
        }
      });
    }

    // If validation passes, extract metadata
    let metadata: Partial<FileMetadata> | undefined;
    if (errors.length === 0) {
      try {
        metadata = parseCallLogMetadata(data);
      } catch (error) {
        errors.push(
          `Failed to extract metadata: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings: warnings.length > 0 ? warnings : undefined,
      metadata,
    };
  } catch (error) {
    return {
      isValid: false,
      errors: [
        `Failed to parse JSON: ${error instanceof Error ? error.message : 'Unknown error'}`,
      ],
    };
  }
}

/**
 * Check if a string is a valid ISO 8601 datetime
 */
function isValidISODateTime(dateString: string): boolean {
  const date = new Date(dateString);
  // Just check if it's a valid date, not if it matches ISO format exactly
  // (to handle different valid ISO formats like with/without milliseconds)
  return !isNaN(date.getTime());
}

/**
 * Extract a summary of the call for quick preview
 *
 * @param json - Call log JSON object
 * @returns Summary string
 */
export function extractCallSummary(json: CallLog): string {
  const metadata = parseCallLogMetadata(json);
  const duration = formatDuration(metadata.callDuration);
  const outcome = 'Unknown'; // Assuming outcome is not directly available in CallLog for this summary

  return `${metadata.agentName} | ${duration} | ${outcome}`;
}
