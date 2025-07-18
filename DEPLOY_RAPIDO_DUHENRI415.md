# Deploy Rápido - duhenri415

## COMANDOS DIRETOS (copie e cole)

### 1. Login Docker Hub
```bash
docker login
# Username: duhenri415
# Password: sua senha
```

### 2. Build e Push
```bash
# Build Frontend
docker build -f Dockerfile.frontend -t duhenri415/humantics-frontend:latest .

# Build Backend
docker build -f Dockerfile.backend -t duhenri415/humantics-backend:latest .

# Push para Docker Hub
docker push duhenri415/humantics-frontend:latest
docker push duhenri415/humantics-backend:latest
```

### 3. Criar .env local
```bash
cat > .env << EOF
RESEND_API_KEY=sua_chave_resend
STRIPE_SECRET_KEY=sua_chave_stripe
STRIPE_WEBHOOK_SECRET=seu_webhook_secret
DATABASE_URL=sua_url_postgres
SESSION_SECRET=gerar_senha_aleatoria
EOF
```

### 4. Rodar Local
```bash
# Baixar e rodar
docker-compose -f docker-compose-duhenri415.yml pull
docker-compose -f docker-compose-duhenri415.yml up -d

# Ver logs
docker logs humantic-backend -f
```

### 5. Acessar
- Frontend: http://localhost
- Backend: http://localhost:5000/api/health
- Com Nginx: http://localhost:8080

## NO SERVIDOR DE PRODUÇÃO

```bash
# 1. Copiar arquivos
scp docker-compose-duhenri415.yml usuario@servidor:~/
scp .env usuario@servidor:~/

# 2. No servidor
ssh usuario@servidor
docker-compose -f docker-compose-duhenri415.yml up -d
```

## VERIFICAR STATUS

```bash
# Ver imagens no Docker Hub
curl -s https://hub.docker.com/v2/repositories/duhenri415/humantics-frontend/tags | jq
curl -s https://hub.docker.com/v2/repositories/duhenri415/humantics-backend/tags | jq

# Ver containers rodando
docker ps | grep humantic
```

Pronto! Execute os comandos na ordem.