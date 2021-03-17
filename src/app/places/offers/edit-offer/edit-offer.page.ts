import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertController,
  LoadingController,
  NavController,
} from '@ionic/angular';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {
  place: Place;
  placeId: string;
  form: FormGroup;
  private placeSub: Subscription;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private placesService: PlacesService,
    private navCtrl: NavController,
    private router: Router,
    private loaderCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('espacoId')) {
        this.navCtrl.navigateBack('/espacos/tabs/ofertas');
        return;
      }
      this.placeId = paramMap.get('espacoId');
      this.isLoading = true;
      this.placeSub = this.placesService
        .getPlace(paramMap.get('espacoId'))
        .subscribe(
          (place) => {
            this.place = place;
            this.form = new FormGroup({
              name: new FormControl(this.place.name, {
                updateOn: 'blur',
                validators: [Validators.required],
              }),
              description: new FormControl(this.place.description, {
                updateOn: 'blur',
                validators: [Validators.required, Validators.maxLength(100)],
              }),
            });
            this.isLoading = false;
          },
          (error) => {
            this.alertCtrl
              .create({
                header: 'Erro',
                message:
                  'Problemas no carregamento do espaço. Tente mais tarde.',
                buttons: [
                  {
                    text: 'OK',
                    handler: () => {
                      this.router.navigate['/espacos/tabs/ofertas'];
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

  onUpdateOffer() {
    if (!this.form.valid) {
      return;
    }

    this.loaderCtrl
      .create({
        message: 'Atualizando espaço...',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.placesService
          .updatePlace(
            this.place.id,
            this.form.value.name,
            this.form.value.description
          )
          .subscribe(() => {
            loadingEl.dismiss();
            this.form.reset();
            this.router.navigate(['/espacos/tabs/ofertas']);
          });
      });
  }

  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }
}
