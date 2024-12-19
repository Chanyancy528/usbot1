'use client'

import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Check, ChevronDown, Volume2, Search, X } from 'lucide-react'
import { useChatStore } from '@/lib/store/chat-store'
import { ElevenLabsTTS } from '@/server/services/speech/elevenlabs-tts'

interface Voice {
  id: string;
  name: string;
  preview_url?: string;
  labels?: {
    accent?: string;
    age?: string;
    gender?: string;
    use_case?: string;
  };
}

interface FilterOptions {
  accent?: string;
  gender?: string;
  useCase?: string;
}

export function VoiceSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const [voices, setVoices] = useState<Voice[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { selectedVoice, setSelectedVoice } = useChatStore()
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(null)
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<FilterOptions>({})

  // Extract unique filter options from voices
  const filterOptions = useMemo(() => {
    return voices.reduce((acc, voice) => {
      if (voice.labels) {
        acc.accents.add(voice.labels.accent || '')
        acc.genders.add(voice.labels.gender || '')
        acc.useCases.add(voice.labels.use_case || '')
      }
      return acc
    }, {
      accents: new Set<string>(),
      genders: new Set<string>(),
      useCases: new Set<string>()
    })
  }, [voices])

  // Filter voices based on search and filters
  const filteredVoices = useMemo(() => {
    return voices.filter(voice => {
      // Search by name
      const matchesSearch = voice.name.toLowerCase()
        .includes(searchQuery.toLowerCase())

      // Apply filters
      const matchesAccent = !filters.accent || 
        voice.labels?.accent === filters.accent
      const matchesGender = !filters.gender || 
        voice.labels?.gender === filters.gender
      const matchesUseCase = !filters.useCase || 
        voice.labels?.use_case === filters.useCase

      return matchesSearch && matchesAccent && matchesGender && matchesUseCase
    })
  }, [voices, searchQuery, filters])

  useEffect(() => {
    loadVoices()
  }, [])

  const loadVoices = async () => {
    try {
      setIsLoading(true)
      const voiceList = await ElevenLabsTTS.getVoices()
      setVoices(voiceList)
    } catch (error) {
      console.error('Failed to load voices:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const playPreview = (previewUrl: string) => {
    if (previewAudio) {
      previewAudio.pause()
      previewAudio.currentTime = 0
    }
    const audio = new Audio(previewUrl)
    setPreviewAudio(audio)
    audio.play()
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-2"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
      >
        <Volume2 className="w-4 h-4" />
        {selectedVoice?.name || 'Select Voice'}
        <ChevronDown className="w-4 h-4" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50">
          {/* Search bar */}
          <div className="px-4 pb-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search voices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-8"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-2.5"
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>
          </div>

          {/* Filter buttons */}
          <div className="px-4 pb-2 flex gap-2 flex-wrap">
            {/* Accent filter */}
            <select
              value={filters.accent || ''}
              onChange={(e) => setFilters(f => ({ ...f, accent: e.target.value }))}
              className="text-sm border rounded px-2 py-1"
            >
              <option value="">All Accents</option>
              {Array.from(filterOptions.accents).map(accent => (
                <option key={accent} value={accent}>{accent}</option>
              ))}
            </select>

            {/* Gender filter */}
            <select
              value={filters.gender || ''}
              onChange={(e) => setFilters(f => ({ ...f, gender: e.target.value }))}
              className="text-sm border rounded px-2 py-1"
            >
              <option value="">All Genders</option>
              {Array.from(filterOptions.genders).map(gender => (
                <option key={gender} value={gender}>{gender}</option>
              ))}
            </select>

            {/* Use case filter */}
            <select
              value={filters.useCase || ''}
              onChange={(e) => setFilters(f => ({ ...f, useCase: e.target.value }))}
              className="text-sm border rounded px-2 py-1"
            >
              <option value="">All Use Cases</option>
              {Array.from(filterOptions.useCases).map(useCase => (
                <option key={useCase} value={useCase}>{useCase}</option>
              ))}
            </select>

            {/* Clear filters button */}
            {Object.values(filters).some(Boolean) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilters({})}
                className="text-xs"
              >
                Clear Filters
              </Button>
            )}
          </div>

          {/* Voice list */}
          <div className="max-h-60 overflow-y-auto">
            {filteredVoices.length === 0 ? (
              <div className="px-4 py-2 text-sm text-gray-500">
                No voices found
              </div>
            ) : (
              filteredVoices.map(voice => (
                <div
                  key={voice.id}
                  className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSelectedVoice(voice)
                    setIsOpen(false)
                  }}
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{voice.name}</span>
                    <span className="text-xs text-gray-500">
                      {[
                        voice.labels?.accent,
                        voice.labels?.gender,
                        voice.labels?.use_case
                      ].filter(Boolean).join(' • ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedVoice?.id === voice.id && (
                      <Check className="w-4 h-4" />
                    )}
                    {voice.preview_url && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1"
                        onClick={(e) => {
                          e.stopPropagation()
                          playPreview(voice.preview_url!)
                        }}
                      >
                        <Volume2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
} 