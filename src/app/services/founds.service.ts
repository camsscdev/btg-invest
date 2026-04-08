import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environment/environment';
import { Funds } from '../models/found';

@Injectable({
  providedIn: 'root',
})
export class FoundsService {
  private readonly apiUrl = environment.apiUrl;
  public selectedTypes = signal<string[]>([]);

  private _http = inject(HttpClient);

  get() {
    return this._http.get<Funds[]>(`${this.apiUrl}/funds`);
  }

  subscribeFund(fondoId: number, monto: number) {
    return this._http.post(`${this.apiUrl}/suscripciones`, {
      fondoId,
      monto,
      fecha: new Date(),
    });
  }

  cancelSuscription(id: number) {
    return this._http.delete(`${this.apiUrl}/suscripciones/${id}`);
  }

  getTransacciones() {
    return this._http.get<any[]>(`${this.apiUrl}/transacciones`);
  }
}
