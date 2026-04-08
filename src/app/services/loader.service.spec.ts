import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { LoaderService } from './loader.service';

describe('LoaderService', () => {
  let service: LoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not be loading initially', () => {
    expect(service.isLoading()).toBe(false);
  });

  it('should set loading to true on show()', () => {
    service.show();
    expect(service.isLoading()).toBe(true);
  });

  it('should set loading to false on hide() after single show()', () => {
    service.show();
    service.hide();
    expect(service.isLoading()).toBe(false);
  });

  it('should keep loading true when multiple show() before hide()', () => {
    service.show();
    service.show();
    service.hide();
    expect(service.isLoading()).toBe(true);
  });

  it('should set loading to false when all requests complete', () => {
    service.show();
    service.show();
    service.show();
    service.hide();
    service.hide();
    service.hide();
    expect(service.isLoading()).toBe(false);
  });

  it('should not go below zero request count', () => {
    service.hide();
    service.hide();
    expect(service.isLoading()).toBe(false);
    service.show();
    expect(service.isLoading()).toBe(true);
    service.hide();
    expect(service.isLoading()).toBe(false);
  });
});
