"use client";

import React from 'react';
import { FileMetadata } from '@/types/fileManagement';

interface PortfolioAnalyticsProps {
  files: FileMetadata[];
}

export function PortfolioAnalytics({ files }: PortfolioAnalyticsProps) {
  // Calculate aggregate metrics
  const analyzedFiles = files.filter(f => f.status === 'analyzed' && f.riskScore !== undefined);
  const totalCalls = analyzedFiles.length;
  const avgRisk = totalCalls > 0
    ? analyzedFiles.reduce((sum, f) => sum + (f.riskScore || 0), 0) / totalCalls
    : 0;
  const highRiskCalls = analyzedFiles.filter(f => (f.riskScore || 0) >= 7).length;
  const highRiskPercentage = totalCalls > 0 ? (highRiskCalls / totalCalls) * 100 : 0;

  // Get risk distribution
  const riskDistribution = {
    critical: analyzedFiles.filter(f => (f.riskScore || 0) >= 7).length,
    high: analyzedFiles.filter(f => (f.riskScore || 0) >= 5 && (f.riskScore || 0) < 7).length,
    medium: analyzedFiles.filter(f => (f.riskScore || 0) >= 3 && (f.riskScore || 0) < 5).length,
    low: analyzedFiles.filter(f => (f.riskScore || 0) < 3).length,
  };

  // Mock trend data for visualization (in production, would calculate from historical data)
  const trendData = [4.5, 5.2, 4.8, 3.9, 4.1, 3.7, 3.2, 4.2];

  // Recent high-risk alerts
  const recentHighRisk = analyzedFiles
    .filter(f => (f.riskScore || 0) >= 7)
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
    .slice(0, 3);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">📊 Portfolio Analytics</h2>
        <p className="text-sm text-text-muted">
          Overview of all compliance monitoring activity
        </p>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Calls */}
        <div className="metric-card">
          <div className="text-sm text-text-muted mb-2">Total Calls</div>
          <div className="text-4xl font-bold text-white mb-1">{totalCalls}</div>
          <div className="text-xs text-text-secondary">Analyzed</div>
        </div>

        {/* Average Risk */}
        <div className="metric-card">
          <div className="text-sm text-text-muted mb-2">Average Risk</div>
          <div className="flex items-baseline gap-2">
            <div className="text-4xl font-bold text-white">{avgRisk.toFixed(1)}</div>
            <div className="text-xl text-text-muted">/10</div>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className={`text-xs font-semibold ${
              avgRisk >= 7 ? 'text-risk-critical' :
              avgRisk >= 5 ? 'text-risk-high' :
              avgRisk >= 3 ? 'text-risk-medium' :
              'text-risk-none'
            }`}>
              {avgRisk >= 7 ? '⚠️ Warning!' :
               avgRisk >= 5 ? '⚡ Needs Attention' :
               avgRisk >= 3 ? '📋 Monitor' :
               '✅ Good'}
            </div>
          </div>
        </div>

        {/* High Risk Calls */}
        <div className="metric-card">
          <div className="text-sm text-text-muted mb-2">High Risk</div>
          <div className="flex items-baseline gap-2">
            <div className="text-4xl font-bold text-risk-critical">{highRiskCalls}</div>
            <div className="text-xl text-text-muted">({highRiskPercentage.toFixed(0)}%)</div>
          </div>
          <div className="text-xs text-text-secondary mt-1">Flagged</div>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="metric-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">📈 Risk Trend (Last 30 Days)</h3>
          {avgRisk < 4.5 && (
            <div className="text-xs text-risk-none bg-risk-none/20 px-3 py-1 rounded-full font-semibold">
              ✅ Improving
            </div>
          )}
        </div>
        
        <div className="relative h-40">
          {/* Simple trend visualization */}
          <div className="absolute inset-0 flex items-end justify-between gap-2">
            {trendData.map((value, index) => {
              const height = (value / 10) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className={`w-full rounded-t transition-all hover:opacity-80 ${
                      value >= 7 ? 'bg-risk-critical' :
                      value >= 5 ? 'bg-risk-high' :
                      value >= 3 ? 'bg-risk-medium' :
                      'bg-risk-none'
                    }`}
                    style={{ height: `${height}%` }}
                  />
                </div>
              );
            })}
          </div>
          
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-text-muted -ml-8">
            <div>10</div>
            <div>5</div>
            <div>0</div>
          </div>
        </div>
        
        {/* X-axis labels */}
        <div className="flex justify-between text-xs text-text-muted mt-2">
          <span>Week 1</span>
          <span>Week 2</span>
          <span>Week 3</span>
          <span>Week 4</span>
        </div>
      </div>

      {/* Risk Distribution & Recent Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Risk Distribution */}
        <div className="metric-card">
          <h3 className="text-lg font-semibold text-white mb-4">📊 Risk Distribution</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-risk-critical" />
                <span className="text-sm text-text-secondary">Critical (7-10)</span>
              </div>
              <span className="text-sm font-semibold text-white">{riskDistribution.critical}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-risk-high" />
                <span className="text-sm text-text-secondary">High (5-6)</span>
              </div>
              <span className="text-sm font-semibold text-white">{riskDistribution.high}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-risk-medium" />
                <span className="text-sm text-text-secondary">Medium (3-4)</span>
              </div>
              <span className="text-sm font-semibold text-white">{riskDistribution.medium}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-risk-none" />
                <span className="text-sm text-text-secondary">Low (0-2)</span>
              </div>
              <span className="text-sm font-semibold text-white">{riskDistribution.low}</span>
            </div>
          </div>
        </div>

        {/* Recent High-Risk Alerts */}
        <div className="metric-card">
          <h3 className="text-lg font-semibold text-white mb-4">🚨 Recent High-Risk Alerts</h3>
          {recentHighRisk.length > 0 ? (
            <div className="space-y-3">
              {recentHighRisk.map((file) => (
                <div key={file.id} className="p-3 bg-dark-elevated rounded-lg border border-risk-critical/30 hover:border-risk-critical/60 transition-colors">
                  <div className="flex items-start justify-between mb-1">
                    <div className="text-sm font-medium text-white truncate">{file.name}</div>
                    <div className="text-xs font-semibold text-risk-critical ml-2">
                      {file.riskScore?.toFixed(1)}
                    </div>
                  </div>
                  <div className="text-xs text-text-muted">
                    {file.agentName && `Agent: ${file.agentName} • `}
                    {new Date(file.uploadedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <div className="text-4xl mb-2">✅</div>
              <p className="text-sm text-text-muted">No high-risk calls recently</p>
            </div>
          )}
        </div>
      </div>

      {/* Getting Started or Empty State */}
      {totalCalls === 0 && (
        <div className="metric-card text-center py-12">
          <div className="text-6xl mb-4">🦡</div>
          <h3 className="text-xl font-semibold text-white mb-2">Welcome to Weasel!</h3>
          <p className="text-sm text-text-muted mb-6 max-w-md mx-auto">
            Upload your first call log to begin compliance monitoring. 
            Weasel will analyze conversations for FDCPA violations and provide detailed insights.
          </p>
          <div className="text-sm text-text-secondary">
            👈 Use the upload button on the left to get started
          </div>
        </div>
      )}
    </div>
  );
}
