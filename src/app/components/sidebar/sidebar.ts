import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FoundsService } from '../../services/founds.service';
import TEXTS from '../../data/texts.json';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar {
  texts = TEXTS;
  private foundsService = inject(FoundsService);

  toggleType(type: string, { checked }: { checked: boolean }) {
    const current = this.foundsService.selectedTypes();
    if (checked) {
      this.foundsService.selectedTypes.set([...current, type]);
    } else {
      this.foundsService.selectedTypes.set(current.filter(t => t !== type));
    }
  }
}
