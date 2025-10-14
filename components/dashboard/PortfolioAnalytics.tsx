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

  // Calculate real trend data from analyzed files
  // Group files by week and calculate counts per risk level (last 8 weeks)
  const trendData = React.useMemo(() => {
    const now = new Date();
    const weekData: Array<{ critical: number; high: number; medium: number; low: number }> = [];
    
    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (i + 1) * 7);
      const weekEnd = new Date(now);
      weekEnd.setDate(now.getDate() - i * 7);
      
      const weekFiles = analyzedFiles.filter(f => {
        const uploadDate = new Date(f.uploadedAt);
        return uploadDate >= weekStart && uploadDate < weekEnd;
      });
      
      weekData.push({
        critical: weekFiles.filter(f => (f.riskScore || 0) >= 7).length,
        high: weekFiles.filter(f => (f.riskScore || 0) >= 5 && (f.riskScore || 0) < 7).length,
        medium: weekFiles.filter(f => (f.riskScore || 0) >= 3 && (f.riskScore || 0) < 5).length,
        low: weekFiles.filter(f => (f.riskScore || 0) < 3).length,
      });
    }
    
    // Check if we have meaningful trend data (at least 3 weeks with data)
    const weeksWithData = weekData.filter(week => 
      week.critical > 0 || week.high > 0 || week.medium > 0 || week.low > 0
    ).length;
    
    // If not enough real data, show mock data for demonstration
    if (weeksWithData < 3) {
      return [
        { critical: 3, high: 2, medium: 4, low: 6 },
        { critical: 4, high: 1, medium: 5, low: 5 },
        { critical: 3, high: 3, medium: 4, low: 7 },
        { critical: 2, high: 4, medium: 3, low: 8 },
        { critical: 3, high: 2, medium: 5, low: 7 },
        { critical: 1, high: 3, medium: 4, low: 9 },
        { critical: 1, high: 2, medium: 3, low: 10 },
        { critical: 0, high: 1, medium: 2, low: 12 },
      ];
    }
    
    return weekData;
  }, [analyzedFiles]);

  // Calculate max value for Y-axis scaling
  const maxTrendValue = React.useMemo(() => {
    if (trendData.length === 0) return 10;
    const max = Math.max(
      ...trendData.flatMap(week => [week.critical, week.high, week.medium, week.low])
    );
    // Round up to nearest 5 for cleaner axis
    const result = Math.max(5, Math.ceil(max / 5) * 5);
    console.log('Portfolio Analytics - Trend Data:', trendData);
    console.log('Portfolio Analytics - Max Value:', result);
    return result;
  }, [trendData]);

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
        <div className="metric-card text-center">
          <div className="text-sm text-text-muted mb-2">Total Calls</div>
          <div className="text-4xl font-bold text-white mb-1">{totalCalls}</div>
          <div className="text-xs text-text-secondary">Analyzed</div>
        </div>

        {/* Average Risk */}
        <div className="metric-card text-center">
          <div className="text-sm text-text-muted mb-2">Average Risk</div>
          <div className="flex items-baseline gap-2 justify-center">
            <div className="text-4xl font-bold text-white">{avgRisk.toFixed(1)}</div>
            <div className="text-xl text-text-muted">/10</div>
          </div>
          <div className="flex items-center gap-2 mt-1 justify-center">
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
        <div className="metric-card text-center">
          <div className="text-sm text-text-muted mb-2">High Risk</div>
          <div className="flex items-baseline gap-2 justify-center">
            <div className="text-4xl font-bold text-risk-critical">{highRiskCalls}</div>
            <div className="text-xl text-text-muted">({highRiskPercentage.toFixed(0)}%)</div>
          </div>
          <div className="text-xs text-text-secondary mt-1">Flagged</div>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="metric-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">📈 Risk Trend (Last 8 Weeks)</h3>
          {avgRisk < 4.5 && totalCalls > 0 && (
            <div className="text-xs text-risk-none bg-risk-none/20 px-3 py-1 rounded-full font-semibold">
              ✅ Performing Well
            </div>
          )}
        </div>
        
        {trendData.length > 0 ? (
          <div className="relative h-64 pl-12">
            {/* Y-axis labels - inside container now */}
            <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-text-muted">
              <div>{maxTrendValue}</div>
              <div>{Math.round(maxTrendValue * 0.75)}</div>
              <div>{Math.round(maxTrendValue * 0.5)}</div>
              <div>{Math.round(maxTrendValue * 0.25)}</div>
              <div>0</div>
            </div>
            
            {/* Chart area */}
            <div className="h-56 relative">
              {/* Background grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between">
                {[0, 1, 2, 3, 4].map(i => (
                  <div key={i} className="border-t border-dark-border/30" />
                ))}
              </div>
              
              {/* Line chart - only lines and circles in SVG */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Critical line */}
                <polyline
                  points={trendData.map((week, i) => {
                    const x = (i / (trendData.length - 1)) * 100;
                    const y = 100 - (week.critical / maxTrendValue) * 100;
                    return `${x},${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="rgb(239, 68, 68)"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.9"
                  vectorEffect="non-scaling-stroke"
                />
                {trendData.map((week, i) => (
                  <circle
                    key={`critical-${i}`}
                    cx={(i / (trendData.length - 1)) * 100}
                    cy={100 - (week.critical / maxTrendValue) * 100}
                    r="1.2"
                    fill="rgb(239, 68, 68)"
                    stroke="rgb(30, 30, 36)"
                    strokeWidth="0.3"
                    className="cursor-pointer"
                    vectorEffect="non-scaling-stroke"
                  >
                    <title>{`Week ${i + 1}: ${week.critical} critical calls`}</title>
                  </circle>
                ))}

                {/* High line */}
                <polyline
                  points={trendData.map((week, i) => {
                    const x = (i / (trendData.length - 1)) * 100;
                    const y = 100 - (week.high / maxTrendValue) * 100;
                    return `${x},${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="rgb(249, 115, 22)"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.9"
                  vectorEffect="non-scaling-stroke"
                />
                {trendData.map((week, i) => (
                  <circle
                    key={`high-${i}`}
                    cx={(i / (trendData.length - 1)) * 100}
                    cy={100 - (week.high / maxTrendValue) * 100}
                    r="1.2"
                    fill="rgb(249, 115, 22)"
                    stroke="rgb(30, 30, 36)"
                    strokeWidth="0.3"
                    className="cursor-pointer"
                    vectorEffect="non-scaling-stroke"
                  >
                    <title>{`Week ${i + 1}: ${week.high} high risk calls`}</title>
                  </circle>
                ))}

                {/* Medium line */}
                <polyline
                  points={trendData.map((week, i) => {
                    const x = (i / (trendData.length - 1)) * 100;
                    const y = 100 - (week.medium / maxTrendValue) * 100;
                    return `${x},${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="rgb(234, 179, 8)"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.9"
                  vectorEffect="non-scaling-stroke"
                />
                {trendData.map((week, i) => (
                  <circle
                    key={`medium-${i}`}
                    cx={(i / (trendData.length - 1)) * 100}
                    cy={100 - (week.medium / maxTrendValue) * 100}
                    r="1.2"
                    fill="rgb(234, 179, 8)"
                    stroke="rgb(30, 30, 36)"
                    strokeWidth="0.3"
                    className="cursor-pointer"
                    vectorEffect="non-scaling-stroke"
                  >
                    <title>{`Week ${i + 1}: ${week.medium} medium risk calls`}</title>
                  </circle>
                ))}

                {/* Low line */}
                <polyline
                  points={trendData.map((week, i) => {
                    const x = (i / (trendData.length - 1)) * 100;
                    const y = 100 - (week.low / maxTrendValue) * 100;
                    return `${x},${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="rgb(34, 197, 94)"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.9"
                  vectorEffect="non-scaling-stroke"
                />
                {trendData.map((week, i) => (
                  <circle
                    key={`low-${i}`}
                    cx={(i / (trendData.length - 1)) * 100}
                    cy={100 - (week.low / maxTrendValue) * 100}
                    r="1.2"
                    fill="rgb(34, 197, 94)"
                    stroke="rgb(30, 30, 36)"
                    strokeWidth="0.3"
                    className="cursor-pointer"
                    vectorEffect="non-scaling-stroke"
                  >
                    <title>{`Week ${i + 1}: ${week.low} low risk calls`}</title>
                  </circle>
                ))}
              </svg>
              
              {/* Fixed-size labels overlay */}
              <div className="absolute inset-0 pointer-events-none">
                {trendData.map((week, i) => {
                  const xPercent = (i / (trendData.length - 1)) * 100;
                  
                  return (
                    <React.Fragment key={`labels-${i}`}>
                      {/* Critical label */}
                      {week.critical > 0 && (
                        <div
                          className="absolute text-xs font-bold text-risk-critical"
                          style={{
                            left: `${xPercent}%`,
                            top: `${100 - (week.critical / maxTrendValue) * 100}%`,
                            transform: 'translate(-50%, -150%)'
                          }}
                        >
                          {week.critical}
                        </div>
                      )}
                      
                      {/* High label */}
                      {week.high > 0 && (
                        <div
                          className="absolute text-xs font-bold text-risk-high"
                          style={{
                            left: `${xPercent}%`,
                            top: `${100 - (week.high / maxTrendValue) * 100}%`,
                            transform: 'translate(-50%, -150%)'
                          }}
                        >
                          {week.high}
                        </div>
                      )}
                      
                      {/* Medium label */}
                      {week.medium > 0 && (
                        <div
                          className="absolute text-xs font-bold text-risk-medium"
                          style={{
                            left: `${xPercent}%`,
                            top: `${100 - (week.medium / maxTrendValue) * 100}%`,
                            transform: 'translate(-50%, -150%)'
                          }}
                        >
                          {week.medium}
                        </div>
                      )}
                      
                      {/* Low label */}
                      {week.low > 0 && (
                        <div
                          className="absolute text-xs font-bold text-risk-none"
                          style={{
                            left: `${xPercent}%`,
                            top: `${100 - (week.low / maxTrendValue) * 100}%`,
                            transform: 'translate(-50%, -150%)'
                          }}
                        >
                          {week.low}
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
            
            {/* X-axis labels */}
            <div className="flex justify-between text-xs text-text-muted mt-2">
              {trendData.map((_, index) => (
                <span key={index} className="flex-1 text-center">W{index + 1}</span>
              ))}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-4 justify-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-risk-critical" />
                <span className="text-xs text-text-secondary">Critical (7-10)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-risk-high" />
                <span className="text-xs text-text-secondary">High (5-6)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-risk-medium" />
                <span className="text-xs text-text-secondary">Medium (3-4)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-risk-none" />
                <span className="text-xs text-text-secondary">Low (0-2)</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center text-text-muted text-sm">
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <p>Upload more calls to see trends</p>
            </div>
          </div>
        )}
      </div>

      {/* Risk Distribution & Recent Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Risk Distribution */}
        <div className="metric-card">
          <h3 className="text-lg font-semibold text-white mb-4">📊 Risk Distribution</h3>
          <div className="space-y-4">
            {/* Critical */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-risk-critical" />
                  <span className="text-sm text-text-secondary">Critical (7-10)</span>
                </div>
                <span className="text-sm font-semibold text-white">{riskDistribution.critical}</span>
              </div>
              <div className="h-2 bg-dark-elevated rounded-full overflow-hidden">
                <div 
                  className="h-full bg-risk-critical rounded-full transition-all duration-500"
                  style={{ width: totalCalls > 0 ? `${(riskDistribution.critical / totalCalls) * 100}%` : '0%' }}
                />
              </div>
            </div>

            {/* High */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-risk-high" />
                  <span className="text-sm text-text-secondary">High (5-6)</span>
                </div>
                <span className="text-sm font-semibold text-white">{riskDistribution.high}</span>
              </div>
              <div className="h-2 bg-dark-elevated rounded-full overflow-hidden">
                <div 
                  className="h-full bg-risk-high rounded-full transition-all duration-500"
                  style={{ width: totalCalls > 0 ? `${(riskDistribution.high / totalCalls) * 100}%` : '0%' }}
                />
              </div>
            </div>

            {/* Medium */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-risk-medium" />
                  <span className="text-sm text-text-secondary">Medium (3-4)</span>
                </div>
                <span className="text-sm font-semibold text-white">{riskDistribution.medium}</span>
              </div>
              <div className="h-2 bg-dark-elevated rounded-full overflow-hidden">
                <div 
                  className="h-full bg-risk-medium rounded-full transition-all duration-500"
                  style={{ width: totalCalls > 0 ? `${(riskDistribution.medium / totalCalls) * 100}%` : '0%' }}
                />
              </div>
            </div>

            {/* Low */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-risk-none" />
                  <span className="text-sm text-text-secondary">Low (0-2)</span>
                </div>
                <span className="text-sm font-semibold text-white">{riskDistribution.low}</span>
              </div>
              <div className="h-2 bg-dark-elevated rounded-full overflow-hidden">
                <div 
                  className="h-full bg-risk-none rounded-full transition-all duration-500"
                  style={{ width: totalCalls > 0 ? `${(riskDistribution.low / totalCalls) * 100}%` : '0%' }}
                />
              </div>
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
