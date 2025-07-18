# Guia de Deploy Docker - HumanTic

## PRÉ-REQUISITOS

### 1. Instalar Docker Hub CLI
```bash
# Login no Docker Hub
docker login

# Digite seu username e senha do Docker Hub
```

### 2. Criar Repositório no Docker Hub
1. Acesse https://hub.docker.com
2. Clique em "Create Repository"
3. Nome sugerido: `humantics-app`
4. Deixar como Public (ou Private se preferir)

## PASSO A PASSO DO DEPLOY

### ETAPA 1: Build das Imagens

```bash
# 1. Build do Frontend
docker build -f Dockerfile.frontend -t seu-usuario/humantics-frontend:latest .

# 2. Build do Backend
docker build -f Dockerfile.backend -t seu-usuario/humantics-backend:latest .

# Exemplo com seu usuário:
# docker build -f Dockerfile.frontend -t duhenri9/humantics-frontend:latest .
# docker build -f Dockerfile.backend -t duhenri9/humantics-backend:latest .
```

### ETAPA 2: Push para Docker Hub

```bash
# Push Frontend
docker push seu-usuario/humantics-frontend:latest

# Push Backend
docker push seu-usuario/humantics-backend:latest
```

### ETAPA 3: Criar docker-compose para Produção

Criar arquivo `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  # Redis
  redis:
    image: redis:7-alpine
    restart: unless-stopped
    volumes:
      - redis_data:/data
    networks:
      - humantic_network

  # PostgreSQL
  postgres:
    image: postgres:13
    restart: unless-stopped
    environment:
      - POSTGRES_DB=chatwoot
      - POSTGRES_USER=chatwoot
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - humantic_network

  # Chatwoot
  chatwoot-app:
    image: chatwoot/chatwoot:latest
    restart: unless-stopped
    ports:
      - "3001:3000"
    environment:
      - REDIS_URL=redis://redis:6379
      - POSTGRES_HOST=postgres
      - POSTGRES_DB=chatwoot
      - POSTGRES_USER=chatwoot
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - SECRET_KEY_BASE=${CHATWOOT_SECRET_KEY}
    depends_on:
      - redis
      - postgres
    networks:
      - humantic_network

  # HumanTic Backend
  humantic-backend:
    image: seu-usuario/humantics-backend:latest
    restart: unless-stopped
    ports:
      - "5000:5000"
    environment:
      - REDIS_URL=redis://redis:6379
      - RESEND_API_KEY=${RESEND_API_KEY}
      - STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
      - STRIPE_WEBHOOK_SECRET=${STRIPE_WEBHOOK_SECRET}
      - SESSION_SECRET=${SESSION_SECRET}
      - CHATWOOT_URL=http://chatwoot-app:3000
      - CHATWOOT_API_TOKEN=${CHATWOOT_API_TOKEN}
      - NODE_ENV=production
    depends_on:
      - redis
      - chatwoot-app
    networks:
      - humantic_network

  # HumanTic Frontend
  humantic-frontend:
    image: seu-usuario/humantics-frontend:latest
    restart: unless-stopped
    ports:
      - "80:80"
    depends_on:
      - humantic-backend
    networks:
      - humantic_network

volumes:
  redis_data:
  postgres_data:

networks:
  humantic_network:
    driver: bridge
```

### ETAPA 4: Configurar Servidor

No seu servidor (VPS, AWS, etc):

```bash
# 1. Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 2. Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 3. Criar diretório do projeto
mkdir ~/humantics
cd ~/humantics

# 4. Criar arquivo .env
nano .env
```

Conteúdo do `.env`:
```env
# Postgres
POSTGRES_PASSWORD=senha_segura_aqui

# Chatwoot
CHATWOOT_SECRET_KEY=gerar_com_openssl_rand_hex_64

# HumanTic
RESEND_API_KEY=sua_chave_resend
STRIPE_SECRET_KEY=sua_chave_stripe
STRIPE_WEBHOOK_SECRET=seu_webhook_secret
SESSION_SECRET=gerar_com_openssl_rand_hex_32
CHATWOOT_API_TOKEN=token_do_chatwoot
```

### ETAPA 5: Deploy Final

```bash
# 1. Copiar docker-compose.prod.yml para servidor
scp docker-compose.prod.yml usuario@servidor:~/humantics/

# 2. No servidor, iniciar containers
cd ~/humantics
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d

# 3. Verificar se está rodando
docker-compose -f docker-compose.prod.yml ps

# 4. Ver logs
docker-compose -f docker-compose.prod.yml logs -f
```

## COMANDOS ÚTEIS

### Atualizar Aplicação
```bash
# Local: Build nova versão
docker build -f Dockerfile.backend -t seu-usuario/humantics-backend:v1.1 .
docker push seu-usuario/humantics-backend:v1.1

# Servidor: Pull e restart
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

### Backup
```bash
# Backup Redis
docker exec humantics_redis_1 redis-cli BGSAVE

# Backup PostgreSQL
docker exec humantics_postgres_1 pg_dump -U chatwoot chatwoot > backup.sql
```

### Monitoramento
```bash
# Status dos containers
docker ps

# Uso de recursos
docker stats

# Logs específicos
docker logs humantics_humantic-backend_1 --tail 100
```

## CONFIGURAÇÃO DE DOMÍNIO

### Nginx Reverso (no servidor host)
```nginx
server {
    listen 80;
    server_name humantic.wm3digital.com.br;

    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## CHECKLIST FINAL

- [ ] Docker Hub login funcionando
- [ ] Imagens buildadas e enviadas
- [ ] Servidor com Docker instalado
- [ ] Arquivo .env configurado
- [ ] docker-compose.prod.yml no servidor
- [ ] Containers rodando
- [ ] Domínio apontando para servidor
- [ ] SSL configurado (Certbot/Let's Encrypt)

Pronto! Sistema deployado via Docker Hub.