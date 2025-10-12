import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import type { FileMetadata, CollisionAction } from '@/types/fileManagement';
import { generateUniqueFileName, sanitizeFileName } from '@/lib/fileManagement';

interface CollisionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  file: File;
  existingFile: FileMetadata;
  onResolve: (action: CollisionAction, customName?: string) => void;
  existingFiles: FileMetadata[];
}

type Strategy = 'timestamp' | 'incremental' | 'custom' | 'replace' | 'skip';

export function CollisionDialog({
  isOpen,
  onClose,
  file,
  existingFile,
  onResolve,
  existingFiles,
}: CollisionDialogProps) {
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy>('timestamp');
  const [customName, setCustomName] = useState('');
  const [customNameError, setCustomNameError] = useState('');

  const timestampName = generateUniqueFileName(file.name, existingFiles, 'timestamp');
  const incrementalName = generateUniqueFileName(file.name, existingFiles, 'increment');

  const handleCustomNameChange = (value: string) => {
    setCustomName(value);
    setCustomNameError('');

    // Validate custom name
    if (value && !value.endsWith('.json')) {
      setCustomNameError('Filename must end with .json');
    } else if (value && existingFiles.some(f => f.name === value)) {
      setCustomNameError('This filename also exists. Please choose another name.');
    } else if (value && !/^[a-zA-Z0-9_\-. ]+$/.test(value)) {
      setCustomNameError('Filename contains invalid characters');
    }
  };

  const handleContinue = () => {
    if (selectedStrategy === 'custom') {
      if (!customName || customNameError) {
        setCustomNameError(customNameError || 'Please enter a valid filename');
        return;
      }
      const sanitized = sanitizeFileName(customName);
      onResolve('rename', sanitized);
    } else if (selectedStrategy === 'timestamp') {
      onResolve('rename', timestampName);
    } else if (selectedStrategy === 'incremental') {
      onResolve('rename', incrementalName);
    } else if (selectedStrategy === 'replace') {
      onResolve('replace');
    } else if (selectedStrategy === 'skip') {
      onResolve('skip');
    }
  };

  const getButtonLabel = () => {
    switch (selectedStrategy) {
      case 'timestamp':
      case 'incremental':
      case 'custom':
        return 'Upload with New Name';
      case 'replace':
        return 'Replace & Backup';
      case 'skip':
        return 'Skip Upload';
      default:
        return 'Continue';
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-semibold leading-6 text-gray-900 flex items-center gap-2"
                >
                  <span className="text-yellow-500">⚠️</span>
                  Filename Already Exists
                </Dialog.Title>

                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-4">
                    You&apos;re trying to upload: <span className="font-semibold text-gray-900">{file.name}</span> ({(file.size / 1024).toFixed(1)} KB)
                  </p>

                  <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm">
                    <p className="font-medium text-gray-700 mb-1">A file with this name already exists:</p>
                    <ul className="text-gray-600 space-y-1 ml-4">
                      <li>• Uploaded: {new Date(existingFile.uploadedAt).toLocaleString()}</li>
                      <li>• Size: {(existingFile.size / 1024).toFixed(1)} KB</li>
                    </ul>
                  </div>

                  <p className="text-sm font-medium text-gray-700 mb-3">How would you like to proceed?</p>

                  <div className="space-y-3">
                    {/* Timestamp Strategy */}
                    <label className="flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      style={{ borderColor: selectedStrategy === 'timestamp' ? '#3B82F6' : '#E5E7EB' }}>
                      <input
                        type="radio"
                        name="strategy"
                        value="timestamp"
                        checked={selectedStrategy === 'timestamp'}
                        onChange={() => setSelectedStrategy('timestamp')}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">Rename with timestamp (recommended)</p>
                        <p className="text-xs text-gray-500 mt-1">New name: <span className="font-mono">{timestampName}</span></p>
                        <p className="text-xs text-blue-600 mt-1">ℹ️ Preserves both files with clear date stamp</p>
                      </div>
                    </label>

                    {/* Incremental Strategy */}
                    <label className="flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      style={{ borderColor: selectedStrategy === 'incremental' ? '#3B82F6' : '#E5E7EB' }}>
                      <input
                        type="radio"
                        name="strategy"
                        value="incremental"
                        checked={selectedStrategy === 'incremental'}
                        onChange={() => setSelectedStrategy('incremental')}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">Rename with number</p>
                        <p className="text-xs text-gray-500 mt-1">New name: <span className="font-mono">{incrementalName}</span></p>
                        <p className="text-xs text-blue-600 mt-1">ℹ️ Clean sequential naming</p>
                      </div>
                    </label>

                    {/* Custom Strategy */}
                    <label className="flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      style={{ borderColor: selectedStrategy === 'custom' ? '#3B82F6' : '#E5E7EB' }}>
                      <input
                        type="radio"
                        name="strategy"
                        value="custom"
                        checked={selectedStrategy === 'custom'}
                        onChange={() => setSelectedStrategy('custom')}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">Choose custom name</p>
                        {selectedStrategy === 'custom' && (
                          <div className="mt-2">
                            <input
                              type="text"
                              value={customName}
                              onChange={(e) => handleCustomNameChange(e.target.value)}
                              placeholder="Enter filename (e.g., mycall.json)"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {customNameError && (
                              <p className="text-xs text-red-600 mt-1">{customNameError}</p>
                            )}
                          </div>
                        )}
                        <p className="text-xs text-blue-600 mt-1">ℹ️ Enter your preferred filename</p>
                      </div>
                    </label>

                    {/* Replace Strategy */}
                    <label className="flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      style={{ borderColor: selectedStrategy === 'replace' ? '#3B82F6' : '#E5E7EB' }}>
                      <input
                        type="radio"
                        name="strategy"
                        value="replace"
                        checked={selectedStrategy === 'replace'}
                        onChange={() => setSelectedStrategy('replace')}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">Replace existing file (create backup first)</p>
                        <p className="text-xs text-yellow-700 mt-1 bg-yellow-50 px-2 py-1 rounded">⚠️ Original will be backed up, but this is risky</p>
                      </div>
                    </label>

                    {/* Skip Strategy */}
                    <label className="flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      style={{ borderColor: selectedStrategy === 'skip' ? '#3B82F6' : '#E5E7EB' }}>
                      <input
                        type="radio"
                        name="strategy"
                        value="skip"
                        checked={selectedStrategy === 'skip'}
                        onChange={() => setSelectedStrategy('skip')}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">Skip this file</p>
                        <p className="text-xs text-gray-500 mt-1">ℹ️ Don&apos;t upload this file</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    className="flex-1 inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="flex-1 inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleContinue}
                    disabled={selectedStrategy === 'custom' && (!customName || !!customNameError)}
                  >
                    {getButtonLabel()}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
