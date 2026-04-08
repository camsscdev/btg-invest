import { Routes } from '@angular/router';
import { Founds } from './pages/founds/founds';
import { HistorialComponent } from './pages/historial/historial';

export const routes: Routes = [
  { path: '', redirectTo: 'found', pathMatch: 'full' },
  { path: 'found', component: Founds },
  { path: 'historial', component: HistorialComponent },
];
