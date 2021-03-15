import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';

import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {

  place: Place;

  constructor(private router: Router, private route: ActivatedRoute, private navCtrl: NavController, private modalCtrl: ModalController, private placesService: PlacesService) { }

  ngOnInit() {

    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('espacoId')) {
        this.navCtrl.navigateBack('/espacos/tabs/ofertas');
        return;
      }
      this.place = this.placesService.getPlace(paramMap.get('espacoId'));
      console.log(this.place);
    });
  }

  onBookPlace() {
    //     this.router.navigateByUrl('/espacos/tabs/descobrir');
      // this.navCtrl.navigateBack('/espacos/tabs/descobrir');
    this.modalCtrl.create({
      component: CreateBookingComponent, componentProps: {selectedPlace: this.place }}).then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    }).then(resultData => {
      console.log(resultData.data, resultData.role);
      if (resultData.role === 'confirm') {
        console.log('AGENDADO!');
      }
    });
  }
}
