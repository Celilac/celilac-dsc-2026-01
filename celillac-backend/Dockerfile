# Stage 1: Build
FROM node:20-alpine AS builder

# Instalar pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copiar arquivos de dependência
COPY package.json pnpm-lock.yaml ./

# Instalar dependências
RUN pnpm install --frozen-lockfile

# Copiar o restante do código
COPY . .

# Gerar o build da aplicação
RUN pnpm run build

# Stage 2: Runtime
FROM node:20-alpine

# Instalar pnpm (necessário para instalar apenas dependências de produção)
RUN npm install -g pnpm

WORKDIR /app

# Copiar apenas o necessário do estágio de build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml

# Instalar apenas dependências de produção
RUN pnpm install --prod --frozen-lockfile

# Expor a porta configurada
EXPOSE 3002

# Variáveis de ambiente padrão
ENV PORT=3002

# Iniciar a aplicação
CMD ["node", "dist/main"]
