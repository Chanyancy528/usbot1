'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Check, ChevronDown, Globe } from 'lucide-react'
import { useChatStore } from '@/lib/store/chat-store'

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
] as const

export function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const { targetLanguage, setTargetLanguage, showTranslations, setShowTranslations } = useChatStore()

  const selectedLanguage = LANGUAGES.find(lang => lang.code === targetLanguage)

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Globe className="w-4 h-4" />
        {selectedLanguage?.name}
        <ChevronDown className="w-4 h-4" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
          {LANGUAGES.map(language => (
            <button
              key={language.code}
              className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100"
              onClick={() => {
                setTargetLanguage(language.code)
                setIsOpen(false)
              }}
            >
              {language.name}
              {language.code === targetLanguage && (
                <Check className="w-4 h-4 ml-auto" />
              )}
            </button>
          ))}
          <div className="border-t my-1" />
          <button
            className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100"
            onClick={() => setShowTranslations(!showTranslations)}
          >
            {showTranslations ? 'Hide' : 'Show'} Translations
            {showTranslations && <Check className="w-4 h-4 ml-auto" />}
          </button>
        </div>
      )}
    </div>
  )
} 