import {
  ActionSheetController,
  AlertController,
  ModalController,
} from '@ionic/angular';
import { Capacitor, Plugins } from '@capacitor/core';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Coordinates, PlaceLocation } from '../../../places/location.model';
import { map, switchMap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { MapModalComponent } from '../../map-modal/map-modal.component';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
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

  constructor(
    private modalCtrl: ModalController,
    private http: HttpClient,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {}

  onPickLocation() {
    this.actionSheetCtrl
      .create({
        header: 'Opções',
        buttons: [
          {
            text: 'Auto-Localização',
            handler: () => {
              this.locateUser();
            },
          },
          {
            text: 'Mapa',
            handler: () => {
              this.OpenMap();
            },
          },
          {
            text: 'Cancelar',
            role: 'cancel',
          },
        ],
      })
      .then((actionSheetEl) => {
        actionSheetEl.present();
      });
  }

  private locateUser() {
    if (!Capacitor.isPluginAvailable('Geolocation')) {
      this.showErrorAlert();
      return;
    }
    this.isLoading = true;
    Plugins.Geolocation.getCurrentPosition()
      .then((geoLocation) => {
        const coordinates: Coordinates = {
          lat: geoLocation.coords.latitude,
          lng: geoLocation.coords.longitude,
        };
        this.createPlace(coordinates.lat, coordinates.lng);
        this.isLoading = false;
      })
      .catch((err) => {
        this.showErrorAlert();
      });
  }

  private showErrorAlert() {
    this.alertCtrl
      .create({
        header: 'Erro ao obter localização',
        message: 'Por favor, use o mapa para obter uma localização.',
      })
      .then((alertEl) => {
        alertEl.present();
      });
  }

  private createPlace(lat: number, lng: number) {
    const pickedLocation: PlaceLocation = {
      lat,
      lng,
      address: null,
      staticMapImgUrl: null,
    };
    this.isLoading = true;
    this.getAddress(lat, lng)
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
  }

  private OpenMap() {
    this.modalCtrl
      .create({
        component: MapModalComponent,
      })
      .then((modalEl) => {
        modalEl.onDidDismiss().then((modalData) => {
          if (modalData) {
          } else {
            return;
          }
          const coordinates: Coordinates = {
            lat: modalData.data.lat,
            lng: modalData.data.lng,
          };
          this.createPlace(coordinates.lat, coordinates.lng);
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
