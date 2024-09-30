import { Routes } from '@angular/router';
import { PiechartComponent } from './pages/piechart/piechart.component';

export const routes: Routes = [
  {
    path: '',
    component: PiechartComponent,
  },
  {
    path: 'piechart',
    component: PiechartComponent,
  },
];
