"use client"

import { X, ListMusic, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'
import { useMusic } from '@/lib/music-context'
import { toast } from '@/hooks/use-toast'

interface QueueSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function QueueSidebar({ isOpen, onClose }: QueueSidebarProps) {
  const { queue, removeFromQueue, clearQueue, playTrack, currentTrack } = useMusic()

  if (!isOpen) return null

  const handleClearQueue = () => {
    clearQueue()
    toast({
      title: "Fila limpa",
      description: "Todas as músicas foram removidas da fila.",
    })
  }

  const handleRemoveFromQueue = (index: number, title: string) => {
    removeFromQueue(index)
    toast({
      title: "Removido da fila",
      description: title,
    })
  }

  const handlePlayFromQueue = (track: typeof queue[0]) => {
    playTrack(track)
    toast({
      title: "Reproduzindo",
      description: track.title,
    })
  }

  return (
    <TooltipProvider>
      {}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
        onClick={onClose}
      />

      {}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-card border-l border-border z-50 flex flex-col">
        {}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <ListMusic className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-foreground">Fila de Reprodução</h2>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Fechar fila</TooltipContent>
          </Tooltip>
        </div>

        {}
        {currentTrack && (
          <div className="p-4 border-b border-border">
            <p className="text-xs text-muted-foreground uppercase mb-2">Tocando agora</p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0 bg-secondary">
                <img
                  src={currentTrack.richThumb || currentTrack.thumbnail || "/placeholder.svg"}
                  alt={currentTrack.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "/placeholder.svg"
                  }}
                />
              </div>
              <div className="min-w-0">
                <h4 className="font-medium text-sm truncate text-primary">{currentTrack.title}</h4>
                <p className="text-xs text-muted-foreground truncate">{currentTrack.author}</p>
              </div>
            </div>
          </div>
        )}

        {}
        <div className="flex-1 overflow-y-auto p-4">
          {queue.length === 0 ? (
            <div className="text-center py-8">
              <ListMusic className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">A fila está vazia</p>
              <p className="text-muted-foreground text-xs mt-1">Adicione músicas clicando no botão +</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs text-muted-foreground uppercase">
                  Próximas ({queue.length})
                </p>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearQueue}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Limpar
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Limpar toda a fila</TooltipContent>
                </Tooltip>
              </div>
              <div className="space-y-2">
                {queue.map((track, index) => (
                  <div
                    key={`${track.id}-${index}`}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 group"
                  >
                    <span className="text-xs text-muted-foreground w-5">{index + 1}</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => handlePlayFromQueue(track)}
                          className="w-10 h-10 rounded overflow-hidden flex-shrink-0 bg-secondary"
                        >
                          <img
                            src={track.richThumb || track.thumbnail || "/placeholder.svg"}
                            alt={track.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = "/placeholder.svg"
                            }}
                          />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>Reproduzir agora</TooltipContent>
                    </Tooltip>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm truncate text-foreground">{track.title}</h4>
                      <p className="text-xs text-muted-foreground truncate">{track.author}</p>
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveFromQueue(index, track.title)}
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Remover da fila</TooltipContent>
                    </Tooltip>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}
