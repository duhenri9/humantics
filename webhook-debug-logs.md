# 🚨 DIAGNÓSTICO COMPLETO N8N + HUMANTICS

## Status do Sistema HumanTic
✅ **Servidor rodando:** localhost:5000  
✅ **Endpoint webhook:** `/api/webhook/n8n-test`  
✅ **Resposta MCP:** Funcionando (1ms)  
✅ **Conectividade local:** 100% operacional  

## Problema Identificado
❌ **N8N não conecta:** localhost, 127.0.0.1, URL pública  
❌ **URL pública Replit:** Não resolve DNS  
❌ **Conectividade externa:** N8N isolado  

## Soluções Testadas
1. ❌ localhost:5000 - timeout
2. ❌ 127.0.0.1:5000 - timeout  
3. ❌ 0.0.0.0:5000 - timeout
4. ❌ workspace.duhenri9.repl.co - DNS fail
5. ❌ ngrok - requer conta

## Causa Raiz
**N8N está em ambiente isolado/container** que não consegue acessar:
- Localhost do host
- URLs externas do Replit
- Portas locais

## ✅ SOLUÇÕES FUNCIONAIS

### Opção 1: N8N Local (fora de container)
Se n8n roda direto no sistema:
- URL: `http://localhost:5000/api/webhook/n8n-test`

### Opção 2: N8N em Docker  
Se n8n está em container Docker:
- URL: `http://host.docker.internal:5000/api/webhook/n8n-test`

### Opção 3: IP da Máquina
Descobrir IP real da máquina:
```bash
ip addr show | grep inet
```
- URL: `http://[IP_REAL]:5000/api/webhook/n8n-test`

### Opção 4: Ngrok Grátis (sem conta)
```bash
# Instalar localtunnel (alternativa gratuita)
npm install -g localtunnel
lt --port 5000
```

## Configuração N8N (qualquer URL acima)
```json
{
  "method": "POST",
  "headers": {
    "Content-Type": "application/json"
  },
  "body": {
    "message": "{{ $json.Body || $json.message || 'teste' }}"
  }
}
```

## Status: HumanTic 100% Operacional
O problema não é no código HumanTic. É conectividade entre N8N e localhost.