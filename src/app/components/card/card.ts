import { CommonModule } from '@angular/common';
import TEXTS from '../../data/texts.json';
import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { concatMap } from 'rxjs';
import { Funds } from '../../models/found';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { OnlyNumbersDirective } from '../../directives/only-number.directive';
import { UserService } from '../../services/user.service';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-card',
  imports: [CommonModule, FormsModule, ToastModule, OnlyNumbersDirective],
  templateUrl: './card.html',
  styleUrls: ['./card.scss'],
  providers: [MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Card {
  texts = TEXTS;
  public founds = input.required<Funds[]>();
  public balance = input.required<number>();
  public onBalanceUpdate = output<void>();

  private messageService = inject(MessageService);
  private userService = inject(UserService);
  private transactionService = inject(TransactionService);

  subscribeFound(fund: Funds) {
    const amount = Number(fund.amount) || 0;
    const balanceValue = this.balance();

    if (amount < fund.minimumAmount) {
      this.messageService.add({ severity: 'error', summary: TEXTS.alerts.invalidAmount, detail: `${TEXTS.alerts.minAmountIs} ${fund.minimumAmount}` });
      return;
    }

    if (amount > balanceValue) {
      this.messageService.add({ severity: 'error', summary: TEXTS.alerts.insufficientBalance, detail: TEXTS.alerts.fundsLowerThanRequired });
      return;
    }

    const notification = fund.notificationMethod || 'email';

    const newBalance = balanceValue - amount;
    
    this.userService.update({ balance: newBalance }).pipe(
      concatMap(() => this.transactionService.addSubscription({
        userId: 1,
        fundId: fund.id,
        amount: amount,
        date: new Date().toISOString(),
        notification: notification
      })),
      concatMap(() => this.transactionService.addTransaction({
        userId: 1,
        operationType: 'subscription',
        fundId: fund.id,
        amount: amount,
        date: new Date().toISOString(),
        status: 'confirmed'
      }))
    ).subscribe(() => {
        this.messageService.add({ 
          severity: 'success', 
          summary: TEXTS.alerts.subscriptionSuccess, 
          detail: `${TEXTS.alerts.deducted} ${amount}. ${TEXTS.alerts.notificationVia} ${notification.toUpperCase()}` 
        });
        fund.amount = 0 as any;
        fund.notificationMethod = 'email';
        this.onBalanceUpdate.emit();
    });
  }
}
