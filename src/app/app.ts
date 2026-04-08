import { Component, inject, signal, computed } from '@angular/core';
import { LoaderService } from './services/loader.service';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { Founds } from './pages/founds/founds';
import { FoundsService } from './services/founds.service';
import { Navbar } from './components/navbar/navbar';
import { Sidebar } from './components/sidebar/sidebar';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Sidebar, ToastModule],

  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  loader = inject(LoaderService);
  private router = inject(Router);
  
  private currentUrl = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(event => (event as NavigationEnd).urlAfterRedirects)
    )
  );

  showSidebar = computed(() => {
    const url = this.currentUrl() || '';
    return !url.includes('/historial') && !url.includes('/cartera');
  });

  protected readonly title = signal('btg-invest');
}
