import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { Transaction } from '../models/transaction';
import { Subscription } from '../models/subscription';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private readonly apiUrl = environment.apiUrl;
  private _http = inject(HttpClient);

  getSubscriptions(userId: number) {
    return this._http.get<Subscription[]>(`${this.apiUrl}/subscriptions?userId=${userId}`);
  }

  getTransactions(userId: number) {
    return this._http.get<Transaction[]>(`${this.apiUrl}/transactions?userId=${userId}`);
  }

  addSubscription(subscription: Subscription) {
    return this._http.post<Subscription>(`${this.apiUrl}/subscriptions`, subscription);
  }

  deleteSubscription(subscriptionId: string) {
    return this._http.delete(`${this.apiUrl}/subscriptions/${subscriptionId}`);
  }

  addTransaction(transaction: Transaction) {
    return this._http.post<Transaction>(`${this.apiUrl}/transactions`, transaction);
  }
}
