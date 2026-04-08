import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HistorialComponent } from './historial';
import { UserService } from '../../services/user.service';
import { TransactionService } from '../../services/transaction.service';
import { FoundsService } from '../../services/founds.service';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import TEXTS from '../../data/texts.json';

describe('HistorialComponent', () => {
  let component: HistorialComponent;
  let fixture: ComponentFixture<HistorialComponent>;
  let userService: UserService;
  let transactionService: TransactionService;
  let foundsService: FoundsService;
  let messageService: MessageService;

  const mockUser = { id: 1, name: 'Camilo', balance: 500000 };
  const mockFunds = [
    { id: '1', name: 'FPV_BTG_PACTUAL_RECAUDADORA', minimumAmount: 75000, returnRate: 3.2, type: 'FPV' as const, description: 'Desc', amount: 0 },
    { id: '3', name: 'DEUDAPRIVADA', minimumAmount: 50000, returnRate: 2.8, type: 'FIC' as const, description: 'Desc', amount: 0 },
  ];
  const mockSubscriptions = [
    { id: 'sub1', userId: 1, fundId: '1', amount: 80000, date: '2026-04-08T12:00:00Z' },
  ];
  const mockTransactions = [
    { id: 'tx1', userId: 1, operationType: 'subscription' as const, fundId: '1', amount: 80000, date: '2026-04-08T12:00:00Z', status: 'confirmed' },
    { id: 'tx2', userId: 1, operationType: 'cancellation' as const, fundId: '3', amount: 50000, date: '2026-04-08T11:00:00Z', status: 'confirmed' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorialComponent],
      providers: [MessageService, provideHttpClient()],
    }).compileComponents();

    userService = TestBed.inject(UserService);
    transactionService = TestBed.inject(TransactionService);
    foundsService = TestBed.inject(FoundsService);
    messageService = TestBed.inject(MessageService);

    vi.spyOn(userService, 'get').mockReturnValue(of(mockUser as any));
    vi.spyOn(userService, 'update').mockReturnValue(of({ ...mockUser, balance: 580000 } as any));
    vi.spyOn(foundsService, 'get').mockReturnValue(of(mockFunds));
    vi.spyOn(transactionService, 'getSubscriptions').mockReturnValue(of(mockSubscriptions));
    vi.spyOn(transactionService, 'getTransactions').mockReturnValue(of(mockTransactions));
    vi.spyOn(transactionService, 'deleteSubscription').mockReturnValue(of({} as any));
    vi.spyOn(transactionService, 'addTransaction').mockReturnValue(of({} as any));

    fixture = TestBed.createComponent(HistorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user data on init', () => {
    expect(component.user()).toBeTruthy();
    expect(component.user()!.balance).toBe(500000);
  });

  it('should load subscriptions on init', () => {
    expect(component.subscriptions().length).toBe(1);
  });

  it('should enrich subscriptions with fund data', () => {
    const sub = component.subscriptions()[0];
    expect(sub.fund).toBeDefined();
    expect(sub.fund!.name).toBe('FPV_BTG_PACTUAL_RECAUDADORA');
  });

  it('should load transactions sorted by date descending', () => {
    expect(component.transactions().length).toBe(2);
    const dates = component.transactions().map(t => new Date(t.date).getTime());
    expect(dates[0]).toBeGreaterThanOrEqual(dates[1]);
  });

  it('should enrich transactions with fund data', () => {
    const tx = component.transactions().find(t => t.fundId === '1');
    expect(tx?.fund).toBeDefined();
    expect(tx?.fund?.name).toBe('FPV_BTG_PACTUAL_RECAUDADORA');
  });

  it('should not cancel if subscription has no id', () => {
    const sub = { userId: 1, fundId: '1', amount: 80000, date: '2026-04-08' };
    component.cancelFund(sub);
    expect(transactionService.deleteSubscription).not.toHaveBeenCalled();
  });

  it('should cancel fund and update balance', () => {
    const msgSpy = vi.spyOn(messageService, 'add');
    const sub = mockSubscriptions[0];
    component.cancelFund(sub);

    expect(transactionService.deleteSubscription).toHaveBeenCalledWith('sub1');
    expect(userService.update).toHaveBeenCalledWith({ balance: 580000 });
    expect(transactionService.addTransaction).toHaveBeenCalledWith(
      expect.objectContaining({
        operationType: 'cancellation',
        fundId: '1',
        amount: 80000,
      })
    );
    expect(msgSpy).toHaveBeenCalledWith(
      expect.objectContaining({ severity: 'success', summary: TEXTS.alerts.fundCancelled })
    );
  });

  it('should have texts loaded from JSON', () => {
    expect(component.texts).toBeDefined();
    expect(component.texts.historial).toBeDefined();
  });
});
