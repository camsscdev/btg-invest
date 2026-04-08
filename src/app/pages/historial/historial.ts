import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from "@angular/core";
import TEXTS from '../../data/texts.json';
import { CommonModule, CurrencyPipe, DatePipe } from "@angular/common";
import { UserService } from "../../services/user.service";
import { TransactionService } from "../../services/transaction.service";
import { FoundsService } from "../../services/founds.service";
import { User } from "../../models/user";
import { Subscription } from "../../models/subscription";
import { Transaction } from "../../models/transaction";
import { Funds } from "../../models/found";
import { MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";

@Component({
  selector: "app-historial",
  imports: [CommonModule, CurrencyPipe, DatePipe, ToastModule],
  templateUrl: "./historial.html",
  styleUrls: ["./historial.scss"],
  providers: [MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistorialComponent implements OnInit {
  private _userService = inject(UserService);
  private _transactionService = inject(TransactionService);
  private _foundsService = inject(FoundsService);
  private _messageService = inject(MessageService);
  texts = TEXTS;

  user = signal<User | null>(null);
  founds = signal<Funds[]>([]);
  subscriptions = signal<(Subscription & { fund?: Funds })[]>([]);
  transactions = signal<(Transaction & { fund?: Funds })[]>([]);

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this._userService.get().subscribe(u => {
      this.user.set(u);
      this._foundsService.get().subscribe(f => {
        this.founds.set(f);

        this._transactionService.getSubscriptions(Number(u.id)).subscribe(subs => {
          this.subscriptions.set(subs.map(s => ({ ...s, fund: f.find(x => x.id == s.fundId) })));
        });

        this._transactionService.getTransactions(Number(u.id)).subscribe(txns => {
          this.transactions.set(txns.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(t => ({ ...t, fund: f.find(x => x.id == t.fundId) })));
        });
      });
    });
  }

  cancelFund(sub: Subscription) {
    if (!sub.id) return;

    this._transactionService.deleteSubscription(sub.id).subscribe(() => {
      const currentUser = this.user();
      if (!currentUser || !currentUser.id) return;

      const newBalance = currentUser.balance + sub.amount;
      this._userService.update({ balance: newBalance }).subscribe({
        next: () => {
          this._transactionService
            .addTransaction({
              userId: Number(currentUser.id),
              operationType: "cancellation",
              fundId: sub.fundId,
              amount: sub.amount,
              date: new Date().toISOString(),
              status: "confirmed"
            })
            .subscribe(() => {
              this._messageService.add({ severity: "success", summary: TEXTS.alerts.fundCancelled, detail: `${TEXTS.alerts.returnedToBalance} ${sub.amount} ${TEXTS.alerts.toYourBalance}` });
              this.loadData();
            });
        }
      })
    });
  }
}
