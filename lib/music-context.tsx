"use client"

import { createContext, useContext, useState, useRef, useCallback, useEffect, type ReactNode } from 'react'
import { type Video, getPlayUrl, incrementViews } from './api'

type AudioMode = 'normal' | 'grave' | 'volume'

interface MusicContextType {
  currentTrack: Video | null
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  audioMode: AudioMode
  audioUrl: string | null
  isLoading: boolean
  queue: Video[]
  playTrack: (track: Video) => Promise<void>
  togglePlay: () => void
  pause: () => void
  seek: (time: number) => void
  setVolume: (volume: number) => void
  setAudioMode: (mode: AudioMode) => void
  setAudioUrl: (url: string) => void
  addToQueue: (track: Video) => void
  removeFromQueue: (index: number) => void
  playNext: () => void
  playPrevious: () => void
  clearQueue: () => void
}

const MusicContext = createContext<MusicContextType | null>(null)

export function MusicProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Video | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolumeState] = useState(0.7)
  const [audioMode, setAudioModeState] = useState<AudioMode>('normal')
  const [audioUrl, setAudioUrlState] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [queue, setQueue] = useState<Video[]>([])
  const [history, setHistory] = useState<Video[]>([])
  
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
      if (queue.length > 0) {
        const nextTrack = queue[0]
        setQueue(prev => prev.slice(1))
        playTrack(nextTrack)
      }
    })

    audio.addEventListener('play', () => setIsPlaying(true))
    audio.addEventListener('pause', () => setIsPlaying(false))

    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [])

  const playTrack = useCallback(async (track: Video) => {
    if (!audioRef.current) return
    
    setIsLoading(true)
    setCurrentTrack(track)
    setAudioModeState('normal')
    
    try {
      const response = await getPlayUrl(track.id)
      if (response.success && response.url) {
        audioRef.current.src = response.url
        setAudioUrlState(response.url)
        await audioRef.current.play()
        setIsPlaying(true)
        
        
        setHistory(prev => {
          const newHistory = prev.filter(t => t.id !== track.id)
          return [track, ...newHistory].slice(0, 50)
        })
        
        
        incrementViews().catch(console.error)
      }
    } catch (error) {
      console.error('Failed to play track:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return
    
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
  }, [isPlaying])

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
  }, [])

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }, [])

  const setVolume = useCallback((newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = newVolume
      setVolumeState(newVolume)
    }
  }, [])

  const setAudioMode = useCallback((mode: AudioMode) => {
    setAudioModeState(mode)
  }, [])

  const setAudioUrl = useCallback((url: string) => {
    if (audioRef.current) {
      const wasPlaying = !audioRef.current.paused
      audioRef.current.src = url
      setAudioUrlState(url)
      if (wasPlaying) {
        audioRef.current.play()
      }
    }
  }, [])

  const addToQueue = useCallback((track: Video) => {
    setQueue(prev => [...prev, track])
  }, [])

  const removeFromQueue = useCallback((index: number) => {
    setQueue(prev => prev.filter((_, i) => i !== index))
  }, [])

  const playNext = useCallback(() => {
    if (queue.length > 0) {
      const nextTrack = queue[0]
      setQueue(prev => prev.slice(1))
      if (currentTrack) {
        setHistory(prev => [currentTrack, ...prev])
      }
      playTrack(nextTrack)
    }
  }, [queue, currentTrack, playTrack])

  const playPrevious = useCallback(() => {
    if (history.length > 0) {
      const prevTrack = history[0]
      setHistory(prev => prev.slice(1))
      if (currentTrack) {
        setQueue(prev => [currentTrack, ...prev])
      }
      playTrack(prevTrack)
    }
  }, [history, currentTrack, playTrack])

  const clearQueue = useCallback(() => {
    setQueue([])
  }, [])

  return (
    <MusicContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        audioMode,
        audioUrl,
        isLoading,
        queue,
        playTrack,
        togglePlay,
        pause,
        seek,
        setVolume,
        setAudioMode,
        setAudioUrl,
        addToQueue,
        removeFromQueue,
        playNext,
        playPrevious,
        clearQueue,
      }}
    >
      {children}
    </MusicContext.Provider>
  )
}

export function useMusic() {
  const context = useContext(MusicContext)
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider')
  }
  return context
}
