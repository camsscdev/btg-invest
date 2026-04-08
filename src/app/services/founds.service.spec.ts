import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { FoundsService } from './founds.service';
import { environment } from '../../environment/environment';

describe('FoundsService', () => {
  let service: FoundsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(FoundsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have empty selectedTypes initially', () => {
    expect(service.selectedTypes()).toEqual([]);
  });

  it('should update selectedTypes', () => {
    service.selectedTypes.set(['FIC']);
    expect(service.selectedTypes()).toEqual(['FIC']);
  });

  it('should fetch funds via GET', () => {
    const mockFunds = [
      { id: '1', name: 'Fund1', minimumAmount: 75000, returnRate: 3.2, type: 'FPV', description: 'Desc', amount: 0 },
    ];

    service.get().subscribe(funds => {
      expect(funds.length).toBe(1);
      expect(funds[0].name).toBe('Fund1');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/funds`);
    expect(req.request.method).toBe('GET');
    req.flush(mockFunds);
  });

  it('should subscribe to fund via POST', () => {
    service.subscribeFund(1, 80000).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/suscripciones`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.fondoId).toBe(1);
    expect(req.request.body.monto).toBe(80000);
    req.flush({});
  });

  it('should cancel subscription via DELETE', () => {
    service.cancelSuscription(5).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/suscripciones/5`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
