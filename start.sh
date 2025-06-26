#!/bin/bash
set -e

# Verifica se o arquivo .env existe
if [ ! -f .env ]; then
  echo "Arquivo .env não encontrado na raiz. Crie-o primeiro com DATABASE_URL, JWT_SECRET etc."
  exit 1
fi

# Exporta variáveis do .env para o ambiente atual
echo "Carregando variáveis do .env..."
set -a
. ./.env
set +a

# Instala dependências se a pasta node_modules não existir
if [ ! -d node_modules ]; then
  echo "Instalando dependências npm..."
  npm install
fi

# Sobe o serviço postgres (evita reconstruir web a cada vez)
echo "Subindo container PostgreSQL..."
docker compose up -d postgres

# Aguarda o Postgres aceitar conexões
echo "Aguardando o PostgreSQL inicializar..."
until docker exec postgres pg_isready -U user >/dev/null 2>&1; do
  sleep 1
  printf "."
done

# Executa migrations e gera client Prisma
echo "Executando migrations Prisma..."
npx prisma migrate deploy

# Inicia todas as apps em modo dev (Turborepo)
echo "Iniciando ambiente de desenvolvimento (API e Web)..."
npm run dev 