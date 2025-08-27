# Visão Geral

O **Acme Frontend** é um projeto em **Angular 20** que atua como interface do usuário para envio e acompanhamento de notificações processadas pelo backend.

Principais características:

- Utiliza **Angular standalone components** (sem módulos).
- Comunicação **HTTP REST** para envio de notificações.
- **WebSockets (Socket.IO)** para atualização de status em tempo real.
- Arquitetura organizada em **camadas de serviços e componentes**.
- Ambientes configuráveis (`src/environments`).

Fluxo resumido:

1. Usuário envia uma notificação pelo formulário.
2. O frontend gera um `mensagemId` (UUID) e envia ao backend.
3. O backend processa a notificação e emite eventos de status.
4. O frontend atualiza automaticamente a tabela de notificações.
