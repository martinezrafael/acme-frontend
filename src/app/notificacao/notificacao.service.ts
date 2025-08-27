// notificacao.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

export interface NotificarRequest {
  mensagemId: string;
  conteudoMensagem: string;
}

@Injectable({ providedIn: 'root' })
export class NotificacaoService {
  private http = inject(HttpClient);

  async enviarNotificacao(conteudoMensagem: string): Promise<{ mensagemId: string }> {
    // Gera o ID no frontend
    const mensagemId = uuidv4();

    const payload: NotificarRequest = {
      mensagemId,
      conteudoMensagem,
    };

    // POST para /api/notificar — o baseUrl é prefixado pelo interceptor
    const resp = await firstValueFrom(
      this.http.post<void>('/api/notificar', payload, { observe: 'response' })
    );

    // Esperado: 202 Accepted
    if (resp.status !== 202) {
      // Opcional: trate como quiser (toast, erro, etc.)
      console.warn('Status inesperado do backend:', resp.status);
    }

    return { mensagemId };
  }
}
