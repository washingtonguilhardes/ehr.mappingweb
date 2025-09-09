'use client'

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { apiClient, EhrMapping, CreateMappingRequest, UpdateMappingRequest } from '@/lib/api';
import { useNotifications } from '@/contexts/NotificationContext';

const mappingSchema = z.object({
  ehrSystem: z.string().min(1, 'EHR System is required'),
  fieldType: z.string().min(1, 'Field Type is required'),
  ehrField: z.string().min(1, 'EHR Field is required'),
  dataType: z.string().min(1, 'Data Type is required'),
  description: z.string().optional(),
  language: z.string().min(1, 'Language is required'),
  isActive: z.boolean(),
});

type MappingFormData = z.infer<typeof mappingSchema>;

interface MappingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mapping?: EhrMapping | null;
  ehrSystems: string[];
}

export default function MappingFormModal({
  isOpen,
  onClose,
  onSuccess,
  mapping,
  ehrSystems,
}: MappingFormModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { addNotification } = useNotifications();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MappingFormData>({
    resolver: zodResolver(mappingSchema),
    defaultValues: {
      ehrSystem: '',
      fieldType: '',
      ehrField: '',
      dataType: 'string',
      description: '',
      language: 'en',
      isActive: true,
    },
  });

  useEffect(() => {
    if (mapping) {
      reset({
        ehrSystem: mapping.ehrSystem,
        fieldType: mapping.fieldType,
        ehrField: mapping.ehrField,
        dataType: mapping.dataType,
        description: mapping.description || '',
        language: mapping.language,
        isActive: mapping.isActive,
      });
    } else {
      reset({
        ehrSystem: '',
        fieldType: '',
        ehrField: '',
        dataType: 'string',
        description: '',
        language: 'en',
        isActive: true,
      });
    }
  }, [mapping, reset]);

  const onSubmit = async (data: MappingFormData) => {
    try {
      setIsLoading(true);

      if (mapping?.id) {
        // Update existing mapping
        const updateData: UpdateMappingRequest = {
          ehrSystem: data.ehrSystem,
          fieldType: data.fieldType,
          ehrField: data.ehrField,
          dataType: data.dataType,
          description: data.description,
          language: data.language,
          isActive: data.isActive,
        };
        await apiClient.updateMapping(mapping.id, updateData);

        addNotification({
          type: 'success',
          title: 'Mapping updated',
          message: 'The mapping has been successfully updated',
        });
      } else {
        // Create new mapping
        const createData: CreateMappingRequest = {
          ehrSystem: data.ehrSystem,
          fieldType: data.fieldType,
          ehrField: data.ehrField,
          dataType: data.dataType,
          description: data.description,
          language: data.language,
          isActive: data.isActive,
        };
        await apiClient.createMapping(createData);

        addNotification({
          type: 'success',
          title: 'Mapping created',
          message: 'The new mapping has been successfully created',
        });
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'Failed to save mapping',
        message: err.message || 'An error occurred while saving the mapping',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              {mapping ? 'Edit Mapping' : 'Create New Mapping'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>


          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="ehrSystem" className="block text-sm font-medium text-gray-700">
                  EHR System *
                </label>
                <select
                  {...register('ehrSystem')}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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

              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                  Language *
                </label>
                <select
                  {...register('language')}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                </select>
                {errors.language && (
                  <p className="mt-1 text-sm text-red-600">{errors.language.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="fieldType" className="block text-sm font-medium text-gray-700">
                Field Type *
              </label>
              <input
                {...register('fieldType')}
                type="text"
                placeholder="e.g., patient.name, patient.gender, patient.allergies"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {errors.fieldType && (
                <p className="mt-1 text-sm text-red-600">{errors.fieldType.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="ehrField" className="block text-sm font-medium text-gray-700">
                EHR Field *
              </label>
              <input
                {...register('ehrField')}
                type="text"
                placeholder="e.g., PATIENT_IDENT_NAME, GENDER_OF_PATIENT"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {errors.ehrField && (
                <p className="mt-1 text-sm text-red-600">{errors.ehrField.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="dataType" className="block text-sm font-medium text-gray-700">
                Data Type *
              </label>
              <select
                {...register('dataType')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="string">String</option>
                <option value="number">Number</option>
                <option value="boolean">Boolean</option>
                <option value="date">Date</option>
                <option value="array">Array</option>
                <option value="object">Object</option>
              </select>
              {errors.dataType && (
                <p className="mt-1 text-sm text-red-600">{errors.dataType.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                {...register('description')}
                rows={3}
                placeholder="Optional description of this mapping"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div className="flex items-center">
              <input
                {...register('isActive')}
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                Active mapping
              </label>
            </div>

            {/* Form Actions */}
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
                disabled={isLoading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  mapping ? 'Update Mapping' : 'Create Mapping'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
