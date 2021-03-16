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
      eventType: 'Terapia',
      minGuestNumber: 2,
      maxGuestNumber: 10,
      userId: 'abc'
    }
  ]

  get bookings() {
    return [...this._bookings];
  }

}
