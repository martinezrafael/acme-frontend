import { Routes } from '@angular/router';
import { NotificacaoComponent } from './notificacao/notificacao.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'notificacao' },
  { path: 'notificacao', component: NotificacaoComponent },
  { path: '**', redirectTo: 'notificacao' },
];
