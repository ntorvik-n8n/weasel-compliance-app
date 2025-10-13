import type { FileMetadata } from '@/types/fileManagement';
import { formatFileSize } from '@/lib/fileManagement';
import { formatRelativeTime } from '@/lib/timeFormatting';
import { StatusBadge } from '../../StatusBadge';

interface RecentFileItemProps {
  file: FileMetadata;
}

export function RecentFileItem({ file }: RecentFileItemProps) {
  return (
    <li className="flex items-center justify-between py-2">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
        <p className="text-sm text-gray-500">
          {formatRelativeTime(file.uploadedAt)} &middot; {formatFileSize(file.size)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {file.riskScore !== undefined && (
          <span className="text-xs font-medium text-gray-700">
            {file.riskScore.toFixed(1)}
          </span>
        )}
        <StatusBadge status={file.status} />
      </div>
    </li>
  );
}
