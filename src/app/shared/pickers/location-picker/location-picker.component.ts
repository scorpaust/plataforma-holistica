import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { MapModalComponent } from '../../map-modal/map-modal.component';
import { ModalController } from '@ionic/angular';
import { PlaceLocation } from '../../../places/location.model';
import { environment } from '../../../../environments/environment';
import { of } from 'rxjs';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent implements OnInit {
  selectedLocationImage: string;
  isLoading = false;
  @Output() locationPick = new EventEmitter<PlaceLocation>();

  constructor(private modalCtrl: ModalController, private http: HttpClient) {}

  ngOnInit() {}

  onPickLocation() {
    this.modalCtrl
      .create({
        component: MapModalComponent,
      })
      .then((modalEl) => {
        modalEl.onDidDismiss().then((modalData) => {
          if (modalData) {
            const pickedLocation: PlaceLocation = {
              lat: modalData.data.lat,
              lng: modalData.data.lng,
              address: null,
              staticMapImgUrl: null,
            };
            this.isLoading = true;
            this.getAddress(modalData.data.lat, modalData.data.lng)
              .pipe(
                switchMap((address) => {
                  pickedLocation.address = address;
                  return of(
                    this.getMapImage(pickedLocation.lat, pickedLocation.lng, 14)
                  );
                })
              )
              .subscribe((staticMapImgUrl) => {
                pickedLocation.staticMapImgUrl = staticMapImgUrl;
                this.selectedLocationImage = staticMapImgUrl;
                this.isLoading = false;
                this.locationPick.emit(pickedLocation);
              });
          } else {
            return;
          }
        });
        modalEl.present();
      });
  }

  private getAddress(lat: number, lng: number) {
    return this.http
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${environment.googleAPIKey}`
      )
      .pipe(
        map((geoData: any) => {
          if (!geoData || !geoData.results || geoData.results.length === 0) {
            return null;
          }
          return geoData.results[0].formatted_address;
        })
      );
  }

  private getMapImage(lat: number, lng: number, zoom: number) {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=500x300&maptype=roadmap
    &markers=red:blue%7Clabel:Local%7C${lat},${lng}
    &key=${environment.googleAPIKey}`;
  }
}
