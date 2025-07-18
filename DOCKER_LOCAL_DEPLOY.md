# Deploy Local com Docker Desktop (Sem Docker Hub)

## OPÇÃO 1: Deploy Local Direto (Sem Docker Hub)

### Passo 1: Build Local
```bash
# No terminal do Replit ou local onde está o código:

# Build Frontend localmente
docker build -f Dockerfile.frontend -t humantics-frontend:local .

# Build Backend localmente
docker build -f Dockerfile.backend -t humantics-backend:local .
```

### Passo 2: Criar docker-compose local
Crie arquivo `docker-compose-local.yml`:

```yaml
version: '3.8'

services:
  # Backend (conecta no Redis que você já tem rodando)
  humantic-backend:
    image: humantics-backend:local  # Imagem local, sem Docker Hub
    container_name: humantic-backend
    ports:
      - "5000:5000"
    environment:
      - REDIS_URL=redis://host.docker.internal:6379
      - RESEND_API_KEY=re_123456789  # Coloque suas chaves reais
      - STRIPE_SECRET_KEY=sk_test_123
      - SESSION_SECRET=secret123temp
      - NODE_ENV=production
    extra_hosts:
      - "host.docker.internal:host-gateway"

  # Frontend
  humantic-frontend:
    image: humantics-frontend:local  # Imagem local
    container_name: humantic-frontend
    ports:
      - "8080:80"
    depends_on:
      - humantic-backend
```

### Passo 3: Rodar
```bash
# Rodar os containers
docker-compose -f docker-compose-local.yml up -d

# Ver se está rodando
docker ps

# Acessar:
# Frontend: http://localhost:8080
# Backend: http://localhost:5000
```

## OPÇÃO 2: Criar Conta Docker Hub Gratuita (Recomendado)

### Por que criar conta?
- **Grátis** para repositórios públicos
- Permite deploy em qualquer servidor
- Backup das suas imagens
- Facilita colaboração

### Como criar:
1. Acesse https://hub.docker.com/signup
2. Preencha:
   - Username: escolha algo como `duhenri9` ou `henrique2025`
   - Email: seu email
   - Password: senha segura
3. Confirme email
4. Pronto!

### Depois de criar a conta:
```bash
# Login no Docker
docker login
# Digite username e senha

# Agora sim, use os comandos com seu username:
docker build -f Dockerfile.frontend -t SEU_USERNAME/humantics-frontend:latest .
docker push SEU_USERNAME/humantics-frontend:latest
```

## OPÇÃO 3: Salvar Imagens como Arquivos (Deploy Manual)

```bash
# Salvar imagens como arquivos .tar
docker save humantics-frontend:local > frontend.tar
docker save humantics-backend:local > backend.tar

# No servidor de destino, carregar:
docker load < frontend.tar
docker load < backend.tar
```

## Qual opção prefere?

1. **Deploy local apenas** (mais simples, só localhost)
2. **Criar conta Docker Hub** (recomendado para produção)
3. **Salvar como arquivo** (para transferir manualmente)

Me diga qual prefere e te ajudo com os próximos passos!