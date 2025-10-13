'use client';

import { useEffect, useState } from 'react';

interface VersionInfo {
  version: string;
  build: string;
  buildDate: string;
  commit?: string;
}

export function VersionBadge() {
  const [versionInfo, setVersionInfo] = useState<VersionInfo | null>(null);

  useEffect(() => {
    fetch('/api/version')
      .then(res => res.json())
      .then(data => setVersionInfo(data))
      .catch(err => console.error('Failed to fetch version:', err));
  }, []);

  if (!versionInfo) return null;

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
      <span className="font-semibold">v{versionInfo.version}</span>
      <span className="text-gray-400">•</span>
      <span>Build {versionInfo.build}</span>
      {versionInfo.commit && versionInfo.commit !== 'initial' && (
        <>
          <span className="text-gray-400">•</span>
          <span className="font-mono">{versionInfo.commit.substring(0, 7)}</span>
        </>
      )}
    </div>
  );
}
