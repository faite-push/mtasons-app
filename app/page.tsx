"use client"

import { useState, useCallback } from 'react'
import { MusicProvider } from '@/lib/music-context'
import { searchVideos, type Video } from '@/lib/api'
import { Header } from '@/components/header'
import { SearchBar } from '@/components/search-bar'
import { SearchResults } from '@/components/search-results'
import { PlaylistSection } from '@/components/playlist-section'
import { AudioPlayer } from '@/components/audio-player'
import { QueueSidebar } from '@/components/queue-sidebar'
import { LinkPlayer } from '@/components/link-player'
import { ViewCounter } from '@/components/view-counter'
import { toast } from '@/hooks/use-toast'

function MusicApp() {
  const [searchResults, setSearchResults] = useState<Video[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [isQueueOpen, setIsQueueOpen] = useState(false)

  const handleSearch = useCallback(async (query: string) => {
    setIsSearching(true)
    setSearchQuery(query)
    try {
      const results = await searchVideos(query)
      setSearchResults(results)
      setHasSearched(true)
      if (results.length > 0) {
        toast({
          title: "Resultados encontrados",
          description: `${results.length} músicas encontradas para "${query}"`,
        })
      } else {
        toast({
          title: "Nenhum resultado",
          description: `Nenhuma música encontrada para "${query}"`,
        })
      }
    } catch (error) {
      toast({
        title: "Erro na busca",
        description: "Não foi possível realizar a busca. Tente novamente.",
        variant: "destructive"
      })
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }, [])

  return (
    <div className="min-h-screen bg-background pb-32 relative overflow-x-hidden">
      <div
        className="fixed inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'url("https://cdn.ereemby.com/attachments/17646913328866000imagem.png")',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          filter: 'blur(8px)'
        }}
      />
      <div className="relative z-10">
        <Header onOpenQueue={() => setIsQueueOpen(true)} />

        <main className="max-w-7xl items-center mx-auto px-4 py-8 pt-20 md:pt-32">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <ViewCounter />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-3">
              Encontre sua <span className="text-primary">música favorita</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-8">
              Busque, ouça e baixe músicas. Adicione grave extra ou aumente o volume com um clique.
            </p>

            <div className="max-w-2xl mx-auto">
              <SearchBar onSearch={handleSearch} isLoading={isSearching} />
            </div>
          </div>

          {hasSearched && (
            <SearchResults results={searchResults} query={searchQuery} />
          )}

          {!hasSearched && <PlaylistSection />}
        </main>
        <AudioPlayer />

        <QueueSidebar isOpen={isQueueOpen} onClose={() => setIsQueueOpen(false)} />
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <MusicProvider>
      <MusicApp />
    </MusicProvider>
  )
}