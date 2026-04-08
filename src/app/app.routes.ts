import { Routes } from '@angular/router';
import { Founds } from './pages/founds/founds';

export const routes: Routes = [
  // Ruta inicial → redirige a 'found'
  { path: '', redirectTo: 'found', pathMatch: 'full' },

  // Rutas principales
  { path: 'found', component: Founds },
  //   { path: 'historial', component: HistorialComponent },

  // Ruta comodín (404)
  //   { path: '**', component: NotFoundComponent },
];
