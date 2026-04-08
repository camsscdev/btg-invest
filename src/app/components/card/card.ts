import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Funds } from '../../models/found';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { OnlyNumbersDirective } from '../../directives/only-number.directive';

@Component({
  selector: 'app-card',
  imports: [CommonModule, FormsModule, ToastModule, OnlyNumbersDirective],
  templateUrl: './card.html',
  styleUrls: ['./card.scss'],
  providers: [MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Card {
  public founds = input.required<Funds[]>();
  public balance = input.required<number>();
  amount!: number;

  private messageService = inject(MessageService);

  subscribeFound() {
    debugger;

    const balanceValue = this.balance();

    if (this.amount > balanceValue)
      this.messageService.add({
        severity: 'error',
        summary: 'Saldo insuficiente',
        detail: 'Los fondos en tu cuenta son menores a el monto requerido',
      });
  }
}
