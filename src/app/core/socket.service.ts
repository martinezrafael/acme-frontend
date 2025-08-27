import { Injectable, OnDestroy, inject } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SocketService implements OnDestroy {
  private socket: Socket;

  constructor() {
    this.socket = io(environment.socketUrl ?? environment.apiBaseUrl, {
      transports: ['websocket'],
    });
  }

  on<T>(event: string): Observable<T> {
    return new Observable<T>((subscriber) => {
      const handler = (data: T) => subscriber.next(data);
      this.socket.on(event, handler);
      return () => this.socket.off(event, handler);
    });
  }

  disconnect() {
    this.socket.disconnect();
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
