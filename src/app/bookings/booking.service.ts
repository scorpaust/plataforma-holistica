import { Booking } from './booking.model';
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class BookingsService {

  private _bookings: Booking[] = [
    {
      id: 'b1',
      placeId: 'p1',
      placeName: 'Naniora',
      guestNumber: 2,
      userId: 'abc'
    }
  ]

  get bookings() {
    return [...this._bookings];
  }

}
