import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { LoadingController } from '@ionic/angular';
import { PlaceLocation } from '../../location.model';
import { PlacesService } from '../../places.service';
import { Router } from '@angular/router';
import { SafeUrl } from '@angular/platform-browser';
import { switchMap } from 'rxjs/operators';

const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
};

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {
  form: FormGroup;
  imageUrl: string;

  constructor(
    private placesService: PlacesService,
    private router: Router,
    private loaderCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      description: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(100)],
      }),
      paytype: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      dateFrom: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      dateTo: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      price: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)],
      }),
      location: new FormControl(null, {
        validators: [Validators.required],
      }),
      image: new FormControl(null),
    });
  }

  onCreateOffer() {
    if (!this.form.valid || !this.form.get('image').value) {
      return;
    }
    this.loaderCtrl
      .create({
        message: 'Criando espaço...',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.placesService
          .uploadImage(this.form.get('image').value)
          .pipe(
            switchMap((uploadRes) => {
              return this.placesService.addPlace(
                this.form.value.name,
                this.form.value.description,
                uploadRes.imageUrl,
                this.form.value.paytype,
                +this.form.value.price,
                new Date(this.form.value.dateFrom),
                new Date(this.form.value.dateTo),
                this.form.value.location
              );
            })
          )
          .subscribe(() => {
            loadingEl.dismiss();
            this.form.reset();
            this.router.navigate(['/espacos/tabs/ofertas']);
          });
      });
  }

  onLocationPick(location: PlaceLocation) {
    this.form.patchValue({ location });
  }

  onImagePick(imageData: string | File) {
    let imageFile;
    if (typeof imageData === 'string') {
      try {
        imageFile = b64toBlob(imageData, 'image/jpeg');
      } catch (error) {
        console.log(error);
        return;
      }
    } else {
      imageFile = imageData;
    }
    this.form.patchValue({
      image: imageFile,
    });
    this.imageUrl = URL.createObjectURL(imageFile);
  }
}
