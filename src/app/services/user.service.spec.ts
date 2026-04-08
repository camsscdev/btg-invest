import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { UserService } from './user.service';
import { environment } from '../../environment/environment';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch user via GET', () => {
    const mockUser = { id: 1, name: 'Camilo', balance: 500000 };

    service.get().subscribe(user => {
      expect(user.name).toBe('Camilo');
      expect(user.balance).toBe(500000);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/users/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should update user via PATCH', () => {
    const updatedData = { balance: 420000 };
    const mockResponse = { id: 1, name: 'Camilo', balance: 420000 };

    service.update(updatedData).subscribe(user => {
      expect(user.balance).toBe(420000);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/users/1`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(updatedData);
    req.flush(mockResponse);
  });
});
