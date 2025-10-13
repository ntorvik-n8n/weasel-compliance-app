'use client';

import React, { Suspense, useEffect } from 'react';
import { FileUpload } from '@/components/upload/FileUpload';
import { SimpleFileList } from '@/components/upload/SimpleFileList';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { ActiveUploads } from '@/components/sidebar/ActiveUploads';
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
    <div className="flex h-screen bg-gray-50">
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 flex items-stretch overflow-hidden">
          {/* Left Sidebar - File List */}
          <div className="w-96 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h1 className="text-xl font-bold mb-4">Call Logs</h1>
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