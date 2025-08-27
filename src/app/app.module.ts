import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { App } from './app';

import { NotificacaoComponent } from './notificacao/notificacao.component';

@NgModule({
  declarations: [],
  imports: [BrowserModule, CommonModule, FormsModule, App, NotificacaoComponent],
  bootstrap: [App],
})
export class AppModule {}
