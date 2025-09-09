'use client'

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  DocumentArrowUpIcon,
  DocumentArrowDownIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { apiClient, EhrMapping, BulkUpdateMappingRequest } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { useLanguage } from '@/contexts/LanguageContext';

const bulkUpdateSchema = z.object({
  ehrSystem: z.string().min(1, 'EHR System is required'),
  mappings: z.array(z.object({
    id: z.string().optional(),
    ehrSystem: z.string(),
    fieldType: z.string(),
    ehrField: z.string(),
    dataType: z.string(),
    isActive: z.boolean(),
    description: z.string().optional(),
    language: z.string(),
  })).min(1, 'At least one mapping is required'),
});

type BulkUpdateFormData = z.infer<typeof bulkUpdateSchema>;

interface BulkOperationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function BulkOperationsPanel({ isOpen, onClose, onSuccess }: BulkOperationsPanelProps) {
  const [ehrSystems, setEhrSystems] = useState<string[]>([]);
  const [mappings, setMappings] = useState<EhrMapping[]>([]);
  const [selectedMappings, setSelectedMappings] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [csvData, setCsvData] = useState<string>('');
  const [operation, setOperation] = useState<'update' | 'import' | 'export'>('update');

  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const { t } = useLanguage();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BulkUpdateFormData>({
    resolver: zodResolver(bulkUpdateSchema),
    defaultValues: {
      ehrSystem: '',
      mappings: [],
    },
  });

  const selectedEhrSystem = watch('ehrSystem');

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedEhrSystem) {
      loadMappingsForSystem(selectedEhrSystem);
    }
  }, [selectedEhrSystem]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const systems = await apiClient.getEhrSystems();
      setEhrSystems(systems);
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'Failed to load data',
        message: err.message || 'An error occurred while loading EHR systems',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadMappingsForSystem = async (ehrSystem: string) => {
    try {
      const mappingsData = await apiClient.getMappingsBySystem(ehrSystem, 'en');
      setMappings(mappingsData);
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'Failed to load mappings',
        message: err.message || 'An error occurred while loading mappings',
      });
    }
  };

  const handleSelectAll = () => {
    if (selectedMappings.length === mappings.length) {
      setSelectedMappings([]);
    } else {
      setSelectedMappings(mappings.map(m => m.id!));
    }
  };

  const handleSelectMapping = (mappingId: string) => {
    setSelectedMappings(prev =>
      prev.includes(mappingId)
        ? prev.filter(id => id !== mappingId)
        : [...prev, mappingId]
    );
  };

  const handleBulkUpdate = async (data: BulkUpdateFormData) => {
    if (selectedMappings.length === 0) {
      addNotification({
        type: 'warning',
        title: 'No mappings selected',
        message: 'Please select at least one mapping to update',
      });
      return;
    }

    try {
      setIsProcessing(true);

      const selectedMappingsData = mappings.filter(m => selectedMappings.includes(m.id!));

      const bulkUpdateRequest: BulkUpdateMappingRequest = {
        mappings: selectedMappingsData,
        userId: user?.id || '',
      };

      await apiClient.bulkUpdateMappings(data.ehrSystem, bulkUpdateRequest);

      addNotification({
        type: 'success',
        title: 'Bulk update successful',
        message: `${selectedMappings.length} mappings have been updated successfully`,
      });

      onSuccess?.();
      onClose();
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'Bulk update failed',
        message: err.message || 'An error occurred during bulk update',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExportCSV = () => {
    if (mappings.length === 0) {
      addNotification({
        type: 'warning',
        title: 'No data to export',
        message: 'No mappings available for export',
      });
      return;
    }

    const headers = ['ID', 'EHR System', 'Field Type', 'EHR Field', 'Data Type', 'Language', 'Active', 'Description'];
    const csvContent = [
      headers.join(','),
      ...mappings.map(mapping => [
        mapping.id || '',
        mapping.ehrSystem,
        mapping.fieldType,
        mapping.ehrField,
        mapping.dataType,
        mapping.language,
        mapping.isActive ? 'Yes' : 'No',
        `"${mapping.description || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ehr-mappings-${selectedEhrSystem}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    addNotification({
      type: 'success',
      title: 'Export successful',
      message: 'Mappings have been exported to CSV file',
    });
  };

  const handleImportCSV = () => {
    if (!csvData.trim()) {
      addNotification({
        type: 'warning',
        title: 'No CSV data',
        message: 'Please paste CSV data to import',
      });
      return;
    }

    try {
      const lines = csvData.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));

      const importedMappings = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        return {
          ehrSystem: values[1] || selectedEhrSystem,
          fieldType: values[2] || '',
          ehrField: values[3] || '',
          dataType: values[4] || 'string',
          language: values[5] || 'en',
          isActive: values[6]?.toLowerCase() === 'yes',
          description: values[7] || '',
        };
      });

      setValue('mappings', importedMappings);

      addNotification({
        type: 'success',
        title: 'CSV parsed successfully',
        message: `${importedMappings.length} mappings ready for import`,
      });
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'CSV parsing failed',
        message: 'Invalid CSV format. Please check your data.',
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-6xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              Bulk Operations
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Operation Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'update', name: 'Bulk Update', icon: CheckCircleIcon },
                { id: 'import', name: 'Import CSV', icon: DocumentArrowUpIcon },
                { id: 'export', name: 'Export CSV', icon: DocumentArrowDownIcon },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setOperation(tab.id as any)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      operation === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          {operation === 'update' && (
            <form onSubmit={handleSubmit(handleBulkUpdate)} className="space-y-6">
              <div>
                <label htmlFor="ehrSystem" className="block text-sm font-medium text-gray-700 mb-1">
                  EHR System
                </label>
                <select
                  {...register('ehrSystem')}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Select EHR System</option>
                  {ehrSystems.map(system => (
                    <option key={system} value={system}>
                      {system}
                    </option>
                  ))}
                </select>
                {errors.ehrSystem && (
                  <p className="mt-1 text-sm text-red-600">{errors.ehrSystem.message}</p>
                )}
              </div>

              {selectedEhrSystem && mappings.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-medium text-gray-900">
                      Select Mappings to Update ({selectedMappings.length} selected)
                    </h4>
                    <button
                      type="button"
                      onClick={handleSelectAll}
                      className="text-sm text-blue-600 hover:text-blue-500"
                    >
                      {selectedMappings.length === mappings.length ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>

                  <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-md">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                            Select
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                            Field Type
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                            EHR Field
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {mappings.map((mapping) => (
                          <tr key={mapping.id} className="hover:bg-gray-50">
                            <td className="px-4 py-2">
                              <input
                                type="checkbox"
                                checked={selectedMappings.includes(mapping.id!)}
                                onChange={() => handleSelectMapping(mapping.id!)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-900">
                              {mapping.fieldType}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-900">
                              {mapping.ehrField}
                            </td>
                            <td className="px-4 py-2">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                mapping.isActive
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {mapping.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing || selectedMappings.length === 0}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    `Update ${selectedMappings.length} Mappings`
                  )}
                </button>
              </div>
            </form>
          )}

          {operation === 'export' && (
            <div className="space-y-6">
              <div>
                <label htmlFor="exportEhrSystem" className="block text-sm font-medium text-gray-700 mb-1">
                  EHR System
                </label>
                <select
                  value={selectedEhrSystem}
                  onChange={(e) => setValue('ehrSystem', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Select EHR System</option>
                  {ehrSystems.map(system => (
                    <option key={system} value={system}>
                      {system}
                    </option>
                  ))}
                </select>
              </div>

              {selectedEhrSystem && (
                <div className="bg-blue-50 p-4 rounded-md">
                  <div className="flex items-center">
                    <DocumentArrowDownIcon className="h-5 w-5 text-blue-400 mr-2" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-800">Export Ready</h4>
                      <p className="text-sm text-blue-700">
                        {mappings.length} mappings available for export from {selectedEhrSystem}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExportCSV}
                  disabled={!selectedEhrSystem || mappings.length === 0}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Export CSV
                </button>
              </div>
            </div>
          )}

          {operation === 'import' && (
            <div className="space-y-6">
              <div>
                <label htmlFor="csvData" className="block text-sm font-medium text-gray-700 mb-1">
                  CSV Data
                </label>
                <textarea
                  id="csvData"
                  rows={10}
                  value={csvData}
                  onChange={(e) => setCsvData(e.target.value)}
                  placeholder="Paste your CSV data here..."
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-mono text-xs"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Expected format: ID, EHR System, Field Type, EHR Field, Data Type, Language, Active, Description
                </p>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImportCSV}
                  disabled={!csvData.trim()}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Parse CSV
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


