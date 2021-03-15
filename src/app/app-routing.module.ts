import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';
import { NgModule } from '@angular/core';

const routes: Routes = [
  { path: '', redirectTo: 'espacos', pathMatch: 'full' },
  { path: 'aut', loadChildren: () => import('./auth/auth.module').then( m => m.AuthPageModule)},
  { path: 'espacos', loadChildren: () => import('./places/places.module').then( m => m.PlacesPageModule), canLoad: [AuthGuard]},
  { path: 'marcacoes', loadChildren: () => import('./bookings/bookings.module').then( m => m.BookingsPageModule), canLoad: [AuthGuard]}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
