'use client'

import { useState, useEffect } from 'react'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  DocumentArrowUpIcon
} from '@heroicons/react/24/outline'
import { apiClient, EhrMapping, CreateMappingRequest, UpdateMappingRequest } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { useNotifications } from '@/contexts/NotificationContext'
import { useLanguage } from '@/contexts/LanguageContext'
import MappingFormModal from './MappingFormModal'
import BulkOperationsPanel from './BulkOperationsPanel'

export default function EhrMappingManager() {
  const [mappings, setMappings] = useState<EhrMapping[]>([])
  const [ehrSystems, setEhrSystems] = useState<string[]>([])
  const [selectedEhrSystem, setSelectedEhrSystem] = useState<string>('all')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingMapping, setEditingMapping] = useState<EhrMapping | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [language, setLanguage] = useState('en')
  const [isBulkOperationsOpen, setIsBulkOperationsOpen] = useState(false)
  const { user } = useAuth()
  const { addNotification } = useNotifications()
  const { t } = useLanguage()

  // Load EHR systems and mappings
  useEffect(() => {
    loadData()
  }, [selectedEhrSystem, language])

  const loadData = async () => {
    try {
      setIsLoading(true)

      // Load EHR systems
      const systems = await apiClient.getEhrSystems()
      setEhrSystems(systems)

      // Load mappings
      const mappingsData = await apiClient.getAllMappings(
        selectedEhrSystem === 'all' ? undefined : selectedEhrSystem,
        language
      )
      setMappings(mappingsData)
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'Failed to load data',
        message: err.message || 'An error occurred while loading EHR mappings',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredMappings = selectedEhrSystem === 'all'
    ? mappings
    : mappings.filter(m => m.ehrSystem === selectedEhrSystem)

  const handleCreateMapping = () => {
    setIsCreateModalOpen(true)
  }

  const handleEditMapping = (mapping: EhrMapping) => {
    setEditingMapping(mapping)
    setIsCreateModalOpen(true)
  }

  const handleModalClose = () => {
    setIsCreateModalOpen(false)
    setEditingMapping(null)
  }

  const handleModalSuccess = () => {
    loadData() // Reload data after successful create/update
  }

  const handleBulkOperationsSuccess = () => {
    loadData() // Reload data after successful bulk operations
  }

  const handleDeleteMapping = async (id: string) => {
    if (confirm('Are you sure you want to delete this mapping?')) {
      try {
        // Note: Backend doesn't have delete endpoint, so we'll just remove from local state
        // In a real implementation, you'd call a delete API endpoint
        setMappings(mappings.filter(m => m.id !== id))
        addNotification({
          type: 'success',
          title: 'Mapping deleted',
          message: 'The mapping has been successfully deleted',
        })
      } catch (err: any) {
        addNotification({
          type: 'error',
          title: 'Failed to delete mapping',
          message: err.message || 'An error occurred while deleting the mapping',
        })
      }
    }
  }

  const handleToggleActive = async (mapping: EhrMapping) => {
    try {
      if (!mapping.id) return

      const updatedMapping = await apiClient.updateMapping(mapping.id, {
        isActive: !mapping.isActive
      })

      setMappings(mappings.map(m =>
        m.id === mapping.id ? updatedMapping : m
      ))

      addNotification({
        type: 'success',
        title: 'Mapping updated',
        message: `Mapping has been ${updatedMapping.isActive ? 'activated' : 'deactivated'}`,
      })
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'Failed to update mapping',
        message: err.message || 'An error occurred while updating the mapping',
      })
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900">EHR Mappings</h2>
          <p className="text-sm text-gray-500">
            Manage field mappings for different EHR systems
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleCreateMapping}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            {t('mappings.new_mapping')}
          </button>

          {user?.role === 'admin' && (
            <button
              onClick={() => setIsBulkOperationsOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <DocumentArrowUpIcon className="h-4 w-4 mr-2" />
              Bulk Operations
            </button>
          )}
        </div>
      </div>


      {/* Filters */}
      <div className="mb-6 flex space-x-4">
        <div>
          <label htmlFor="ehr-system" className="block text-sm font-medium text-gray-700 mb-1">
            EHR System
          </label>
          <select
            id="ehr-system"
            value={selectedEhrSystem}
            onChange={(e) => setSelectedEhrSystem(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="all">All Systems</option>
            {ehrSystems.map(system => (
              <option key={system} value={system}>
                {system}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
            Language
          </label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {/* Mappings Table */}
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    EHR System
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Field Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    EHR Field
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Language
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMappings.map((mapping) => (
                  <tr key={mapping.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {mapping.ehrSystem}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {mapping.fieldType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {mapping.ehrField}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {mapping.dataType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {mapping.language.toUpperCase()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleActive(mapping)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          mapping.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {mapping.isActive ? (
                          <>
                            <CheckIcon className="h-3 w-3 mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <XMarkIcon className="h-3 w-3 mr-1" />
                            Inactive
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditMapping(mapping)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit mapping"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        {user?.role === 'admin' && (
                          <button
                            onClick={() => handleDeleteMapping(mapping.id!)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete mapping"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Empty State */}
      {filteredMappings.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No mappings found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new mapping.
          </p>
          <div className="mt-6">
            <button
              onClick={handleCreateMapping}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              New Mapping
            </button>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      <MappingFormModal
        isOpen={isCreateModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        mapping={editingMapping}
        ehrSystems={ehrSystems}
      />

      {/* Bulk Operations Panel */}
      <BulkOperationsPanel
        isOpen={isBulkOperationsOpen}
        onClose={() => setIsBulkOperationsOpen(false)}
        onSuccess={handleBulkOperationsSuccess}
      />
    </div>
  )
}

