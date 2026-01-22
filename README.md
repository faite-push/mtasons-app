# MTA Sons - App

Interface web moderna para o player de música MTA Sons.

## Tecnologias

- [Next.js](https://nextjs.org/) 14
- React
- Typescript
- Tailwind CSS
- Shadcn/ui (Componentes de UI)
- Lucide React (Ícones)

## Pré-requisitos

- Node.js instalado

## Instalação

1. Entre na pasta do aplicativo:
   ```bash
   cd mtasons-app
   ```
2. Instale as dependências:
   ```bash
   npm install
   # ou
   pnpm install
   ```

## Configuração

Copie o arquivo `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

### Variáveis de Ambiente

- `NEXT_PUBLIC_API_URL`: URL da API backend (Ex: `http://localhost:5000`)

## Executando

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm run build
npm start
```

## Funcionalidades

- Player de música flutuante persistente
- Busca de músicas com debounce
- Visualização de "Hit Brasil" (Top músicas)
- Player via Link (YouTube)
- Controle de Volume e Progresso
- Modos de Áudio: Normal, Bass Boost, Volume Boost
- Design Responsivo e Tema Escuro
