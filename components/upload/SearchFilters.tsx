import { useCallback, useState, useMemo } from 'react';
import { useFileManager } from '@/contexts/FileManagerContext';
import type { FileStatus } from '@/types/fileManagement';

export function SearchFilters() {
  const { state, actions } = useFileManager();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const availableAgents = useMemo(() => {
    const agents = new Set<string>();
    state.files.forEach(file => {
      if (file.agentName) {
        agents.add(file.agentName);
      }
    });
    return Array.from(agents);
  }, [state.files]);

  const handleFilterChange = (filterName: string, value: any) => {
    actions.setFilter(filterName, value);
  };
  
  const clearFilters = () => {
    actions.clearFilters();
  };

  return (
    <div className="space-y-4 bg-white p-4 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <input
              type="text"
              value={state.searchTerm || ''}
              onChange={(e) => actions.setSearchTerm(e.target.value)}
              placeholder="Search by filename, call ID, agent..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
            />
            {/* Status Filter */}
            <select
              value={state.filters.status || 'all'}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md"
            >
              <option value="all">All Status</option>
              <option value="uploaded">Uploaded</option>
              <option value="processing">Processing</option>
              <option value="analyzed">Analyzed</option>
              <option value="error">Error</option>
            </select>
            {/* Agent Filter */}
            <select
              value={state.filters.agentName || 'all'}
              onChange={(e) => handleFilterChange('agentName', e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md"
            >
              <option value="all">All Agents</option>
              {availableAgents.map(agent => (
                <option key={agent} value={agent}>{agent}</option>
              ))}
            </select>
        </div>
        <button onClick={() => setShowAdvanced(!showAdvanced)} className="text-sm text-blue-600">
            {showAdvanced ? 'Hide' : 'Show'} Advanced Filters
        </button>
        {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                {/* Date Range Filter */}
                {/* Risk Level Filter (disabled) */}
                <select disabled className="block w-full ... bg-gray-200">
                    <option>All Risk Levels (Coming Soon)</option>
                </select>
                {/* Duration Filter */}
            </div>
        )}
         <button onClick={clearFilters} className="text-sm text-red-600">
            Clear All Filters
        </button>
    </div>
  );
}