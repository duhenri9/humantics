# Guia Final de Deployment: HumanTic + Docker + Hostinger

## ✅ O que foi implementado

### 1. Correções Docker
- **docker-compose-complete.yml**: Corrigido `chatwoot-web` → `chatwoot-app`
- **docker-compose-separated.yml**: Nova configuração com containers separados
- **Dockerfile.frontend**: Container dedicado para React + Nginx
- **Dockerfile.backend**: Container dedicado para Express.js API
- **nginx-proxy.conf**: Load balancer e reverse proxy

### 2. Integração BotSailor
- **Estratégia Admin-First**: Admin cria clientes manualmente
- **Chatwoot como Hub**: ID central para todas integrações
- **Limite 15 usuários**: Controle manual via admin
- **BOTSAILOR_INTEGRATION_GUIDE.md**: Documentação completa

### 3. Scripts e Ferramentas
- **deploy-docker-separated.sh**: Script interativo para deploy
- **client/src/config/api.ts**: Configuração de API para produção

## 🚀 Como fazer o deployment

### PASSO 1: Teste Local com Docker

```bash
# 1. Dar permissão ao script
chmod +x deploy-docker-separated.sh

# 2. Executar deploy completo
./deploy-docker-separated.sh
# Escolher opção 7 (Deploy completo)

# 3. Verificar se tudo está funcionando
docker-compose -f docker-compose-separated.yml ps
```

### PASSO 2: Preparar para Produção

#### 2.1 Atualizar URLs de produção
Editar `client/src/config/api.ts`:
```javascript
export const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === 'production' 
    ? 'https://seu-backend.railway.app' // Sua URL real aqui
    : 'http://localhost:5000');
```

#### 2.2 Criar arquivo .env
```bash
cp .env.docker .env
# Editar com suas credenciais reais
```

### PASSO 3: Deploy Frontend (Hostinger)

```bash
# 1. Build do frontend
npm run build:client

# 2. Acessar cPanel Hostinger
# 3. Upload conteúdo de dist/public/ para public_html/
# 4. Criar .htaccess em public_html/:
```

Conteúdo do `.htaccess`:
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

### PASSO 4: Deploy Backend (Railway/Render)

#### Opção A: Railway
```bash
# 1. Instalar Railway CLI
npm install -g @railway/cli

# 2. Login e criar projeto
railway login
railway init

# 3. Configurar variáveis
railway variables set REDIS_URL=redis://...
railway variables set RESEND_API_KEY=...
# etc...

# 4. Deploy
railway up
```

#### Opção B: Render
1. Push código para GitHub
2. Conectar repositório no Render
3. Configurar variáveis de ambiente
4. Deploy automático

### PASSO 5: Configurar Redis Cloud

1. Criar conta em https://redis.com/try-free/
2. Criar database gratuito
3. Copiar connection string
4. Atualizar REDIS_URL no backend

### PASSO 6: Configurar Chatwoot

#### Opção A: Chatwoot Cloud
1. Criar conta em https://www.chatwoot.com/
2. Obter API token
3. Configurar webhook

#### Opção B: Self-hosted
Usar o Docker compose fornecido

## 📊 Verificação Final

### Checklist de Deploy
- [ ] Frontend acessível em humantic.wm3digital.com.br
- [ ] Backend respondendo em /api/health
- [ ] Redis conectado e funcionando
- [ ] Chatwoot recebendo leads
- [ ] Login/autenticação funcionando
- [ ] Pagamentos Stripe operacionais

### URLs Finais
```
Frontend: https://humantic.wm3digital.com.br
Backend: https://humantic-api.railway.app
Redis: redis://seu-redis.redislabs.com:12345
Chatwoot: https://app.chatwoot.com
```

## 🔧 Troubleshooting

### Frontend não carrega
- Verificar .htaccess
- Confirmar build completo
- Checar console do browser

### API não responde
- Verificar CORS no backend
- Confirmar variáveis de ambiente
- Checar logs do Railway/Render

### Redis não conecta
- Verificar connection string
- Confirmar firewall/whitelist
- Testar com redis-cli

## 🎯 Próximos Passos

1. **Testar fluxo completo** de criação de cliente
2. **Configurar BotSailor** para primeiro cliente
3. **Monitorar logs** e performance
4. **Criar backups** automáticos

Sistema pronto para produção!