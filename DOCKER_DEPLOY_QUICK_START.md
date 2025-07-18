# Deploy Rápido - HumanTic no Docker

## Você já tem Redis rodando! ✅

Pelo log, você tem Redis funcionando em `172.17.0.1:50868`. Vamos usar ele.

## PASSO 1: Descobrir seu Docker Hub Username

```bash
# No terminal, digite:
docker login

# Se já estiver logado, ele mostrará:
# Login Succeeded
# Authenticating with existing credentials...
# Stored in /home/usuario/.docker/config.json

# Para ver seu username:
cat ~/.docker/config.json | grep -o '"https://index.docker.io/v1/": {"auth".*' | head -1
```

Ou simplesmente acesse https://hub.docker.com e veja no canto superior direito.

## PASSO 2: Build e Push (exemplo com username "duhenri9")

```bash
# Substitua "duhenri9" pelo SEU username do Docker Hub

# 1. Build Frontend
docker build -f Dockerfile.frontend -t duhenri9/humantics-frontend:latest .

# 2. Build Backend  
docker build -f Dockerfile.backend -t duhenri9/humantics-backend:latest .

# 3. Push para Docker Hub
docker push duhenri9/humantics-frontend:latest
docker push duhenri9/humantics-backend:latest
```

## PASSO 3: Docker Compose para seu ambiente

Crie `docker-compose.local.yml`:

```yaml
version: '3.8'

services:
  # HumanTic Backend (conecta no seu Redis existente)
  humantic-backend:
    image: duhenri9/humantics-backend:latest  # SEU USERNAME AQUI
    container_name: humantic-backend
    ports:
      - "5000:5000"
    environment:
      - REDIS_URL=redis://host.docker.internal:6379  # Conecta no seu Redis
      - RESEND_API_KEY=${RESEND_API_KEY}
      - STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
      - SESSION_SECRET=secret123temporario
      - NODE_ENV=production
    extra_hosts:
      - "host.docker.internal:host-gateway"  # Permite conectar no Redis do host

  # HumanTic Frontend
  humantic-frontend:
    image: duhenri9/humantics-frontend:latest  # SEU USERNAME AQUI
    container_name: humantic-frontend
    ports:
      - "8080:80"
    depends_on:
      - humantic-backend
```

## PASSO 4: Rodar localmente

```bash
# 1. Criar .env (opcional)
echo "RESEND_API_KEY=sua_chave_aqui" > .env
echo "STRIPE_SECRET_KEY=sua_chave_stripe" >> .env

# 2. Iniciar containers
docker-compose -f docker-compose.local.yml up -d

# 3. Ver se está rodando
docker ps

# 4. Acessar
# Frontend: http://localhost:8080
# Backend: http://localhost:5000/api/health
```

## PASSO 5: Testar conexão com Redis

```bash
# Ver logs do backend
docker logs humantic-backend

# Deve aparecer:
# ✅ Redis connected successfully
```

## COMANDOS ÚTEIS

```bash
# Ver seus containers
docker ps -a

# Ver logs
docker logs humantic-backend -f
docker logs humantic-frontend -f

# Parar tudo
docker-compose -f docker-compose.local.yml down

# Reconstruir e rodar
docker-compose -f docker-compose.local.yml up -d --build
```

## PRÓXIMOS PASSOS

1. Confirme seu username Docker Hub
2. Execute os comandos de build/push
3. Rode localmente primeiro para testar
4. Depois faça deploy no servidor de produção

Qual é seu username do Docker Hub para eu ajustar os comandos?