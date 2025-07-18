# HumanTic - Padrões de Código

## Convenções de Nomenclatura

### Campos de Banco vs JavaScript/TypeScript

**REGRA FUNDAMENTAL: Sempre usar camelCase no código TypeScript, snake_case apenas no banco de dados**

#### Campo Nome Completo
- **Banco de dados**: `full_name` (coluna SQL)
- **Schema Drizzle**: `fullName: text("full_name")`
- **TypeScript/JavaScript**: `fullName` (sempre)
- **APIs**: `fullName` (request/response bodies)

#### Outros Campos Principais
- **Banco**: `created_at` → **Code**: `createdAt`
- **Banco**: `updated_at` → **Code**: `updatedAt`
- **Banco**: `user_id` → **Code**: `userId`
- **Banco**: `nome_completo` → **Code**: `nomeCompleto`

### Endpoints API

Todos os endpoints devem usar camelCase para nomes de campos:

```typescript
// ✅ CORRETO
POST /api/auth/register
{
  "fullName": "João Silva",
  "email": "joao@example.com"
}

// ❌ INCORRETO
POST /api/auth/register
{
  "full_name": "João Silva",
  "email": "joao@example.com"
}
```

### Validação de Schema

O Drizzle/Zod deve fazer a conversão automaticamente:

```typescript
// Schema definition
fullName: text("full_name") // DB usa full_name, code usa fullName

// Insert schema
export const insertUserSchema = createInsertSchema(users)
// Automaticamente converte fullName ↔ full_name
```

## Prevenção de Regressões

### Checklist para Mudanças de API

Antes de modificar qualquer endpoint:

1. ✅ Verificar se usa camelCase para todos os campos
2. ✅ Confirmar compatibilidade com schema Drizzle
3. ✅ Testar com dados reais
4. ✅ Atualizar documentação se necessário

### Campos Críticos para Monitoramento

- `fullName` - usado em emails e interface
- `nomeCompleto` - leads do formulário 7 dias
- Qualquer campo que afete personalização de emails

## Casos de Regressão Identificados

### Caso 1: fullName vs full_name (Julho 2025)
- **Problema**: Inconsistência entre endpoints de criação e atualização
- **Causa**: Endpoint PATCH usava `full_name`, POST usava `fullName`
- **Solução**: Padronizar todos os endpoints para `fullName`
- **Prevenção**: Este documento + testes automatizados

### Padrão de Correção

1. Identificar inconsistência
2. Padronizar para camelCase
3. Testar com dados reais
4. Documentar no CODING_STANDARDS.md
5. Atualizar replit.md com correção

## Responsabilidades

- **Developer**: Seguir padrões antes de implementar
- **Code Review**: Verificar convenções de nomenclatura
- **Testing**: Validar com dados reais antes de deploy