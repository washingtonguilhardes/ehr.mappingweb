'use client'

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { useLanguage } from '@/contexts/LanguageContext';

const questionSchema = z.object({
  text: z.string().min(1, 'Question text is required').max(500, 'Question text must be less than 500 characters'),
  category: z.string().min(1, 'Category is required'),
  fieldType: z.string().min(1, 'Field type is required'),
  inputType: z.string().min(1, 'Input type is required'),
  isRequired: z.boolean(),
  isActive: z.boolean(),
  order: z.number().min(1, 'Order must be at least 1'),
  providerId: z.string().min(1, 'Provider is required'),
  language: z.string().min(1, 'Language is required'),
  helpText: z.string().optional(),
});

type QuestionFormData = z.infer<typeof questionSchema>;

interface Question {
  id: string;
  text: string;
  category: string;
  fieldType: string;
  inputType: string;
  isRequired: boolean;
  isActive: boolean;
  order: number;
  providerId: string;
  language: string;
  helpText?: string;
}

interface QuestionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  question?: Question | null;
}

export default function QuestionFormModal({
  isOpen,
  onClose,
  onSuccess,
  question,
}: QuestionFormModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const { t } = useLanguage();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      text: '',
      category: 'symptoms',
      fieldType: '',
      inputType: 'text',
      isRequired: false,
      isActive: true,
      order: 1,
      providerId: '',
      language: 'en',
      helpText: '',
    },
  });

  const selectedCategory = watch('category');

  useEffect(() => {
    if (question) {
      reset({
        text: question.text,
        category: question.category,
        fieldType: question.fieldType,
        inputType: question.inputType,
        isRequired: question.isRequired,
        isActive: question.isActive,
        order: question.order,
        providerId: question.providerId,
        language: question.language,
        helpText: question.helpText || '',
      });
    } else {
      reset({
        text: '',
        category: 'symptoms',
        fieldType: '',
        inputType: 'text',
        isRequired: false,
        isActive: true,
        order: 1,
        providerId: '',
        language: 'en',
        helpText: '',
      });
    }
  }, [question, reset]);

  const onSubmit = async (data: QuestionFormData) => {
    try {
      setIsLoading(true);

      // TODO: Replace with actual API call when backend is ready
      // For now, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (question?.id) {
        addNotification({
          type: 'success',
          title: 'Question updated',
          message: 'The clinical question has been successfully updated',
        });
      } else {
        addNotification({
          type: 'success',
          title: 'Question created',
          message: 'The new clinical question has been successfully created',
        });
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'Failed to save question',
        message: err.message || 'An error occurred while saving the question',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    { value: 'symptoms', label: 'Symptoms' },
    { value: 'allergies', label: 'Allergies' },
    { value: 'medications', label: 'Medications' },
    { value: 'family_history', label: 'Family History' },
    { value: 'social_history', label: 'Social History' },
    { value: 'vital_signs', label: 'Vital Signs' },
    { value: 'past_medical_history', label: 'Past Medical History' },
    { value: 'current_conditions', label: 'Current Conditions' },
  ];

  const inputTypes = [
    { value: 'text', label: 'Text Input' },
    { value: 'textarea', label: 'Text Area' },
    { value: 'select', label: 'Dropdown Select' },
    { value: 'radio', label: 'Radio Buttons' },
    { value: 'checkbox', label: 'Checkboxes' },
    { value: 'number', label: 'Number Input' },
    { value: 'date', label: 'Date Picker' },
    { value: 'email', label: 'Email Input' },
    { value: 'phone', label: 'Phone Input' },
  ];

  const providers = [
    { value: 'HOSP001', label: 'General Hospital' },
    { value: 'HOSP002', label: 'Medical Center' },
    { value: 'HOSP003', label: 'Community Clinic' },
    { value: 'HOSP004', label: 'Specialty Clinic' },
  ];

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
  ];

  // Auto-suggest field types based on category
  const getFieldTypeSuggestions = (category: string) => {
    const suggestions: Record<string, string[]> = {
      symptoms: ['patient.symptoms', 'patient.currentSymptoms', 'patient.symptomSeverity'],
      allergies: ['patient.allergies', 'patient.allergyType', 'patient.allergySeverity'],
      medications: ['patient.currentMedications', 'patient.medicationDosage', 'patient.medicationFrequency'],
      family_history: ['patient.familyHistory', 'patient.familyConditions', 'patient.familyRelationships'],
      social_history: ['patient.smokingStatus', 'patient.alcoholUse', 'patient.exerciseHabits'],
      vital_signs: ['patient.bloodPressure', 'patient.heartRate', 'patient.temperature'],
      past_medical_history: ['patient.pastConditions', 'patient.previousSurgeries', 'patient.hospitalizations'],
      current_conditions: ['patient.currentConditions', 'patient.conditionStatus', 'patient.conditionSeverity'],
    };
    return suggestions[category] || [];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              {question ? 'Edit Clinical Question' : 'Create New Clinical Question'}
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
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="text" className="block text-sm font-medium text-gray-700">
                    Question Text *
                  </label>
                  <textarea
                    {...register('text')}
                    rows={4}
                    placeholder="Enter the clinical question text..."
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  {errors.text && (
                    <p className="mt-1 text-sm text-red-600">{errors.text.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="helpText" className="block text-sm font-medium text-gray-700">
                    Help Text
                  </label>
                  <textarea
                    {...register('helpText')}
                    rows={2}
                    placeholder="Optional help text to guide the user..."
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category *
                  </label>
                  <select
                    {...register('category')}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="fieldType" className="block text-sm font-medium text-gray-700">
                    Field Type *
                  </label>
                  <input
                    {...register('fieldType')}
                    type="text"
                    placeholder="e.g., patient.symptoms, patient.allergies"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    list="fieldTypeSuggestions"
                  />
                  <datalist id="fieldTypeSuggestions">
                    {getFieldTypeSuggestions(selectedCategory).map(suggestion => (
                      <option key={suggestion} value={suggestion} />
                    ))}
                  </datalist>
                  {errors.fieldType && (
                    <p className="mt-1 text-sm text-red-600">{errors.fieldType.message}</p>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="inputType" className="block text-sm font-medium text-gray-700">
                    Input Type *
                  </label>
                  <select
                    {...register('inputType')}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    {inputTypes.map(inputType => (
                      <option key={inputType.value} value={inputType.value}>
                        {inputType.label}
                      </option>
                    ))}
                  </select>
                  {errors.inputType && (
                    <p className="mt-1 text-sm text-red-600">{errors.inputType.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="providerId" className="block text-sm font-medium text-gray-700">
                    Provider *
                  </label>
                  <select
                    {...register('providerId')}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Select Provider</option>
                    {providers.map(provider => (
                      <option key={provider.value} value={provider.value}>
                        {provider.label}
                      </option>
                    ))}
                  </select>
                  {errors.providerId && (
                    <p className="mt-1 text-sm text-red-600">{errors.providerId.message}</p>
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
                    {languages.map(language => (
                      <option key={language.value} value={language.value}>
                        {language.label}
                      </option>
                    ))}
                  </select>
                  {errors.language && (
                    <p className="mt-1 text-sm text-red-600">{errors.language.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="order" className="block text-sm font-medium text-gray-700">
                    Display Order *
                  </label>
                  <input
                    {...register('order', { valueAsNumber: true })}
                    type="number"
                    min="1"
                    placeholder="1"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  {errors.order && (
                    <p className="mt-1 text-sm text-red-600">{errors.order.message}</p>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      {...register('isRequired')}
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isRequired" className="ml-2 block text-sm text-gray-900">
                      Required question
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      {...register('isActive')}
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                      Active question
                    </label>
                  </div>
                </div>
              </div>
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
                  question ? 'Update Question' : 'Create Question'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


