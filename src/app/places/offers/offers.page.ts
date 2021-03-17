import { Component, OnDestroy, OnInit } from '@angular/core';

import { IonItemSliding } from '@ionic/angular';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {

  offers: Place[];
  private placesSub: Subscription;

  constructor(private placesService: PlacesService, private router: Router) { }

  ngOnInit() {
  this.placesSub = this.placesService.places.subscribe(places => {
      this.offers = places;
    })
  }

  onEdit(offerId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.router.navigate(['/', 'espacos', 'tabs', 'ofertas', 'editar', offerId]);
    console.log('Editando...', offerId);
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }

}
