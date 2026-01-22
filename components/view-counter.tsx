"use client"

import { useEffect, useState } from 'react'
import { Eye } from 'lucide-react'
import { incrementViews } from '@/lib/api'

export function ViewCounter() {
  const [views, setViews] = useState<number | null>(null)

  useEffect(() => {
    const initViews = async () => {
      try {
        const data = await incrementViews()
        setViews(data.totalViews)
      } catch (error) {
        console.error('Failed to increment views:', error)
      }
    }

    initViews()
  }, [])

  if (views === null) return null

  return (
    <div className="inline-flex items-center gap-2 text-muted-foreground animate-in fade-in zoom-in duration-300">
      <img className='w-6 h-6' src="/icon.png" alt="" />
      <span className="text-sm">{views.toLocaleString()} visualizações</span>
    </div>
  )
}