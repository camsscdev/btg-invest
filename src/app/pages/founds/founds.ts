import { ChangeDetectionStrategy, Component, inject, OnInit, signal, computed } from '@angular/core';
import TEXTS from '../../data/texts.json';
import { FoundsService } from '../../services/founds.service';
import { Card } from '../../components/card/card';
import { Funds } from '../../models/found';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-founds',
  imports: [CurrencyPipe, Card, ToastModule],
  providers: [MessageService],
  templateUrl: './founds.html',
  styleUrls: ['./founds.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Founds implements OnInit {
  public allFounds = signal<Funds[]>([]);
  public founds = computed(() => {
    const types = this._foundService.selectedTypes();
    if (types.length === 0) return this.allFounds();
    return this.allFounds().filter(f => types.includes(f.type));
  });
  texts = TEXTS;
  readonly titleFounds = signal<string>(TEXTS.founds.title);
  private _foundService = inject(FoundsService);
  private _userService = inject(UserService);
  private _messageService = inject(MessageService);
  readonly user = signal<User | any>(null);

  ngOnInit(): void {
    this.getFounds();
    this.getUser();
  }

  getUser() {
    this._userService.get().subscribe({
      next: (user) => {
        this.user.set(user);
      },

      error: () => {
        this._messageService.add({ severity: "error", summary: TEXTS.alerts.errorService, detail: TEXTS.alerts.cannotGetFunds });
      },
    });
  }

  getFounds() {
    this._foundService.get().subscribe({
      next: (founds) => {
        this.allFounds.set(founds);
      },
      error: () => { this._messageService.add({ severity: "error", summary: TEXTS.alerts.errorService, detail: TEXTS.alerts.cannotGetFunds }); },
    });
  }
}
