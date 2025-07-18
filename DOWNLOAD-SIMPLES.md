# DOWNLOAD SIMPLES DOS ARQUIVOS

Execute estes comandos no seu diretório `humantics-automation`:

## 1. Baixar docker-compose.yml
```bash
curl -o docker-compose.yml "https://1f35dcaf-7e96-4df7-b402-2f3030c64013-00-3p314y6gwn25r.worf.replit.dev/docker-compose.yml"
```

## 2. Baixar Dockerfile.venom
```bash
curl -o Dockerfile.venom "https://1f35dcaf-7e96-4df7-b402-2f3030c64013-00-3p314y6gwn25r.worf.replit.dev/Dockerfile.venom"
```

## 3. Baixar package.json
```bash
curl -o package.json "https://1f35dcaf-7e96-4df7-b402-2f3030c64013-00-3p314y6gwn25r.worf.replit.dev/package-venom.json"
```

## 4. Baixar venom-bot-server.js
```bash
curl -o venom-bot-server.js "https://1f35dcaf-7e96-4df7-b402-2f3030c64013-00-3p314y6gwn25r.worf.replit.dev/venom-bot-server.js"
```

## 5. Verificar arquivos
```bash
ls -la
```

## 6. Iniciar sistema
```bash
./bin/docker-compose up -d
```

## 7. Ver QR Code do WhatsApp
```bash
./bin/docker-compose logs -f venom-bot
```

## URLs diretas:
- N8N: http://localhost:5678
- Venom-Bot Status: http://localhost:3000/status

## Se curl não funcionar:
Baixe manualmente no browser:
- docker-compose.yml: https://1f35dcaf-7e96-4df7-b402-2f3030c64013-00-3p314y6gwn25r.worf.replit.dev/docker-compose.yml
- Dockerfile.venom: https://1f35dcaf-7e96-4df7-b402-2f3030c64013-00-3p314y6gwn25r.worf.replit.dev/Dockerfile.venom
- package.json: https://1f35dcaf-7e96-4df7-b402-2f3030c64013-00-3p314y6gwn25r.worf.replit.dev/package-venom.json
- venom-bot-server.js: https://1f35dcaf-7e96-4df7-b402-2f3030c64013-00-3p314y6gwn25r.worf.replit.dev/venom-bot-server.js