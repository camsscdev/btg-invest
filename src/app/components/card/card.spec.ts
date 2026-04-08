import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Card } from './card';
import { MessageService } from 'primeng/api';
import { UserService } from '../../services/user.service';
import { TransactionService } from '../../services/transaction.service';
import { of } from 'rxjs';
import { Funds } from '../../models/found';
import { ComponentRef } from '@angular/core';
import TEXTS from '../../data/texts.json';

describe('Card', () => {
  let component: Card;
  let fixture: ComponentFixture<Card>;
  let componentRef: ComponentRef<Card>;
  let messageService: MessageService;
  let userService: UserService;
  let transactionService: TransactionService;

  const mockFunds: Funds[] = [
    { id: '1', name: 'FPV_BTG_PACTUAL_RECAUDADORA', minimumAmount: 75000, returnRate: 3.2, type: 'FPV', description: 'Fondo de pensiones voluntarias', amount: 0 },
    { id: '2', name: 'FPV_BTG_PACTUAL_ECOPETROL', minimumAmount: 125000, returnRate: 4.1, type: 'FPV', description: 'Fondo Ecopetrol', amount: 0 },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Card],
      providers: [
        MessageService,
        provideHttpClient(),
      ],
    }).overrideComponent(Card, {
      add: { providers: [{ provide: MessageService, useValue: TestBed.inject(MessageService) }] }
    }).compileComponents();

    fixture = TestBed.createComponent(Card);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    messageService = TestBed.inject(MessageService);
    userService = TestBed.inject(UserService);
    transactionService = TestBed.inject(TransactionService);

    componentRef.setInput('founds', mockFunds);
    componentRef.setInput('balance', 500000);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have texts loaded', () => {
    expect(component.texts).toBeDefined();
    expect(component.texts.card).toBeDefined();
  });

  it('should show error when amount is less than minimum', () => {
    const spy = vi.spyOn(messageService, 'add');
    const fund: Funds = { ...mockFunds[0], amount: 10000 };
    component.subscribeFound(fund);
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ severity: 'error', summary: TEXTS.alerts.invalidAmount })
    );
  });

  it('should show error when amount exceeds balance', () => {
    const spy = vi.spyOn(messageService, 'add');
    componentRef.setInput('balance', 50000);
    fixture.detectChanges();
    const fund: Funds = { ...mockFunds[0], amount: 100000 };
    component.subscribeFound(fund);
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ severity: 'error', summary: TEXTS.alerts.insufficientBalance })
    );
  });

  it('should call userService.update on valid subscription', () => {
    vi.spyOn(userService, 'update').mockReturnValue(of({ id: 1, balance: 420000 }));
    vi.spyOn(transactionService, 'addSubscription').mockReturnValue(of({} as any));
    vi.spyOn(transactionService, 'addTransaction').mockReturnValue(of({} as any));
    const msgSpy = vi.spyOn(messageService, 'add');

    const fund: Funds = { ...mockFunds[0], amount: 80000, notificationMethod: 'sms' };
    component.subscribeFound(fund);

    expect(userService.update).toHaveBeenCalledWith({ balance: 420000 });
    expect(transactionService.addSubscription).toHaveBeenCalled();
    expect(transactionService.addTransaction).toHaveBeenCalled();
    expect(msgSpy).toHaveBeenCalledWith(
      expect.objectContaining({ severity: 'success', summary: TEXTS.alerts.subscriptionSuccess })
    );
  });

  it('should use email as default notification method', () => {
    vi.spyOn(userService, 'update').mockReturnValue(of({ id: 1, balance: 420000 }));
    vi.spyOn(transactionService, 'addSubscription').mockReturnValue(of({} as any));
    vi.spyOn(transactionService, 'addTransaction').mockReturnValue(of({} as any));

    const fund: Funds = { ...mockFunds[0], amount: 80000 };
    delete (fund as any).notificationMethod;
    component.subscribeFound(fund);

    expect(transactionService.addSubscription).toHaveBeenCalledWith(
      expect.objectContaining({ notification: 'email' })
    );
  });

  it('should reset fund amount and notification after subscription', () => {
    vi.spyOn(userService, 'update').mockReturnValue(of({ id: 1, balance: 420000 }));
    vi.spyOn(transactionService, 'addSubscription').mockReturnValue(of({} as any));
    vi.spyOn(transactionService, 'addTransaction').mockReturnValue(of({} as any));

    const fund: Funds = { ...mockFunds[0], amount: 80000, notificationMethod: 'sms' };
    component.subscribeFound(fund);

    expect(fund.amount).toBe(0);
    expect(fund.notificationMethod).toBe('email');
  });

  it('should emit onBalanceUpdate after successful subscription', () => {
    vi.spyOn(userService, 'update').mockReturnValue(of({ id: 1, balance: 420000 }));
    vi.spyOn(transactionService, 'addSubscription').mockReturnValue(of({} as any));
    vi.spyOn(transactionService, 'addTransaction').mockReturnValue(of({} as any));

    let emitted = false;
    component.onBalanceUpdate.subscribe(() => emitted = true);

    const fund: Funds = { ...mockFunds[0], amount: 80000 };
    component.subscribeFound(fund);

    expect(emitted).toBe(true);
  });

  it('should not proceed if amount is 0', () => {
    const spy = vi.spyOn(messageService, 'add');
    const updateSpy = vi.spyOn(userService, 'update');
    const fund: Funds = { ...mockFunds[0], amount: 0 };
    component.subscribeFound(fund);
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ severity: 'error' })
    );
    expect(updateSpy).not.toHaveBeenCalled();
  });
});
