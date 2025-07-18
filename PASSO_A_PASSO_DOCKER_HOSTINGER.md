# Passo a Passo Cirúrgico: Docker Local → Hostinger

## ETAPA 1: Correção da Estrutura Docker (LOCAL)

### 1.1 Corrigir docker-compose-complete.yml

**PROBLEMA IDENTIFICADO**: Faltou `chatwoot-app` - vou corrigir agora.

```yaml
# ANTES (problema):
chatwoot-web:
  image: chatwoot/chatwoot:latest

# DEPOIS (correto):
chatwoot-app:
  image: chatwoot/chatwoot:latest
  container_name: humantic-chatwoot-app
```

### 1.2 Separação Frontend/Backend

**ESTRUTURA ATUAL**: Monolito (frontend + backend no mesmo container)
**ESTRUTURA NECESSÁRIA**: Containers separados

```
ANTES:
├── humantic-app (React + Express juntos)

DEPOIS:
├── humantic-frontend (React build estático)
├── humantic-backend (Express.js API)
```

## ETAPA 2: Reestruturação para Containers Separados

### 2.1 Frontend Container (Dockerfile.frontend)
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY client/ ./client/
COPY shared/ ./shared/
RUN npm ci && npm run build:client

FROM nginx:alpine
COPY --from=builder /app/dist/public /usr/share/nginx/html
COPY nginx-frontend.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 2.2 Backend Container (Dockerfile.backend)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
COPY server/ ./server/
COPY shared/ ./shared/
RUN npm ci --only=production && npm run build:server
EXPOSE 5000
CMD ["npm", "run", "start:prod"]
```

## ETAPA 3: Configuração Docker Local Correta

### 3.1 docker-compose-local.yml (COMPLETO E CORRIGIDO)
```yaml
version: '3.8'
services:
  # Redis
  redis:
    image: redis:7-alpine
    container_name: humantic-redis
    ports: ["6379:6379"]
    volumes: [redis_data:/data]
    command: redis-server --appendonly yes
    networks: [humantic_network]

  # PostgreSQL para Chatwoot
  postgres:
    image: postgres:13
    container_name: humantic-postgres
    environment:
      POSTGRES_DB: chatwoot
      POSTGRES_USER: chatwoot
      POSTGRES_PASSWORD: chatwoot123
    volumes: [postgres_data:/var/lib/postgresql/data]
    networks: [humantic_network]

  # Chatwoot (CORRIGIDO)
  chatwoot-app:
    image: chatwoot/chatwoot:latest
    container_name: humantic-chatwoot-app
    ports: ["3001:3000"]
    environment:
      - REDIS_URL=redis://redis:6379
      - POSTGRES_HOST=postgres
      - POSTGRES_DB=chatwoot
      - POSTGRES_USER=chatwoot
      - POSTGRES_PASSWORD=chatwoot123
      - SECRET_KEY_BASE=${SECRET_KEY_BASE}
      - INSTALLATION_ENV=docker
    depends_on: [redis, postgres]
    networks: [humantic_network]

  # HumanTic Backend
  humantic-backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    container_name: humantic-backend
    ports: ["5000:5000"]
    environment:
      - REDIS_URL=redis://redis:6379
      - CHATWOOT_URL=http://chatwoot-app:3000
      - NODE_ENV=production
    depends_on: [redis, chatwoot-app]
    networks: [humantic_network]

  # HumanTic Frontend
  humantic-frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    container_name: humantic-frontend
    ports: ["8080:80"]
    depends_on: [humantic-backend]
    networks: [humantic_network]

  # Nginx Proxy
  nginx-proxy:
    image: nginx:alpine
    container_name: humantic-nginx
    ports: ["80:80"]
    volumes: ["./nginx-proxy.conf:/etc/nginx/nginx.conf"]
    depends_on: [humantic-frontend, humantic-backend]
    networks: [humantic_network]

volumes:
  redis_data:
  postgres_data:

networks:
  humantic_network:
    driver: bridge
```

## ETAPA 4: Configuração para Hostinger

### 4.1 Análise Hostinger
**LIMITAÇÕES HOSTINGER**:
- Não suporta Docker containers
- Suporta apenas: PHP, WordPress, HTML estático
- Node.js limitado (shared hosting)

**SOLUÇÃO**: Deploy híbrido Frontend (Hostinger) + Backend (VPS/Railway/Render)

### 4.2 Estratégia de Deploy

```
ARQUITETURA FINAL:
├── Frontend (React build) → Hostinger (HTML estático)
├── Backend (Express.js) → Railway/Render/DigitalOcean
├── Redis → Redis Cloud (gratuito)
├── Chatwoot → Chatwoot Cloud ou VPS separado
```

## ETAPA 5: Execução Local (TESTE PRIMEIRO)

### 5.1 Comandos de Teste Local
```bash
# 1. Criar containers separados
docker build -f Dockerfile.frontend -t humantic-frontend .
docker build -f Dockerfile.backend -t humantic-backend .

# 2. Testar stack completo
docker-compose -f docker-compose-local.yml up -d

# 3. Verificar funcionamento
curl http://localhost/api/health
curl http://localhost

# 4. Verificar integração Chatwoot
curl http://localhost:3001
```

### 5.2 Troubleshooting Local
```bash
# Logs específicos
docker logs humantic-backend
docker logs humantic-chatwoot-app
docker logs humantic-redis

# Network connectivity
docker exec humantic-backend ping redis
docker exec humantic-backend ping chatwoot-app
```

## ETAPA 6: Deploy para Produção

### 6.1 Frontend → Hostinger
```bash
# 1. Build frontend
npm run build:client

# 2. Upload via FTP/cPanel
# Subir conteúdo de dist/public/ para public_html/

# 3. Configurar .htaccess (SPA routing)
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

### 6.2 Backend → Railway/Render
```bash
# Railway
railway login
railway new humantic-backend
railway add
railway deploy

# Render
# Git push para repositório
# Conectar no Render Dashboard
# Auto-deploy configurado
```

### 6.3 Redis → Redis Cloud
```bash
# Criar conta Redis Cloud (gratuito)
# Configurar REDIS_URL no backend
REDIS_URL=redis://:[password]@[host]:[port]
```

## ETAPA 7: Configuração de URLs

### 7.1 Frontend (Hostinger)
```javascript
// client/src/config/api.ts
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://humantic-backend.railway.app'
  : 'http://localhost:5000';
```

### 7.2 CORS Backend
```javascript
// server/index.ts
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://humantic.wm3digital.com.br',
    'https://www.humantic.wm3digital.com.br'
  ],
  credentials: true
}));
```

## ETAPA 8: Checklist Final

### 8.1 Verificações Obrigatórias
- [ ] Docker local funcionando (todos containers)
- [ ] Chatwoot conectando com Redis
- [ ] Frontend comunicando com Backend
- [ ] APIs funcionando (auth, MCP, Stripe)
- [ ] Integração Chatwoot operacional

### 8.2 Deploy Hostinger
- [ ] Build frontend gerado
- [ ] Upload para Hostinger concluído
- [ ] .htaccess configurado
- [ ] URLs de API apontando para produção

### 8.3 Deploy Backend
- [ ] Backend deployado em Railway/Render
- [ ] Redis Cloud configurado
- [ ] Variáveis de ambiente setadas
- [ ] Health check funcionando

## PRÓXIMOS PASSOS IMEDIATOS

1. **CORRIGIR docker-compose agora**
2. **CRIAR Dockerfiles separados**
3. **TESTAR localmente**
4. **DEFINIR estratégia de backend** (Railway, Render, ou VPS)
5. **EXECUTAR deploy**

Quer que eu comece corrigindo o docker-compose-complete.yml agora?