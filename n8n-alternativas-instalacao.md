# Instalação N8N - Alternativas sem Docker

## OPÇÃO 1: Instalar Docker (Recomendado)

### Para Ubuntu/Debian:
```bash
# Atualizar pacotes
sudo apt update

# Instalar Docker
sudo apt install docker.io

# Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER

# Reiniciar sessão ou executar:
newgrp docker

# Testar Docker
docker --version
```

### Para macOS:
```bash
# Com Homebrew
brew install --cask docker

# Ou baixar Docker Desktop: https://www.docker.com/products/docker-desktop
```

### Para Windows:
- Baixar Docker Desktop: https://www.docker.com/products/docker-desktop

## OPÇÃO 2: N8N via NPM (Sem Docker)

### Instalar N8N globalmente:
```bash
# Instalar Node.js (se não tiver)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar N8N
npm install n8n -g

# Executar N8N
n8n start
```

### Acessar:
- URL: `http://localhost:5678`
- **URL para HumanTic:** `http://localhost:5000/api/mcp/agent/mcp_personalizado_1751833568572/message`

## OPÇÃO 3: N8N Cloud (Online)

### Vantagens:
✅ Sem instalação
✅ Interface completa
✅ Backup automático

### Desvantagens:
❌ Precisa túnel para conectar HumanTic

### Acesso:
1. Vá para: `https://app.n8n.cloud`
2. Crie conta gratuita
3. Para conectar HumanTic, precisa expor porta:

```bash
# Instalar localtunnel (alternativa gratuita ao ngrok)
npm install -g localtunnel

# Expor porta 5000
lt --port 5000
```

## OPÇÃO 4: Alternativa Manual (Sem N8N)

Se quiser testar diretamente:

### Webhook Simples:
```bash
# Testar diretamente o agente HumanTic
curl -X POST http://localhost:5000/api/mcp/agent/mcp_personalizado_1751833568572/message \
  -H "Content-Type: application/json" \
  -d '{"message": "Quais são os planos da HumanTic?"}'
```

### Integração WhatsApp Manual:
Use a interface `/whatsapp-atendimento` que já existe no sistema HumanTic.

## RECOMENDAÇÃO

### Para desenvolvimento e teste:
**Use OPÇÃO 2 (NPM)** - mais simples e funciona perfeitamente

### Para produção:
**Use OPÇÃO 1 (Docker)** - mais estável e isolado

### Comandos para OPÇÃO 2:
```bash
# 1. Instalar N8N
npm install n8n -g

# 2. Executar N8N
n8n start

# 3. Acessar http://localhost:5678

# 4. Configurar workflow com URL:
# http://localhost:5000/api/mcp/agent/mcp_personalizado_1751833568572/message
```

## Qual opção você prefere?

1. **Instalar Docker** (mais robusto)
2. **N8N via NPM** (mais rápido)
3. **N8N Cloud** (sem instalação)
4. **Teste manual** (sem N8N)