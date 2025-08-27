# Acme Frontend

Frontend em **Angular 20** responsável por gerenciar e exibir notificações em tempo real, integrando-se a um backend via **HTTP** e **WebSockets (Socket.IO)**.

## 🚀 Funcionalidades

- Envio de notificações para o backend.
- Exibição em tabela do status de processamento (aguardando, sucesso, falha).
- Atualização em tempo real via WebSockets.
- Testes automatizados com Jasmine e Karma.

## 📦 Pré-requisitos

- Node.js >= 18
- Angular CLI >= 20
- Backend rodando em `http://localhost:3000` (ajustável em `src/environments`).

## ▶️ Executando o projeto

```bash
# instalar dependências
npm install

# rodar em modo desenvolvimento
npm start

# rodar testes
npm test

# build de produção
npm run build
```
