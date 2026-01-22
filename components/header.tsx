"use client"

import { ListMusic, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'
import { useMusic } from '@/lib/music-context'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

interface HeaderProps {
  onOpenQueue: () => void
}

export function Header({ onOpenQueue }: HeaderProps) {
  const { queue } = useMusic()

  return (
    <TooltipProvider>
      <header className="sticky top-0 z-30 bg-background/10 backdrop-blur-sm border-b border-border/10">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div className="w-16 h-16 flex items-center justify-center">
              <img className='w-max h-max' src="https://cdn.ereemby.com/attachments/17646912590203927imagem.png" alt="" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">MTA Sons</h1>
              <p className="text-xs text-muted-foreground">Sua música, seu ritmo</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-12 absolute left-1/2 -translate-x-1/2">
            <button className="text-sm trasition-all duration-300 cursor-pointer text-foreground hover:text-primary" onClick={() => { window.location.href = "/" }}>
              Início
            </button>
            <button className="text-sm trasition-all duration-300 cursor-pointer text-foreground hover:text-primary" onClick={() => { window.location.href = "/termos" }}>
              Termos
            </button>
            <button className="text-sm trasition-all duration-300 cursor-pointer text-foreground hover:text-primary" onClick={() => { window.location.href = "/contato" }}>
              Contato
            </button>
          </div>

          <div className="flex items-center gap-2">
            {}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-4 mt-6">
                    <Button variant="ghost" className="justify-start" onClick={() => { window.location.href = "/" }}>
                      Início
                    </Button>
                    <Button variant="ghost" className="justify-start" onClick={() => { window.location.href = "/termos" }}>
                      Termos
                    </Button>
                    <Button variant="ghost" className="justify-start" onClick={() => { window.location.href = "/contato" }}>
                      Contato
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onOpenQueue}
                  className="relative text-foreground cursor-pointer"
                >
                  <ListMusic className="h-5 w-5 mr-2" />
                  <span className="hidden sm:inline">Fila</span>
                  {queue.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                      {queue.length}
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Ver fila de reprodução</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </header>
    </TooltipProvider>
  )
}
