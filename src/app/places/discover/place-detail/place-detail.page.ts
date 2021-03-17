import {
  ActionSheetController,
  AlertController,
  LoadingController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { AuthService } from '../../../auth/auth.service';
import { BookingsService } from '../../../bookings/booking.service';
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
  isBookable = false;
  isLoading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private placesService: PlacesService,
    private actSheetCtrl: ActionSheetController,
    private bookingsService: BookingsService,
    private loaderCtrl: LoadingController,
    private authService: AuthService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('espacoId')) {
        this.navCtrl.navigateBack('/espacos/tabs/ofertas');
        return;
      }
      this.isLoading = true;
      this.placeSub = this.placesService
        .getPlace(paramMap.get('espacoId'))
        .subscribe(
          (place) => {
            this.place = place;
            this.isBookable = place.userId !== this.authService.userId;
            this.isLoading = false;
          },
          (error) => {
            this.alertCtrl
              .create({
                header: 'Erro',
                message:
                  'Problema no carregamento do espaço. Por favor, tente mais tarde.',
                buttons: [
                  {
                    text: 'OK',
                    handler: () => {
                      this.router.navigate(['/espacos/tabs/descobrir']);
                    },
                  },
                ],
              })
              .then((alertEl) => {
                alertEl.present();
              });
          }
        );
    });
  }

  onBookPlace() {
    //     this.router.navigateByUrl('/espacos/tabs/descobrir');
    // this.navCtrl.navigateBack('/espacos/tabs/descobrir');
    this.actSheetCtrl
      .create({
        header: 'Escolha uma opção',
        buttons: [
          {
            text: 'Selecionar Data',
            handler: () => {
              this.openBookingModal('select');
            },
          },
          {
            text: 'Data Aleatória',
            handler: () => {
              this.openBookingModal('random');
            },
          },
          {
            text: 'Cancelar',
            role: 'destructive',
          },
        ],
      })
      .then((actSheetEl) => {
        actSheetEl.present();
      });
  }

  openBookingModal(mode: 'select' | 'random') {
    console.log(mode);
    this.modalCtrl
      .create({
        component: CreateBookingComponent,
        componentProps: { selectedPlace: this.place, selectedMode: mode },
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then((resultData) => {
        if (resultData.role === 'confirm') {
          this.loaderCtrl
            .create({
              message: 'Criando agendamento...',
            })
            .then((loadingEl) => {
              loadingEl.present();
              const data = resultData.data.bookingData;
              this.bookingsService
                .addBooking(
                  this.place.id,
                  this.place.name,
                  this.place.imageUrl,
                  data.firstName,
                  data.lastName,
                  data.eventType,
                  data.minGuests,
                  data.maxGuests,
                  data.dateFrom,
                  data.dateTo
                )
                .subscribe(() => {
                  loadingEl.dismiss();
                });
            });
        }
      });
  }

  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }
}
