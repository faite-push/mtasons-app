"use client"

import { Header } from '@/components/header'
import { useState } from 'react'
import { MusicProvider } from '@/lib/music-context'

export default function TermsPage() {
  return (
    <MusicProvider>
      <TermsPageContent />
    </MusicProvider>
  )
}

function TermsPageContent() {
  const [isQueueOpen, setIsQueueOpen] = useState(false)

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

        <main className="max-w-7xl mx-auto px-4 py-8 pt-12 md:pt-22">
          <div className="">
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Termos de Uso
            </h1>

            <div className="space-y-8 text-foreground/90 leading-relaxed">
              <section>
                <h2 className="text-xl font-semibold mb-3 text-foreground">1. Aceitação dos Termos</h2>
                <p>
                  Ao usar o MTA Sons, você concorda com estes termos. Por favor, leia-os cuidadosamente. Se não concordar com qualquer parte destes termos, você não deve usar nosso serviço.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-foreground">2. Uso do Serviço</h2>
                <p>
                  O MTA Sons é uma plataforma para busca e reprodução de músicas. Você concorda em usar o serviço apenas para fins legais e de acordo com estes termos. Qualquer uso indevido ou violação destes termos pode resultar na suspensão ou encerramento do seu acesso ao serviço.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-foreground">3. Conteúdo</h2>
                <p>
                  O conteúdo disponibilizado através do MTA Sons é de propriedade de terceiros. Não reivindicamos propriedade sobre esse conteúdo. O serviço atua apenas como um meio de busca e indexação de conteúdo disponível publicamente.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-foreground">4. Direitos Autorais</h2>
                <p>
                  Respeite os direitos autorais. O download ou uso não autorizado de conteúdo protegido por direitos autorais é proibido. Se você é proprietário de direitos autorais e acredita que seu trabalho foi usado de maneira que constitui violação de direitos autorais, entre em contato conosco.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-foreground">5. Limitação de Responsabilidade</h2>
                <p>
                  O MTA Sons não se responsabiliza por qualquer uso indevido do serviço ou por conteúdos de terceiros. Não garantimos a disponibilidade contínua do serviço ou que ele estará livre de erros. O uso do serviço é por sua conta e risco.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-foreground">6. Modificações do Serviço</h2>
                <p>
                  Reservamo-nos o direito de modificar ou descontinuar o serviço a qualquer momento, sem aviso prévio. Podemos também alterar estes Termos de Uso periodicamente, e o uso continuado do serviço após tais alterações constitui sua aceitação dos novos termos.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-foreground">7. Privacidade</h2>
                <p>
                  Sua privacidade é importante para nós. Consulte nossa Política de Privacidade para entender como coletamos e usamos suas informações. Ao usar o serviço, você concorda com nossa coleta e uso de informações de acordo com a Política de Privacidade.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-foreground">8. Contato</h2>
                <p>
                  Para quaisquer dúvidas sobre estes termos, entre em contato conosco através do email: <a href="mailto:contato@mtasons.com.br" className="text-primary hover:underline">contato@mtasons.com.br</a>. Estamos disponíveis para esclarecer quaisquer questões relacionadas a estes Termos de Uso.
                </p>
              </section>

              <hr className="border-border/50 my-8" />

              <div className="text-center text-sm text-muted-foreground">
                <p>MTA Sons © 2025. Todos os direitos reservados.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
