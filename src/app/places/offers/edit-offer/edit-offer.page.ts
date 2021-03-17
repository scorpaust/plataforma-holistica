import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
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
  form: FormGroup;
  private placeSub: Subscription;

  constructor(private route: ActivatedRoute, private placesService: PlacesService, private navCtrl: NavController) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('espacoId')) {
        this.navCtrl.navigateBack('/espacos/tabs/ofertas');
        return;
      }
      this.placeSub = this.placesService.getPlace(paramMap.get('espacoId')).subscribe(place => {
        this.place = place;
        this.form = new FormGroup({
          name: new FormControl(this.place.name, {
            updateOn: 'blur',
            validators: [Validators.required]
          }),
          description: new FormControl(this.place.description, {
            updateOn: 'blur',
            validators: [Validators.required, Validators.maxLength(100)]
          })
        });
      });
      });
  }

  onUpdateForm() {
    if (!this.form.valid) {
      return;
    }

    console.log(this.form);
  }

  ngOnDestroy() {
    if  (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }

}
