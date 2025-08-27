# Arquitetura

O projeto segue a arquitetura do **Angular moderno** com **standalone components** e serviços injetáveis.

## Camadas principais

- **App**  
  Ponto de entrada da aplicação, define rotas e configurações globais.

- **Core**  
  Serviços centrais e utilitários, como `SocketService`.

- **Notificação**  
  Componente principal para envio e exibição de notificações, incluindo:
  - `notificacao.component.ts` (UI + lógica de interação)
  - `notificacao.service.ts` (responsável por comunicação HTTP com o backend)

## Comunicação

- **HTTP REST**

  - Endpoint `/api/notificar` envia notificações ao backend.
  - Payload inclui `mensagemId` (UUID) e `conteudoMensagem`.

- **WebSockets**
  - Evento `statusAtualizado` retorna atualizações de status para notificações.
  - O serviço `SocketService` encapsula o cliente **socket.io**.

## Interceptadores HTTP

No arquivo `app.config.ts` existem interceptors que:

- Adicionam base URL automática.
- Configuram headers JSON.
- Tratam erros, timeouts e retries.

## Testes

- **Jasmine + Karma**
- Cobrem fluxo de envio e atualização de status.
- Mocks do `HttpClientTestingModule` e `SocketService`.

```

```
