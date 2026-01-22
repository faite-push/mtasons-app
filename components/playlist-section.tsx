"use client"

import { useEffect, useState } from 'react'
import { Music, Loader2, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TrackCard } from './track-card'
import { getHitBrasil, type Video } from '@/lib/api'

export function PlaylistSection() {
  const [tracks, setTracks] = useState<Video[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadPlaylist = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getHitBrasil()
      setTracks(data)
    } catch (err) {
      if (err instanceof TypeError && err.message === 'Failed to fetch') {
        setError('API não disponível. Verifique se a URL da API está configurada corretamente.')
      } else {
        setError('Não foi possível carregar a playlist')
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadPlaylist()
  }, [])

  return (
    <section className="mt-8 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-semibold text-foreground">Mais <span className="text-primary">Ouvidas</span></h2>
        </div>
        <button
          onClick={loadPlaylist}
          disabled={isLoading}
          className="flex items-center hover:bg-background/50 text-sm group active:scale-95 transition-all duration-200 py-2 px-4 rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <RefreshCw className={`h-3.5 w-3.5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={loadPlaylist} variant="outline">
            Tentar novamente
          </Button>
        </div>
      ) : tracks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhuma música encontrada</p>
        </div>
      ) : (
        <div className="grid gap-1">
          {tracks.map((track) => (
            <TrackCard key={track.id} track={track} />
          ))}
        </div>
      )}
    </section>
  )
}
