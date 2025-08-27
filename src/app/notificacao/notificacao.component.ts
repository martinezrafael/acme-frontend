import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NotificacaoService } from './notificacao.service';
import { io, Socket } from 'socket.io-client';

type ItemStatus = 'AGUARDANDO PROCESSAMENTO' | 'PROCESSADO_SUCESSO' | 'FALHA_PROCESSAMENTO';

interface ItemLista {
  mensagemId: string;
  conteudoMensagem: string;
  status: ItemStatus;
  statusCode: number;
}

@Component({
  selector: 'app-notificacao',
  standalone: true,
  templateUrl: './notificacao.component.html',
  imports: [FormsModule, CommonModule],
})
export class NotificacaoComponent implements OnInit, OnDestroy {
  conteudoMensagem = '';
  itens = signal<ItemLista[]>([]);
  private socket: Socket | undefined;

  constructor(private svc: NotificacaoService) {}

  async enviar() {
    if (!this.conteudoMensagem?.trim()) {
      alert('Conteúdo da mensagem é obrigatório.');
      return;
    }

    const { mensagemId } = await this.svc.enviarNotificacao(this.conteudoMensagem);

    // Adiciona item com status inicial
    this.itens.update((arr) => [
      {
        mensagemId,
        conteudoMensagem: this.conteudoMensagem,
        status: 'AGUARDANDO PROCESSAMENTO',
        statusCode: 0,
      },
      ...arr,
    ]);

    this.conteudoMensagem = '';
  }

  ngOnInit(): void {
    // Conecta ao WebSocket do backend
    this.socket = io('http://localhost:3000');
    this.socket.on(
      'statusAtualizado',
      (data: { mensagemId: string; status: ItemStatus; statusCode?: number }) => {
        // Atualiza o status e statusCode do item correspondente
        this.itens.update((arr) =>
          arr.map((item) =>
            item.mensagemId === data.mensagemId
              ? { ...item, status: data.status, statusCode: data.statusCode ?? item.statusCode }
              : item
          )
        );
      }
    );
  }

  ngOnDestroy(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
