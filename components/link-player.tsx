"use client"

import { useState, useRef, useEffect } from 'react'
import {
  Play,
  Pause,
  X,
  Download,
  Zap,
  Volume2,
  VolumeX,
  Loader2,
  Link as LinkIcon,
  Music
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'
import { toast } from '@/hooks/use-toast'
import { getPlayUrl, getGraveVersion, getDownloadUrl } from '@/lib/api'
import { formatTime } from '@/lib/utils'

interface TrackInfo {
  title: string
  author: string
  thumbnail: string
  duration: number
}

export function LinkPlayer() {
  const [linkInput, setLinkInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isPlayerOpen, setIsPlayerOpen] = useState(false)
  const [trackInfo, setTrackInfo] = useState<TrackInfo | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [graveUrl, setGraveUrl] = useState<string | null>(null)
  const [videoId, setVideoId] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoadingGrave, setIsLoadingGrave] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const audio = new Audio()
    audio.volume = volume
    audioRef.current = audio

    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime)
    })

    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration)
    })

    audio.addEventListener('ended', () => {
      setIsPlaying(false)
    })

    audio.addEventListener('play', () => setIsPlaying(true))
    audio.addEventListener('pause', () => setIsPlaying(false))

    audio.addEventListener('error', () => {
      toast({
        title: "Erro ao carregar",
        description: "Não foi possível carregar o áudio. Tente novamente.",
        variant: "destructive"
      })
    })

    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [])

  const extractVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
      /^([a-zA-Z0-9_-]{11})$/
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) return match[1]
    }
    return null
  }

  const handleSubmitLink = async () => {
    if (!linkInput.trim()) {
      toast({
        title: "Link vazio",
        description: "Por favor, cole um link do YouTube ou ID do vídeo.",
        variant: "destructive"
      })
      return
    }

    const id = extractVideoId(linkInput.trim())
    if (!id) {
      toast({
        title: "Link inválido",
        description: "O link não parece ser um vídeo válido do YouTube.",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    setVideoId(id)

    try {
      const response = await getPlayUrl(id)

      if (response.success && response.url) {
        setAudioUrl(response.url)
        setTrackInfo({
          title: response.info.title,
          author: response.info.author,
          thumbnail: response.info.thumbnail,
          duration: response.info.duration
        })
        setIsPlayerOpen(true)
        setGraveUrl(null)

        if (audioRef.current) {
          audioRef.current.src = response.url
          try {
            await audioRef.current.play()
            toast({
              title: "Reproduzindo",
              description: response.info.title,
            })
          } catch {
            toast({
              title: "Áudio carregado",
              description: "Clique em play para começar.",
            })
          }
        }
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível obter o áudio desse vídeo.",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar à API. Verifique sua conexão.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoadGrave = async () => {
    if (!videoId || graveUrl) return

    setIsLoadingGrave(true)
    try {
      const response = await getGraveVersion(videoId)
      if (response.mp3mix) {
        setGraveUrl(response.mp3mix)
        toast({
          title: "Versão com grave pronta",
          description: "A versão com bass boost está disponível.",
        })
      }
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível gerar a versão com grave.",
        variant: "destructive"
      })
    } finally {
      setIsLoadingGrave(false)
    }
  }

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
  }

  const handleSeek = (value: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value
      setCurrentTime(value)
    }
  }

  const handleVolumeChange = (value: number) => {
    if (audioRef.current) {
      audioRef.current.volume = value
      setVolume(value)
      setIsMuted(value === 0)
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume || 0.7
        setIsMuted(false)
      } else {
        audioRef.current.volume = 0
        setIsMuted(true)
      }
    }
  }

  const handleDownload = (withGrave: boolean) => {
    if (withGrave && graveUrl) {
      window.open(graveUrl, '_blank')
      toast({
        title: "Download iniciado",
        description: "Baixando versão com grave...",
      })
    } else if (videoId) {
      window.open(getDownloadUrl(videoId), '_blank')
      toast({
        title: "Download iniciado",
        description: "Baixando versão normal...",
      })
    }
  }

  const closePlayer = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
    }
    setIsPlayerOpen(false)
    setTrackInfo(null)
    setAudioUrl(null)
    setGraveUrl(null)
    setVideoId(null)
    setCurrentTime(0)
    setDuration(0)
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mb-8">
        <div className="relative flex-1">
          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Cole o link do YouTube ou ID do vídeo..."
            value={linkInput}
            onChange={(e) => setLinkInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmitLink()}
            className="pl-10 h-12 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <Button
          onClick={handleSubmitLink}
          disabled={isLoading}
          className="h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
          ) : (
            <Music className="h-5 w-5 mr-2" />
          )}
          {isLoading ? 'Carregando...' : 'Abrir Player'}
        </Button>
      </div>

      {isPlayerOpen && trackInfo && (
        <TooltipProvider>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="font-semibold text-foreground">Player</h3>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={closePlayer} className="h-8 w-8 text-muted-foreground hover:text-foreground">
                      <X className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Fechar player</TooltipContent>
                </Tooltip>
              </div>

              <div className="p-6">
                <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-4 bg-secondary">
                  <img
                    src={trackInfo.thumbnail || "/placeholder.svg"}
                    alt={trackInfo.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="text-center mb-4">
                  <h4 className="font-semibold text-foreground text-lg truncate">{trackInfo.title}</h4>
                  <p className="text-muted-foreground text-sm">{trackInfo.author}</p>
                </div>

                <div className="mb-4">
                  <Slider
                    value={[currentTime]}
                    max={duration || 100}
                    step={1}
                    onValueChange={([value]) => handleSeek(value)}
                    className="w-full"
                  />
                  <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                { }
                <div className="flex items-center justify-center gap-4 mb-6">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={togglePlay}
                        size="icon"
                        className="h-14 w-14 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        {isPlaying ? (
                          <Pause className="h-7 w-7 fill-current" />
                        ) : (
                          <Play className="h-7 w-7 fill-current ml-1" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{isPlaying ? 'Pausar' : 'Reproduzir'}</TooltipContent>
                  </Tooltip>
                </div>

                { }
                <div className="flex items-center gap-3 mb-6">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={toggleMute} className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{isMuted ? 'Ativar som' : 'Silenciar'}</TooltipContent>
                  </Tooltip>
                  <Slider
                    value={[isMuted ? 0 : volume * 100]}
                    max={100}
                    step={1}
                    onValueChange={([value]) => handleVolumeChange(value / 100)}
                    className="flex-1"
                  />
                </div>

                { }
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground text-center mb-2">Links de Download</p>

                  <div className="grid grid-cols-2 gap-3">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="secondary"
                          onClick={() => handleDownload(false)}
                          className="w-full"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Normal
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Baixar versão sem modificação</TooltipContent>
                    </Tooltip>

                    {graveUrl ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="default"
                            onClick={() => handleDownload(true)}
                            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                          >
                            <Zap className="h-4 w-4 mr-2" />
                            Com Grave
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Baixar versão com bass boost</TooltipContent>
                      </Tooltip>
                    ) : (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            onClick={handleLoadGrave}
                            disabled={isLoadingGrave}
                            className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                          >
                            {isLoadingGrave ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <Zap className="h-4 w-4 mr-2" />
                            )}
                            {isLoadingGrave ? 'Gerando...' : 'Gerar Grave'}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Gerar versão com bass boost</TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TooltipProvider>
      )}
    </>
  )
}
