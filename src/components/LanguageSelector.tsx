'use client'

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { GlobeAltIcon } from '@heroicons/react/24/outline';

export default function LanguageSelector() {
  const { currentLanguage, setLanguage, availableLanguages } = useLanguage();

  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        <GlobeAltIcon className="h-5 w-5 text-gray-400" />
        <select
          value={currentLanguage}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-transparent border-none text-sm font-medium text-gray-700 focus:outline-none focus:ring-0 cursor-pointer"
        >
          {availableLanguages.map((language) => (
            <option key={language.code} value={language.code}>
              {language.nativeName}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}


