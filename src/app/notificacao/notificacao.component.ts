import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NotificacaoService } from './notificacao.service';
import { SocketService } from '../core/socket.service';

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
  private sub?: { unsubscribe: () => void };

  constructor(private svc: NotificacaoService, private socket: SocketService) {}

  async enviar() {
    const texto = this.conteudoMensagem?.trim();
    if (!texto) return;

    const { mensagemId } = await this.svc.enviarNotificacao(texto);

    this.itens.update((arr) => [
      { mensagemId, conteudoMensagem: texto, status: 'AGUARDANDO PROCESSAMENTO', statusCode: 0 },
      ...arr,
    ]);
    this.conteudoMensagem = '';
  }

  ngOnInit(): void {
    this.sub = this.socket
      .on<{ mensagemId: string; status: ItemStatus; statusCode?: number }>('statusAtualizado')
      .subscribe((data) => {
        this.itens.update((arr) =>
          arr.map((item) =>
            item.mensagemId === data.mensagemId
              ? { ...item, status: data.status, statusCode: data.statusCode ?? item.statusCode }
              : item
          )
        );
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
