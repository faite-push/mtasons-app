"use client"

import { Search } from 'lucide-react'
import { TrackCard } from './track-card'
import type { Video } from '@/lib/api'

interface SearchResultsProps {
  results: Video[]
  query: string
}

export function SearchResults({ results, query }: SearchResultsProps) {
  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">
          Nenhum resultado encontrado para &ldquo;{query}&rdquo;
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Tente buscar por outro termo ou cole um link do YouTube
        </p>
      </div>
    )
  }

  return (
    <section className="mt-8 overflow-hidden">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl font-semibold text-foreground">
          Resultados para <span className="text-primary">{query}</span>
        </h2>
        <span className="text-muted-foreground text-sm">({results.length})</span>
      </div>
      <div className="grid gap-1">
        {results.map((track) => (
          <TrackCard key={track.id} track={track} />
        ))}
      </div>
    </section>
  )
}
