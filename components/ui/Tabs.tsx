"use client";

import React, { useState } from 'react';

export interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  className?: string;
}

export function Tabs({ tabs, defaultTab, onChange, className = '' }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Tab Navigation */}
      <div className="flex border-b border-dark-border bg-dark-surface">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`
              px-6 py-3 text-sm font-medium transition-colors relative
              ${activeTab === tab.id
                ? 'text-white border-b-2 border-badge-pressure bg-dark-elevated'
                : 'text-text-secondary hover:text-white hover:bg-dark-elevated/50'
              }
            `}
            aria-selected={activeTab === tab.id}
            role="tab"
          >
            <div className="flex items-center gap-2">
              {tab.icon}
              <span>{tab.label}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto dark-scrollbar" role="tabpanel">
        {activeTabContent}
      </div>
    </div>
  );
}
