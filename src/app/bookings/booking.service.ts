import { delay, take, tap } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';
import { BehaviorSubject } from 'rxjs';
import { Booking } from './booking.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BookingsService {
  private _bookings = new BehaviorSubject<Booking[]>([]);

  constructor(private authService: AuthService) {}

  get bookings() {
    return this._bookings.asObservable();
  }

  addBooking(
    placeId: string,
    placeName: string,
    placeImg: string,
    firstName: string,
    lastName: string,
    eventType: string,
    minGuestNumber: number,
    maxGuestNumber: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    const newBooking = new Booking(
      Math.random().toString(),
      placeId,
      this.authService.userId,
      placeName,
      placeImg,
      eventType,
      dateFrom,
      dateTo,
      minGuestNumber,
      maxGuestNumber
    );
    return this.bookings.pipe(
      take(1),
      delay(1000),
      tap((bookings) => {
        this._bookings.next(bookings.concat(newBooking));
      })
    );
  }

  cancelBooking(bookingId: string) {
    return this.bookings.pipe(
      take(1),
      delay(1000),
      tap((bookings) => {
        this._bookings.next(bookings.filter((b) => b.id !== bookingId));
      })
    );
  }
}
