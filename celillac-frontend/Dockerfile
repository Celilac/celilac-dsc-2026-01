FROM node:20-alpine

# Instalar pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copiar arquivos de dependência
COPY package.json pnpm-lock.yaml* ./

# Instalar dependências
RUN pnpm install

# Copiar código restante
COPY . .

# Expor porta padrão do Vite dev
EXPOSE 5173

# Iniciar servidor de dev
CMD ["pnpm", "run", "dev"]
