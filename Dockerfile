# --- Estágio 1: Builder (Oficina com todas as ferramentas) ---
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

# Instala TODAS as dependências, incluindo as de desenvolvimento
RUN npm install

COPY . .

# Executa o build para compilar o TypeScript
RUN npm run build

# --- Estágio 2: Produção (Loja limpa, só com o produto final) ---
FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

# Instala APENAS as dependências de produção
RUN npm install --production

# Copia a pasta 'dist' gerada no estágio 'builder'
COPY --from=builder /usr/src/app/dist ./dist

# Expõe a porta
EXPOSE 3000

# Comando padrão para iniciar a aplicação em modo de produção
CMD [ "node", "dist/main" ]