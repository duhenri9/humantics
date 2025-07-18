# Venom-Bot Setup - HumanTic

## Ativação Simples

**Venom-Bot é grátis, brasileiro e seguro:**
- Open source (+2000 ⭐ GitHub)
- Código auditável, dados locais
- WhatsApp Web oficial

## Ativação

**1. Adicionar variável:**
- Secrets: `VENOM_BOT_ENABLED=true`
- Reiniciar projeto

**2. QR Code:**
- Console mostra: "QR Code generated"
- Escanear com WhatsApp
- Aguardar: "Connected successfully"

**3. Verificar:**
- Endpoint: `/api/whatsapp/status`
- Status: `platform: "venom-bot"`

## Fluxo
1. Cliente → WhatsApp
2. Venom-Bot → HumanTic Agent
3. Resposta automática

## Logs
```
📱 QR Code generated     → Escanear
✅ Connected successfully → Funcionando
📱 Received message      → Mensagem
📤 Response sent         → Resposta
```

## Solução de Problemas
- QR não aparece: Restart projeto
- Não conecta: Fechar WhatsApp Web
- Sem mensagens: Verificar `/api/whatsapp/status`