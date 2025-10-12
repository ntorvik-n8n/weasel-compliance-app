'use client';

import React from 'react';
import { ActiveUploads } from './ActiveUploads';
import { RecentlyUploaded } from './RecentlyUploaded';

export function Sidebar() {
  return (
    <aside className="w-96 bg-white p-6 border-l border-gray-200 overflow-y-auto">
      <div className="space-y-6">
        <ActiveUploads />
        <div className="border-t border-gray-200" />
        <RecentlyUploaded />
      </div>
    </aside>
  );
}
