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
    const mensagemId = uuidv4();

    const payload: NotificarRequest = {
      mensagemId,
      conteudoMensagem,
    };

    const resp = await firstValueFrom(
      this.http.post<void>('/api/notificar', payload, { observe: 'response' })
    );

    if (resp.status !== 202) {
      console.warn('Status inesperado do backend:', resp.status);
    }

    return { mensagemId };
  }
}
