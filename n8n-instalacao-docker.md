# Instalação N8N via Docker - Passo a Passo

## 1. Instalar N8N via Docker

### Comando simples (recomendado):
```bash
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

### O que este comando faz:
- `docker run`: Executa container
- `-it`: Modo interativo
- `--rm`: Remove container ao parar
- `--name n8n`: Nome do container
- `-p 5678:5678`: Mapeia porta (N8N roda na 5678)
- `-v ~/.n8n:/home/node/.n8n`: Salva dados localmente
- `n8nio/n8n`: Imagem oficial do N8N

## 2. Acessar N8N

Após executar o comando:
1. Aguarde download da imagem (primeira vez)
2. Acesse: `http://localhost:5678`
3. Crie conta inicial no N8N

## 3. Configurar Conectividade com HumanTic

No N8N, use esta URL:
```
http://host.docker.internal:5000/api/mcp/agent/mcp_personalizado_1751833568572/message
```

**Por que `host.docker.internal`?**
- Docker precisa desta URL especial para acessar localhost do host
- `localhost` dentro do container != `localhost` da sua máquina

## 4. Testar Conectividade

Primeiro teste no N8N:
1. Criar HTTP Request node
2. URL: `http://host.docker.internal:5000/api/mcp/agent/mcp_personalizado_1751833568572/message`
3. Method: POST
4. Body: `{"message": "teste"}`
5. Execute

## 5. Configuração Completa do Workflow

### Node 1: Webhook
- Método: POST
- Path: `humantic-support`

### Node 2: HTTP Request  
- URL: `http://host.docker.internal:5000/api/mcp/agent/mcp_personalizado_1751833568572/message`
- Method: POST
- Headers: `{"Content-Type": "application/json"}`
- Body: 
```json
{
  "message": "{{ $json.message }}",
  "user_id": "{{ $json.phone || 'whatsapp_user' }}",
  "context": {
    "source": "whatsapp_n8n",
    "phone": "{{ $json.phone }}",
    "name": "{{ $json.name }}"
  }
}
```

### Node 3: Response
- Response Code: 200
- Body: `{{ $('HTTP Request').item.json.response }}`

## 6. Comandos Úteis

### Parar N8N:
```bash
Ctrl + C
```

### Rodar N8N em background:
```bash
docker run -d \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

### Ver logs:
```bash
docker logs n8n
```

### Parar container background:
```bash
docker stop n8n
```

## 7. Vantagens desta Configuração

✅ **Conectividade garantida** com HumanTic
✅ **Interface completa** do N8N
✅ **Dados salvos** localmente  
✅ **Sem limitações** de conectividade
✅ **Grátis** e sem restrições

---

**Próximo passo:** Execute o comando Docker e acesse `http://localhost:5678`