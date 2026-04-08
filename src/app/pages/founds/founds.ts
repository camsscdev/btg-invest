import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FoundsService } from '../../services/founds.service';
import { Card } from '../../components/card/card';
import { Funds } from '../../models/found';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-founds',
  imports: [CurrencyPipe, Card],
  templateUrl: './founds.html',
  styleUrls: ['./founds.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Founds implements OnInit {
  public founds = signal<Funds[]>([]);
  readonly titleFounds = signal<string>('zzzzz');
  private _foundService = inject(FoundsService);
  private _userService = inject(UserService);
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
    });
  }

  getFounds() {
    this._foundService.get().subscribe({
      next: (founds) => {
        this.founds.set(founds);
      },
      error: () => {},
      complete: () => {},
    });
  }
}
