"use client"

import { Header } from '@/components/header'
import { Mail, MessageSquare, Instagram, Heart, QrCode, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import { MusicProvider } from '@/lib/music-context'
import { FaDiscord } from 'react-icons/fa'

export default function ContactPage() {
  return (
    <MusicProvider>
      <ContactPageContent />
    </MusicProvider>
  )
}

function ContactPageContent() {
  const pixKey = "bmrpix@gmail.com"

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixKey)
    toast({
      title: "Chave PIX copiada!",
      description: "A chave PIX foi copiada para sua área de transferência.",
    })
  }

  return (
    <div className="min-h-screen bg-background pb-32 relative overflow-x-hidden">
      <div
        className="fixed inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'url("https://cdn.ereemby.com/attachments/17646913328866000imagem.png")',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          filter: 'blur(8px)'
        }}
      />
      <div className="relative z-10">
        <Header onOpenQueue={() => { }} />

        <main className="max-w-7xl mx-auto px-4 py-8 pt-20 md:pt-32">

          {/* Apoie o MTA Sons Section */}
          <div className="bg-card/10 border border-primary/5 rounded-xl p-6 md:p-8 shadow-xl mb-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-3 text-primary">
                  <Heart className="h-6 w-6 fill-current" />
                  <h2 className="text-2xl font-bold">Apoie o MTA Sons!</h2>
                </div>
                <p className="text-muted-foreground mb-4">
                  Sua contribuição é fundamental para manter o MTA Sons online e gratuito. Ajude-nos a continuar oferecendo a melhor experiência de música sem anúncios!
                </p>
                <div className="bg-card/30 rounded-lg p-4 border border-border/50 inline-block py-4 px-6">
                  <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Chave PIX (Email)</p>
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <h1 className="text-base text-foreground">{pixKey}</h1>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopyPix}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0 bg-white p-2 rounded-lg">
                {/* Placeholder for QR Code - using an icon as represented in the request, but ideally would be a real QR code image */}
                <div className="w-32 h-32 bg-gray-100 flex items-center justify-center rounded border border-gray-200">
                  <img src="/qrcode.png" alt="" />
                </div>
                <p className="text-[10px] text-center text-gray-500 mt-1">QR Code PIX</p>
              </div>
            </div>
          </div>

          <div className="bg-card/30 backdrop-blur-md border border-border/50 rounded-xl p-6 md:p-10 shadow-xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Fale Conosco
            </h1>
            <p className="text-center text-muted-foreground mb-10 max-w-lg mx-auto">
              Estamos aqui para responder suas dúvidas e receber seu feedback. Escolha o melhor canal para falar com a gente.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <a
                href="https://discord.gg/bmr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center p-6 rounded-lg bg-background/40 border border-border/50 hover:border-primary/50 hover:bg-background/60 transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-[#5865F2]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FaDiscord className="h-6 w-6 text-[#5865F2]" />
                </div>
                <h3 className="text-lg font-bold mb-2">Comunidade Discord</h3>
                <p className="text-sm text-center text-muted-foreground mb-4">
                  Suporte instantâneo e conversas com a comunidade.
                </p>
                <div className="mt-auto text-primary font-medium text-sm">Entrar no Discord &rarr;</div>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/brasilmundoreal"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center p-6 rounded-lg bg-background/40 border border-border/50 hover:border-primary/50 hover:bg-background/60 transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-[#E4405F]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Instagram className="h-6 w-6 text-[#E4405F]" />
                </div>
                <h3 className="text-lg font-bold mb-2">Instagram</h3>
                <p className="text-sm text-center text-muted-foreground mb-4">
                  Novidades, eventos e conteúdos exclusivos.
                </p>
                <div className="mt-auto text-primary font-medium text-sm">Seguir @brasilmundoreal &rarr;</div>
              </a>

              {/* Email */}
              <a
                href={`mailto:${pixKey}`}
                className="flex flex-col items-center p-6 rounded-lg bg-background/40 border border-border/50 hover:border-primary/50 hover:bg-background/60 transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">E-mail</h3>
                <p className="text-sm text-center text-muted-foreground mb-4">
                  Suporte técnico e parcerias comerciais.
                </p>
                <div className="mt-auto text-primary font-medium text-sm">Enviar mensagem &rarr;</div>
              </a>
            </div>

            <hr className="border-border/50 my-10" />

            <div className="text-center text-sm text-muted-foreground">
              <p>MTA Sons © 2025. Todos os direitos reservados.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
