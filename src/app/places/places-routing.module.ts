import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';
import { PlacesPage } from './places.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: PlacesPage,
    children: [
      {
        path: 'descobrir',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./discover/discover.module').then(
                (m) => m.DiscoverPageModule
              ),
          },
          {
            path: ':espacoId',
            loadChildren: () =>
              import('./discover/place-detail/place-detail.module').then(
                (m) => m.PlaceDetailPageModule
              ),
          },
        ],
      },
      {
        path: 'ofertas',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./offers/offers.module').then((m) => m.OffersPageModule),
          },
          {
            path: 'nova',
            loadChildren: () =>
              import('./offers/new-offer/new-offer.module').then(
                (m) => m.NewOfferPageModule
              ),
          },
          {
            path: 'editar/:espacoId',
            loadChildren: () =>
              import('./offers/edit-offer/edit-offer.module').then(
                (m) => m.EditOfferPageModule
              ),
          },
        ],
      },
      {
        path: '',
        redirectTo: '/espacos/tabs/descobrir',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/espacos/tabs/descobrir',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlacesPageRoutingModule {}
