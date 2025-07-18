# Como Baixar o Código do Replit

## MÉTODO 1: Usando Git (Recomendado)

No Replit, abra o Shell (aba Console) e execute:

```bash
# Ver URL do repositório
git remote -v

# Ou criar um novo repositório GitHub
git remote add origin https://github.com/duhenri415/humantics.git
git add .
git commit -m "Deploy Docker"
git push -u origin main
```

Depois clone no seu computador:
```bash
git clone https://github.com/duhenri415/humantics.git
```

## MÉTODO 2: Download Manual dos Arquivos Principais

Crie uma pasta no seu computador e copie manualmente:

### Arquivos essenciais para Docker:
1. `Dockerfile.frontend`
2. `Dockerfile.backend`
3. `package.json`
4. `package-lock.json`
5. `tsconfig.json`
6. `vite.config.ts`
7. `tailwind.config.ts`
8. `drizzle.config.ts`
9. `.env.example` (se existir)

### Pastas completas:
- `/client` (toda a pasta)
- `/server` (toda a pasta)
- `/shared` (toda a pasta)

## MÉTODO 3: Usando ZIP via Terminal Replit

No Shell do Replit:

```bash
# Criar ZIP com todo o projeto
zip -r humantics.zip . -x "node_modules/*" -x ".git/*" -x "dist/*"

# Ver tamanho do arquivo
ls -lh humantics.zip

# Baixar via link temporário (se disponível)
# Ou copiar para um serviço de upload
```

## MÉTODO 4: Sincronizar com GitHub

1. No Replit, clique no ícone de Git (lado esquerdo)
2. Conecte com GitHub
3. Faça commit e push
4. Clone no seu computador

## ESTRUTURA MÍNIMA NECESSÁRIA

```
humantics/
├── client/
│   ├── src/
│   └── index.html
├── server/
│   ├── index.ts
│   └── (outros arquivos)
├── shared/
├── Dockerfile.frontend
├── Dockerfile.backend
├── package.json
├── package-lock.json
└── tsconfig.json
```

## DEPOIS DE BAIXAR

No seu computador, na pasta do projeto:

```bash
# 1. Instalar dependências (opcional, mas recomendado)
npm install

# 2. Login Docker
docker login
# Username: duhenri415

# 3. Build
docker build -f Dockerfile.frontend -t duhenri415/humantics-frontend:latest .
docker build -f Dockerfile.backend -t duhenri415/humantics-backend:latest .

# 4. Push
docker push duhenri415/humantics-frontend:latest
docker push duhenri415/humantics-backend:latest
```

Use o método que for mais fácil para você!