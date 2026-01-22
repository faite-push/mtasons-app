"use client"

import { useState } from 'react'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Loader2,
  Download,
  Zap,
  Volume1
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'
import { useMusic } from '@/lib/music-context'
import { getDownloadUrl, getGraveVersion, getVolumeVersion } from '@/lib/api'
import { toast } from '@/hooks/use-toast'
import { formatTime } from '@/lib/utils'

export function AudioPlayer() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    audioMode,
    isLoading,
    togglePlay,
    seek,
    setVolume,
    setAudioMode,
    setAudioUrl,
    playNext,
    playPrevious,
  } = useMusic()

  const [isMuted, setIsMuted] = useState(false)
  const [prevVolume, setPrevVolume] = useState(volume)
  const [isLoadingMode, setIsLoadingMode] = useState(false)

  const toggleMute = () => {
    if (isMuted) {
      setVolume(prevVolume)
      setIsMuted(false)
    } else {
      setPrevVolume(volume)
      setVolume(0)
      setIsMuted(true)
    }
  }

  const handleGrave = async () => {
    if (!currentTrack || audioMode === 'grave') return
    setIsLoadingMode(true)
    try {
      const response = await getGraveVersion(currentTrack.id)
      if (response.mp3mix) {
        setAudioUrl(response.mp3mix)
        setAudioMode('grave')
        toast({
          title: "Bass Boost ativado",
          description: "Graves aumentados com sucesso.",
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível ativar o bass boost.",
        variant: "destructive"
      })
    } finally {
      setIsLoadingMode(false)
    }
  }

  const handleVolumeBoosted = async () => {
    if (!currentTrack || audioMode === 'volume') return
    setIsLoadingMode(true)
    try {
      const response = await getVolumeVersion(currentTrack.id)
      if (response.mp3mix) {
        setAudioUrl(response.mp3mix)
        setAudioMode('volume')
        toast({
          title: "Volume Boost ativado",
          description: "Volume aumentado +12dB.",
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível ativar o volume boost.",
        variant: "destructive"
      })
    } finally {
      setIsLoadingMode(false)
    }
  }

  const handleDownload = () => {
    if (currentTrack) {
      window.open(getDownloadUrl(currentTrack.id), '_blank')
      toast({
        title: "Download iniciado",
        description: `Baixando: ${currentTrack.title}`,
      })
    }
  }

  if (!currentTrack) {
    return (
      <> </>
    )
  }

  return (
    <TooltipProvider>
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t border-border/10 p-2 md:p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-2 md:mb-3">
            <span className="text-xs text-muted-foreground w-10 text-right">
              {formatTime(currentTime)}
            </span>
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={1}
              onValueChange={([value]) => seek(value)}
              className="flex-1"
            />
            <span className="text-xs text-muted-foreground w-10">
              {formatTime(duration)}
            </span>
          </div>

          { }
          <div className="flex items-center gap-2 md:gap-4">
            { }
            <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-md overflow-hidden flex-shrink-0 bg-secondary">
                <img
                  src={currentTrack.richThumb || currentTrack.thumbnail || "/placeholder.svg"}
                  alt={currentTrack.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <h4 className="font-medium text-xs md:text-sm truncate text-foreground">{currentTrack.title}</h4>
                <p className="text-xs text-muted-foreground truncate hidden sm:block">{currentTrack.author}</p>
              </div>
            </div>

            { }
            <div className="flex items-center gap-1 md:gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={playPrevious}
                    className="h-8 w-8 md:h-10 md:w-10 text-foreground hidden sm:flex"
                  >
                    <SkipBack className="h-4 w-4 md:h-5 md:w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Música anterior</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={togglePlay}
                    disabled={isLoading}
                    size="icon"
                    className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 md:h-6 md:w-6 animate-spin" />
                    ) : isPlaying ? (
                      <Pause className="h-5 w-5 md:h-6 md:w-6 fill-current" />
                    ) : (
                      <Play className="h-5 w-5 md:h-6 md:w-6 fill-current ml-0.5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{isPlaying ? 'Pausar' : 'Reproduzir'}</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={playNext}
                    className="h-8 w-8 md:h-10 md:w-10 text-foreground hidden sm:flex"
                  >
                    <SkipForward className="h-4 w-4 md:h-5 md:w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Próxima música</TooltipContent>
              </Tooltip>
            </div>

            { }
            <div className="flex items-center gap-2 flex-1 justify-end">
              { }
              <div className="hidden md:flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={audioMode === 'grave' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={handleGrave}
                      disabled={isLoadingMode}
                      className={audioMode === 'grave' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}
                    >
                      {isLoadingMode && audioMode !== 'grave' ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-1" />
                      ) : (
                        <Zap className="h-4 w-4 mr-1" />
                      )}
                      Grave
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Aumentar graves (Bass Boost)</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={audioMode === 'volume' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={handleVolumeBoosted}
                      disabled={isLoadingMode}
                      className={audioMode === 'volume' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}
                    >
                      {isLoadingMode && audioMode !== 'volume' ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-1" />
                      ) : (
                        <Volume1 className="h-4 w-4 mr-1" />
                      )}
                      Vol+
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Aumentar volume (+12dB)</TooltipContent>
                </Tooltip>
              </div>

              { }
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleDownload}
                    className="h-9 w-9 text-muted-foreground hover:text-foreground"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Baixar música</TooltipContent>
              </Tooltip>

              { }
              <div className="hidden sm:flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleMute}
                      className="h-9 w-9 text-muted-foreground hover:text-foreground"
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX className="h-4 w-4" />
                      ) : (
                        <Volume2 className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{isMuted ? 'Ativar som' : 'Silenciar'}</TooltipContent>
                </Tooltip>
                <Slider
                  value={[volume * 100]}
                  max={100}
                  step={1}
                  onValueChange={([value]) => setVolume(value / 100)}
                  className="w-24"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
