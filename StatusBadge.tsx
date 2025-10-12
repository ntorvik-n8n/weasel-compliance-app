import {
  CheckCircleIcon,
  ClockIcon,
  CogIcon,
  ExclamationTriangleIcon,
  CloudArrowUpIcon,
  EyeIcon,
} from '@heroicons/react/24/solid';
import type { FileStatus } from './types/fileManagement';

interface StatusBadgeProps {
  status: FileStatus;
}

const STATUS_CONFIG: Record<FileStatus, {
  label: string;
  icon: typeof CloudArrowUpIcon;
  className: string;
  animated?: boolean;
}> = {
  uploaded: {
    label: 'Uploaded',
    icon: CloudArrowUpIcon,
    className: 'bg-blue-100 text-blue-800',
  },
  queued: {
    label: 'Queued',
    icon: ClockIcon,
    className: 'bg-purple-100 text-purple-800',
  },
  processing: {
    label: 'Processing',
    icon: CogIcon,
    className: 'bg-yellow-100 text-yellow-800',
    animated: true,
  },
  analyzed: {
    label: 'Analyzed',
    icon: CheckCircleIcon,
    className: 'bg-green-100 text-green-800',
  },
  error: {
    label: 'Error',
    icon: ExclamationTriangleIcon,
    className: 'bg-red-100 text-red-800',
  },
  'pending-review': {
    label: 'Pending Review',
    icon: EyeIcon,
    className: 'bg-gray-100 text-gray-800',
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG['pending-review'];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}
    >
      <Icon
        className={`h-4 w-4 ${config.animated ? 'animate-spin' : ''}`}
      />
      <span>{config.label}</span>
    </span>
  );
}