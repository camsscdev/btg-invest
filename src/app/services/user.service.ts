import { inject, Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiUrl = environment.apiUrl;

  private _http = inject(HttpClient);

  get() {
    return this._http.get<User>(`${this.apiUrl}/users/1`);
  }

  update(user: Partial<User>) {
    return this._http.patch<User>(`${this.apiUrl}/users/1`, user);
  }
}
