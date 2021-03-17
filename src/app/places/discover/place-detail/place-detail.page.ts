import { ActionSheetController, ModalController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {

  place: Place;
  placeSub: Subscription;

  constructor(private router: Router, private route: ActivatedRoute, private navCtrl: NavController,
              private modalCtrl: ModalController, private placesService: PlacesService,
              private actSheetCtrl: ActionSheetController) { }

  ngOnInit() {

    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('espacoId')) {
        this.navCtrl.navigateBack('/espacos/tabs/ofertas');
        return;
      }
      this.placeSub = this.placesService.getPlace(paramMap.get('espacoId')).subscribe(place => {
        this.place = place;
      });
      console.log(this.place);
    });
  }

  onBookPlace() {
    //     this.router.navigateByUrl('/espacos/tabs/descobrir');
      // this.navCtrl.navigateBack('/espacos/tabs/descobrir');
    this.actSheetCtrl.create({
      header: 'Escolha uma opção',
      buttons: [
        {
          text: 'Selecionar Data',
          handler: () => {
            this.openBookingModal('select');
          }
        },
        {
          text: 'Data Aleatória',
          handler: () => {
            this.openBookingModal('random');
          }
        },
        {
          text: 'Cancelar',
          role: 'destructive'
        }
      ]
    }).then(actSheetEl => {
      actSheetEl.present();
    });

  }

  openBookingModal(mode: 'select' | 'random') {
    console.log(mode);
    this.modalCtrl.create({
      component: CreateBookingComponent, componentProps: {selectedPlace: this.place, selectedMode: mode }}).then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    }).then(resultData => {
      console.log(resultData.data, resultData.role);
      if (resultData.role === 'confirm') {
        console.log('AGENDADO!');
      }
    });
  }

  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }
}
