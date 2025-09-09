'use client'

import { useState } from 'react'
import {
  BuildingOffice2Icon,
  UserGroupIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  UserIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'
import EhrMappingManager from '@/components/EhrMappingManager'
import PatientManager from '@/components/PatientManager'
import QuestionManager from '@/components/QuestionManager'
import SettingsPanel from '@/components/SettingsPanel'
import PatientDataMapper from '@/components/PatientDataMapper'
import ProtectedRoute from '@/components/ProtectedRoute'
import LanguageSelector from '@/components/LanguageSelector'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'

type TabType = 'mappings' | 'patients' | 'questions' | 'mapper' | 'settings'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('mappings')
  const [searchQuery, setSearchQuery] = useState('')
  const { user, logout } = useAuth()
  const { t } = useLanguage()

  const tabs = [
    { id: 'mappings', name: t('nav.ehr_mappings'), icon: Cog6ToothIcon, count: 12 },
    { id: 'patients', name: t('nav.patients'), icon: UserGroupIcon, count: 156 },
    { id: 'questions', name: t('nav.questions'), icon: DocumentTextIcon, count: 89 },
    { id: 'mapper', name: t('nav.data_mapper'), icon: DocumentTextIcon, count: 0 },
    { id: 'settings', name: t('nav.settings'), icon: BuildingOffice2Icon, count: 0 },
  ]

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'mappings':
        return <EhrMappingManager />
      case 'patients':
        return <PatientManager />
      case 'questions':
        return <QuestionManager />
      case 'mapper':
        return <PatientDataMapper />
      case 'settings':
        return <SettingsPanel />
      default:
        return <EhrMappingManager />
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BuildingOffice2Icon className="h-8 w-8 text-blue-600" />
              <h1 className="ml-3 text-xl font-semibold text-gray-900">
                EHR Mapping System
              </h1>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search mappings, patients, or questions..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <LanguageSelector />

              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <PlusIcon className="h-4 w-4 mr-2" />
                {t('mappings.new_mapping')}
              </button>

              {/* User Profile Dropdown */}
              <div className="relative">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                      <UserIcon className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="hidden md:block">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4 mr-1" />
                    {t('auth.logout')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                  {tab.count > 0 && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {tab.count}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow">
          {renderActiveTab()}
        </div>
      </div>
      </div>
    </ProtectedRoute>
  )
}
