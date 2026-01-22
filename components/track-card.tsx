import { Play, Pause, Plus, Video as VideoIcon, Link, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'
import { useMusic } from '@/lib/music-context'
import { getPlayUrl, getGraveVersion, type Video } from '@/lib/api'
import { toast } from '@/hooks/use-toast'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { useState } from 'react'
import { formatTime } from '@/lib/utils'

interface TrackCardProps {
  track: Video
  showAddToQueue?: boolean
}

export function TrackCard({ track, showAddToQueue = true }: TrackCardProps) {
  const { currentTrack, isPlaying, playTrack, togglePlay, addToQueue, isLoading } = useMusic()
  const isCurrentTrack = currentTrack?.id === track.id
  const isCurrentlyPlaying = isCurrentTrack && isPlaying
  const isCurrentlyLoading = isCurrentTrack && isLoading
  const [copied, setCopied] = useState(false)

  const handlePlay = () => {
    if (isCurrentTrack) {
      togglePlay()
    } else {
      playTrack(track)
      toast({
        title: "Reproduzindo",
        description: track.title,
      })
    }
  }

  const handleAddToQueue = () => {
    addToQueue(track)
    toast({
      title: "Adicionado à fila",
      description: track.title,
    })
  }

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(`setradio ${text}`)
      toast({
        title: "Link copiado!",
        description: `Link ${type} copiado para a área de transferência`,
      })
    } catch (err) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o link",
        variant: "destructive"
      })
    }
  }

  const handleCopyLink = async (bassBoosted: boolean) => {
    try {
      if (bassBoosted) {
        const response = await getGraveVersion(track.id)
        await copyToClipboard(response.mp3mix, "com grave + volume")
      } else {
        const response = await getPlayUrl(track.id)
        await copyToClipboard(response.url, "original")
      }
    } catch (error) {
      toast({
        title: "Erro ao gerar link",
        description: "Tente novamente mais tarde",
        variant: "destructive"
      })
    }
  }

  return (
    <TooltipProvider>
      <div className={`group flex items-center gap-4 p-3 rounded-lg transition-all hover:bg-secondary/80 ${isCurrentTrack ? 'bg-secondary' : ''} max-w-full overflow-hidden`}>
        <div className="relative flex-shrink-0 w-14 h-14 rounded-md overflow-hidden bg-background/80 backdrop-blur-sm border-border/10">
          <img
            src={track.richThumb || track.thumbnail || "/placeholder.svg"}
            alt={track.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = "/placeholder.svg"
            }}
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handlePlay}
                disabled={isCurrentlyLoading}
                className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {isCurrentlyLoading ? (
                  <Loader2 className="h-6 w-6 text-primary animate-spin" />
                ) : isCurrentlyPlaying ? (
                  <Pause className="h-6 w-6 text-primary fill-primary" />
                ) : (
                  <Play className="h-6 w-6 text-primary fill-primary" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>{isCurrentlyPlaying ? 'Pausar' : 'Reproduzir'}</TooltipContent>
          </Tooltip>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className={`font-medium text-sm truncate ${isCurrentTrack ? 'text-primary' : 'text-foreground'}`}>
            {track.title}
          </h3>
          <p className="text-sm text-muted-foreground truncate">{track.author}</p>
        </div>

        <span className="text-sm text-muted-foreground hidden sm:block flex-shrink-0">
          {formatTime(track.duration)}
        </span>

        <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex-shrink-0">
          <Dialog>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                    <VideoIcon className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent>Assistir no YouTube</TooltipContent>
            </Tooltip>
            <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-black">
              <div className="aspect-video w-full">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${track.id}?autoplay=1`}
                  title={track.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="border-0"
                />
              </div>
            </DialogContent>
          </Dialog>

          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                    <Link className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>Copiar Link</TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleCopyLink(false)}>
                Copiar Original
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleCopyLink(true)}>
                Copiar com Grave + Volume
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {showAddToQueue && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleAddToQueue}
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Adicionar à fila</TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}

function Loader2({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}
