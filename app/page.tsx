'use client';

import React, { Suspense, useEffect } from 'react';
import { FileUpload } from '@/components/upload/FileUpload';
import { SimpleFileList } from '@/components/upload/SimpleFileList';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { ActiveUploads } from '@/components/sidebar/ActiveUploads';
import { VersionBadge } from '@/components/common/VersionBadge';
import { WeaselLogo } from '@/components/common/WeaselLogo';
import { useFilterStateSync } from '@/hooks/useFilterStateSync';
import { useStatusPolling } from '@/hooks/use-status-polling';
import { useFileListLoader } from '@/hooks/use-file-list-loader';
import { useFileManager } from '@/contexts/FileManagerContext';

function HomePageContent() {
  useFilterStateSync();
  useStatusPolling();
  useFileListLoader(); // Load initial file list from server
  const { state, actions, selectedFile } = useFileManager();

  return (
    <div className="flex h-screen bg-dark-bg">
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header with Version */}
        <div className="bg-dark-surface border-b border-dark-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <WeaselLogo size={48} />
            <h1 className="text-2xl font-bold text-dark-text-primary">Weasel - Compliance Monitor</h1>
          </div>
          <VersionBadge />
        </div>

        <div className="flex-1 flex items-stretch overflow-hidden">
          {/* Left Sidebar - File List */}
          <div className="w-80 bg-dark-surface border-r border-dark-border flex flex-col overflow-hidden">
            <div className="p-6 border-b border-dark-border">
              <h2 className="text-lg font-semibold mb-4 text-dark-text-primary">Call Logs</h2>
              <FileUpload />
              <div className="mt-4">
                <ActiveUploads />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              <SimpleFileList />
            </div>
          </div>

          {/* Main Content - Dashboard */}
          <Dashboard />
        </div>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <HomePageContent />
    </Suspense>
  );
}