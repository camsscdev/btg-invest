import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TransactionService } from './transaction.service';
import { environment } from '../../environment/environment';

describe('TransactionService', () => {
  let service: TransactionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TransactionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get subscriptions by userId', () => {
    const mockSubs = [
      { id: 's1', userId: 1, fundId: '1', amount: 80000, date: '2026-04-08' },
    ];

    service.getSubscriptions(1).subscribe(subs => {
      expect(subs.length).toBe(1);
      expect(subs[0].userId).toBe(1);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/subscriptions?userId=1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockSubs);
  });

  it('should get transactions by userId', () => {
    const mockTxns = [
      { id: 't1', userId: 1, operationType: 'subscription', fundId: '1', amount: 80000, date: '2026-04-08', status: 'confirmed' },
    ];

    service.getTransactions(1).subscribe(txns => {
      expect(txns.length).toBe(1);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/transactions?userId=1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTxns);
  });

  it('should add a subscription via POST', () => {
    const newSub = { userId: 1, fundId: '2', amount: 100000, date: '2026-04-08' };

    service.addSubscription(newSub).subscribe(result => {
      expect(result).toBeTruthy();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/subscriptions`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newSub);
    req.flush({ ...newSub, id: 's2' });
  });

  it('should delete a subscription via DELETE', () => {
    service.deleteSubscription('s1').subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/subscriptions/s1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should add a transaction via POST', () => {
    const newTxn = {
      userId: 1, operationType: 'subscription' as const,
      fundId: '1', amount: 80000, date: '2026-04-08', status: 'confirmed'
    };

    service.addTransaction(newTxn).subscribe(result => {
      expect(result).toBeTruthy();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/transactions`);
    expect(req.request.method).toBe('POST');
    req.flush({ ...newTxn, id: 't2' });
  });
});
