import { BehaviorSubject, of } from 'rxjs';
import { delay, map, switchMap, take, tap } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Place } from './place.model';
import { PlaceLocation } from './location.model';

interface PlaceData {
  availableFrom: string;
  availableTo: string;
  description: string;
  imageUrl: string;
  name: string;
  payType: string;
  price: number;
  userId: string;
  location: PlaceLocation;
}

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([]);

  constructor(private authService: AuthService, private http: HttpClient) {}

  get places() {
    return this._places.asObservable();
  }

  fetchPlaces() {
    return this.http
      .get<{ [key: string]: PlaceData }>(
        'https://portal-holistico-1c559-default-rtdb.firebaseio.com/espacos-holisticos.json'
      )
      .pipe(
        map((resData) => {
          const places = [];

          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              places.push(
                new Place(
                  key,
                  resData[key].name,
                  resData[key].description,
                  resData[key].imageUrl,
                  resData[key].payType,
                  resData[key].price,
                  new Date(resData[key].availableFrom),
                  new Date(resData[key].availableTo),
                  resData[key].userId,
                  resData[key].location
                )
              );
            }
          }
          return places;
        }),
        tap((places) => {
          this._places.next(places);
        })
      );
  }

  getPlace(id: string) {
    return this.http
      .get<PlaceData>(
        `https://portal-holistico-1c559-default-rtdb.firebaseio.com/espacos-holisticos/${id}.json`
      )
      .pipe(
        map((placeData) => {
          return new Place(
            id,
            placeData.name,
            placeData.description,
            placeData.imageUrl,
            placeData.payType,
            placeData.price,
            new Date(placeData.availableFrom),
            new Date(placeData.availableTo),
            placeData.userId,
            placeData.location
          );
        })
      );
  }

  addPlace(
    name: string,
    description: string,
    imgUrl: string,
    paytype: string,
    price: number,
    availableFrom: Date,
    availableTo: Date,
    location: PlaceLocation
  ) {
    let generatedId: string;
    const newPlace = new Place(
      Math.random().toString(),
      name,
      description,
      imgUrl,
      paytype,
      price,
      availableFrom,
      availableTo,
      this.authService.userId,
      location
    );
    return this.http
      .post<{ name: string }>(
        'https://portal-holistico-1c559-default-rtdb.firebaseio.com/espacos-holisticos.json',
        {
          ...newPlace,
          id: null,
        }
      )
      .pipe(
        switchMap((resData) => {
          generatedId = resData.name;
          return this.places;
        }),
        take(1),
        tap((places) => {
          newPlace.id = generatedId;
          this._places.next(places.concat(newPlace));
        })
      );
    /* return this.places.pipe(
      delay(1000),
      take(1),
      tap((places) => {
        this._places.next(places.concat(newPlace));
      })
    ); */
  }

  updatePlace(id: string, name: string, description: string) {
    let updatedPlaces: Place[];
    return this.places.pipe(
      take(1),
      switchMap((places) => {
        if (!places || places.length <= 0) {
          return this.fetchPlaces();
        } else {
          return of(places);
        }
      }),
      switchMap((places) => {
        const updatedPlaceIndex = places.findIndex((pl) => pl.id === id);
        updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new Place(
          oldPlace.id,
          name,
          description,
          oldPlace.imageUrl,
          oldPlace.payType,
          oldPlace.price,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId,
          oldPlace.location
        );
        return this.http.put(
          `https://portal-holistico-1c559-default-rtdb.firebaseio.com/espacos-holisticos/${id}.json`,
          {
            ...updatedPlaces[updatedPlaceIndex],
            id: null,
          }
        );
      }),
      tap(() => {
        this._places.next(updatedPlaces);
      })
    );
  }
}
