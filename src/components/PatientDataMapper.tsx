'use client'

import React, { useState, useEffect } from 'react';
import { apiClient, EhrMapping, PatientData } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface PatientDataMapperProps {
  onMappingResult?: (result: Record<string, any>) => void;
}

export default function PatientDataMapper({ onMappingResult }: PatientDataMapperProps) {
  const [ehrSystems, setEhrSystems] = useState<string[]>([]);
  const [selectedEhrSystem, setSelectedEhrSystem] = useState<string>('');
  const [language, setLanguage] = useState('en');
  const [patientData, setPatientData] = useState<PatientData>({
    name: 'John Doe',
    gender: 'Male',
    age: 35,
    allergies: 'Penicillin, Shellfish',
    symptoms: 'Chest pain, shortness of breath',
    medications: 'Aspirin 81mg daily',
    familyHistory: 'Father had heart disease',
  });
  const [mappingResult, setMappingResult] = useState<Record<string, any> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    loadEhrSystems();
  }, []);

  const loadEhrSystems = async () => {
    try {
      const systems = await apiClient.getEhrSystems();
      setEhrSystems(systems);
      if (systems.length > 0) {
        setSelectedEhrSystem(systems[0]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load EHR systems');
    }
  };

  const handleMapData = async () => {
    if (!selectedEhrSystem) {
      setError('Please select an EHR system');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setMappingResult(null);

      const result = await apiClient.mapPatientData({
        patientData,
        ehrSystem: selectedEhrSystem,
        language,
      });

      setMappingResult(result);
      onMappingResult?.(result);
    } catch (err: any) {
      setError(err.message || 'Failed to map patient data');
    } finally {
      setIsLoading(false);
    }
  };

  const updatePatientData = (field: string, value: any) => {
    setPatientData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900">Patient Data Mapper</h2>
        <p className="text-sm text-gray-500">
          Test how patient data gets mapped to different EHR systems
        </p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Patient Data Input</h3>

            {/* EHR System Selection */}
            <div className="grid grid-cols-1 gap-4 mb-6">
              <div>
                <label htmlFor="ehr-system" className="block text-sm font-medium text-gray-700 mb-1">
                  Target EHR System
                </label>
                <select
                  id="ehr-system"
                  value={selectedEhrSystem}
                  onChange={(e) => setSelectedEhrSystem(e.target.value)}
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

              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                  Language
                </label>
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>
            </div>

            {/* Patient Data Fields */}
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Patient Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={patientData.name}
                  onChange={(e) => updatePatientData('name', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  id="gender"
                  value={patientData.gender}
                  onChange={(e) => updatePatientData('gender', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  value={patientData.age}
                  onChange={(e) => updatePatientData('age', parseInt(e.target.value))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="allergies" className="block text-sm font-medium text-gray-700 mb-1">
                  Allergies
                </label>
                <textarea
                  id="allergies"
                  rows={2}
                  value={patientData.allergies}
                  onChange={(e) => updatePatientData('allergies', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 mb-1">
                  Symptoms
                </label>
                <textarea
                  id="symptoms"
                  rows={3}
                  value={patientData.symptoms}
                  onChange={(e) => updatePatientData('symptoms', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="medications" className="block text-sm font-medium text-gray-700 mb-1">
                  Current Medications
                </label>
                <textarea
                  id="medications"
                  rows={2}
                  value={patientData.medications}
                  onChange={(e) => updatePatientData('medications', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="familyHistory" className="block text-sm font-medium text-gray-700 mb-1">
                  Family History
                </label>
                <textarea
                  id="familyHistory"
                  rows={2}
                  value={patientData.familyHistory}
                  onChange={(e) => updatePatientData('familyHistory', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleMapData}
                disabled={isLoading || !selectedEhrSystem}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Mapping Data...
                  </>
                ) : (
                  'Map to EHR System'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Output Section */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Mapped EHR Data</h3>

            {mappingResult ? (
              <div className="space-y-4">
                <div className="flex items-center text-green-600">
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  <span className="text-sm font-medium">Successfully mapped to {selectedEhrSystem}</span>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="text-sm text-gray-800 whitespace-pre-wrap overflow-auto">
                    {JSON.stringify(mappingResult, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No mapping result</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Enter patient data and click "Map to EHR System" to see the result.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


