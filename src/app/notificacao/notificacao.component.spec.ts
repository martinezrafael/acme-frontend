import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NotificacaoComponent } from './notificacao.component';
import { NotificacaoService } from './notificacao.service';
import { SocketService } from '../core/socket.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('NotificacaoComponent', () => {
  let component: NotificacaoComponent;
  let fixture: ComponentFixture<NotificacaoComponent>;
  let svc: NotificacaoService;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Standalone components entram em "imports"
      imports: [NotificacaoComponent, HttpClientTestingModule],
      // Socket padrão NÃO deve emitir nada no primeiro teste
      providers: [NotificacaoService, { provide: SocketService, useValue: { on: () => of() } }],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificacaoComponent);
    component = fixture.componentInstance;
    svc = TestBed.inject(NotificacaoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // garante que não sobraram requests abertas
    httpMock.verify();
  });

  it('deve gerar mensagemId, enviar POST e adicionar notificação com status AGUARDANDO PROCESSAMENTO', fakeAsync(() => {
    const texto = 'Teste de notificação';
    component.conteudoMensagem = texto;

    const spy = spyOn(svc, 'enviarNotificacao').and.callThrough();

    // aciona o fluxo
    component.enviar();

    // captura a ÚNICA requisição esperada
    const req = httpMock.expectOne('/api/notificar');
    expect(req.request.method).toBe('POST');
    // devolve resposta simulada (ajuste o payload conforme seu serviço espera)
    req.flush({ ok: true, mensagemId: 'abc-123' });

    // avança o loop de tarefas micro/macro caso o componente use RxJS/Promises
    tick();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith(texto);

    const itens = component.itens();
    expect(itens.length).toBe(1);
    expect(itens[0].conteudoMensagem).toBe(texto);
    expect(itens[0].status).toBe('AGUARDANDO PROCESSAMENTO');
    expect(itens[0].mensagemId).toBeTruthy();

    // certifica que NÃO houve posts extras
    httpMock.expectNone('/api/notificar');
  }));

  it('deve atualizar o status da notificação via polling/socket', fakeAsync(() => {
    // item inicial
    const item = {
      mensagemId: 'abc123',
      conteudoMensagem: 'Teste',
      status: 'AGUARDANDO PROCESSAMENTO' as const,
      statusCode: 0,
    };
    component.itens.update(() => [item]);

    // simula evento do socket (override do provider)
    const socket = TestBed.inject(SocketService);
    spyOn(socket, 'on').and.returnValue(
      of({ mensagemId: 'abc123', status: 'PROCESSADO_SUCESSO' as const, statusCode: 200 })
    );

    component.ngOnInit();
    tick();
    fixture.detectChanges();

    const itens = component.itens();
    expect(itens[0].status).toBe('PROCESSADO_SUCESSO');
    expect(itens[0].statusCode).toBe(200);
  }));
});
