'use client'

import { useState, useEffect } from 'react'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/contexts/AuthContext'
import { useNotifications } from '@/contexts/NotificationContext'
import { useLanguage } from '@/contexts/LanguageContext'
import QuestionFormModal from './QuestionFormModal'

interface Question {
  id: string
  text: string
  category: string
  fieldType: string
  inputType: string
  isRequired: boolean
  isActive: boolean
  order: number
  providerId: string
  language: string
  helpText?: string
}

export default function QuestionManager() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedProvider, setSelectedProvider] = useState<string>('all')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [language, setLanguage] = useState('en')

  const { user } = useAuth()
  const { addNotification } = useNotifications()
  const { t } = useLanguage()

  // Load questions data
  useEffect(() => {
    loadQuestions()
  }, [selectedCategory, selectedProvider, language])

  const loadQuestions = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // TODO: Replace with actual API call when backend is ready
      // For now, we'll use mock data
      const mockQuestions: Question[] = [
        {
          id: '1',
          text: 'What are your current symptoms?',
          category: 'symptoms',
          fieldType: 'patient.symptoms',
          inputType: 'textarea',
          isRequired: true,
          isActive: true,
          order: 1,
          providerId: 'HOSP001',
          language: 'en',
          helpText: 'Please describe any symptoms you are currently experiencing'
        },
        {
          id: '2',
          text: 'Do you have any allergies?',
          category: 'allergies',
          fieldType: 'patient.allergies',
          inputType: 'text',
          isRequired: false,
          isActive: true,
          order: 2,
          providerId: 'HOSP001',
          language: 'en',
          helpText: 'List any known allergies to medications, foods, or environmental factors'
        },
        {
          id: '3',
          text: 'What medications are you currently taking?',
          category: 'medications',
          fieldType: 'patient.currentMedications',
          inputType: 'textarea',
          isRequired: false,
          isActive: true,
          order: 3,
          providerId: 'HOSP001',
          language: 'en',
          helpText: 'Include dosage and frequency'
        },
        {
          id: '4',
          text: '¿Cuáles son sus síntomas actuales?',
          category: 'symptoms',
          fieldType: 'patient.symptoms',
          inputType: 'textarea',
          isRequired: true,
          isActive: true,
          order: 1,
          providerId: 'HOSP001',
          language: 'es',
          helpText: 'Por favor describa cualquier síntoma que esté experimentando actualmente'
        }
      ]

      // Filter by language
      const filteredQuestions = mockQuestions.filter(q => q.language === language)
      setQuestions(filteredQuestions)
    } catch (err: any) {
      setError(err.message || 'Failed to load questions')
      addNotification({
        type: 'error',
        title: 'Failed to load questions',
        message: err.message || 'An error occurred while loading clinical questions',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const categories = ['all', 'symptoms', 'allergies', 'medications', 'family_history', 'social_history']
  const providers = ['all', 'HOSP001', 'HOSP002', 'HOSP003']
  const inputTypes = ['text', 'textarea', 'select', 'radio', 'checkbox']

  const filteredQuestions = questions.filter(question => {
    const categoryMatch = selectedCategory === 'all' || question.category === selectedCategory
    const providerMatch = selectedProvider === 'all' || question.providerId === selectedProvider
    return categoryMatch && providerMatch
  })

  const handleCreateQuestion = () => {
    setEditingQuestion(null)
    setIsCreateModalOpen(true)
  }

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question)
    setIsCreateModalOpen(true)
  }

  const handleModalClose = () => {
    setIsCreateModalOpen(false)
    setEditingQuestion(null)
  }

  const handleModalSuccess = () => {
    loadQuestions() // Reload data after successful create/update
  }

  const handleDeleteQuestion = async (id: string) => {
    if (confirm('Are you sure you want to delete this question?')) {
      try {
        // TODO: Replace with actual API call when backend is ready
        // For now, we'll just remove from local state
        setQuestions(questions.filter(q => q.id !== id))
        addNotification({
          type: 'success',
          title: 'Question deleted',
          message: 'The clinical question has been successfully deleted',
        })
      } catch (err: any) {
        addNotification({
          type: 'error',
          title: 'Failed to delete question',
          message: err.message || 'An error occurred while deleting the question',
        })
      }
    }
  }

  const handleToggleActive = async (question: Question) => {
    try {
      // TODO: Replace with actual API call when backend is ready
      // For now, we'll just update local state
      setQuestions(questions.map(q =>
        q.id === question.id ? { ...q, isActive: !q.isActive } : q
      ))

      addNotification({
        type: 'success',
        title: 'Question updated',
        message: `Question has been ${!question.isActive ? 'activated' : 'deactivated'}`,
      })
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'Failed to update question',
        message: err.message || 'An error occurred while updating the question',
      })
    }
  }

  const handleToggleRequired = async (question: Question) => {
    try {
      // TODO: Replace with actual API call when backend is ready
      // For now, we'll just update local state
      setQuestions(questions.map(q =>
        q.id === question.id ? { ...q, isRequired: !q.isRequired } : q
      ))

      addNotification({
        type: 'success',
        title: 'Question updated',
        message: `Question has been marked as ${!question.isRequired ? 'required' : 'optional'}`,
      })
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'Failed to update question',
        message: err.message || 'An error occurred while updating the question',
      })
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900">{t('nav.questions')}</h2>
          <p className="text-sm text-gray-500">
            Manage clinical questions and form configuration
          </p>
        </div>
        <button
          onClick={handleCreateQuestion}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          New Question
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 flex space-x-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="provider" className="block text-sm font-medium text-gray-700 mb-1">
            Provider
          </label>
          <select
            id="provider"
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            {providers.map(provider => (
              <option key={provider} value={provider}>
                {provider === 'all' ? 'All Providers' : provider}
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
          {/* Questions Table */}
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Question
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Field Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Input Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
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
                {filteredQuestions.map((question) => (
                  <tr key={question.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <div className="text-sm font-medium text-gray-900">{question.text}</div>
                        {question.helpText && (
                          <div className="text-sm text-gray-500 mt-1">{question.helpText}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {question.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {question.fieldType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {question.inputType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {question.order}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleToggleActive(question)}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            question.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {question.isActive ? (
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
                        <button
                          onClick={() => handleToggleRequired(question)}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            question.isRequired
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {question.isRequired ? 'Required' : 'Optional'}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditQuestion(question)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit question"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        {user?.role === 'admin' && (
                          <button
                            onClick={() => handleDeleteQuestion(question.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete question"
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
      {filteredQuestions.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400">
            <DocumentTextIcon className="mx-auto h-12 w-12" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No questions found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new clinical question.
          </p>
          <div className="mt-6">
            <button
              onClick={handleCreateQuestion}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              New Question
            </button>
          </div>
        </div>
      )}

      {/* Question Form Modal */}
      <QuestionFormModal
        isOpen={isCreateModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        question={editingQuestion}
      />
    </div>
  )
}

