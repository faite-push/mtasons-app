const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

export interface Video {
  id: string
  title: string
  author: string
  duration: number
  thumbnail: string
  richThumb?: string
}

export interface PlayResponse {
  success: boolean
  url: string
  downloadUrl: string
  info: {
    title: string
    author: string
    duration: number
    thumbnail: string
  }
}

export interface GraveVolumeResponse {
  mp3mix: string
  message: string
}

export interface HealthResponse {
  status: string
  uptime: number
  memory: Record<string, unknown>
  views: number
}

export async function searchVideos(query: string): Promise<Video[]> {
  const res = await fetch(`${API_URL}/busca-youtube?src=${encodeURIComponent(query)}`)
  if (!res.ok) throw new Error('Failed to search videos')
  return res.json()
}

export async function getPlayUrl(id: string, retry = false): Promise<PlayResponse> {
  const url = `${API_URL}/play?id=${encodeURIComponent(id)}${retry ? '&retry=true' : ''}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to get play URL')
  return res.json()
}

export function getDownloadUrl(id: string): string {
  return `${API_URL}/download?id=${encodeURIComponent(id)}`
}

export async function getGraveVersion(id: string): Promise<GraveVolumeResponse> {
  const res = await fetch(`${API_URL}/grave?id=${encodeURIComponent(id)}`)
  if (!res.ok) throw new Error('Failed to get bass boosted version')
  return res.json()
}

export async function getVolumeVersion(id: string): Promise<GraveVolumeResponse> {
  const res = await fetch(`${API_URL}/volume?id=${encodeURIComponent(id)}`)
  if (!res.ok) throw new Error('Failed to get volume boosted version')
  return res.json()
}

export async function getHitBrasil(): Promise<Video[]> {
  const res = await fetch(`${API_URL}/hitbrasil`)
  if (!res.ok) throw new Error('Failed to get playlist')
  return res.json()
}

export async function incrementViews(): Promise<{ totalViews: number }> {
  const res = await fetch(`${API_URL}/incrementViews`, { method: 'POST' })
  if (!res.ok) throw new Error('Failed to increment views')
  return res.json()
}

export async function getHealth(): Promise<HealthResponse> {
  const res = await fetch(`${API_URL}/health`)
  if (!res.ok) throw new Error('Failed to get health')
  return res.json()
}
