import { map, switchMap, take, tap } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';
import { BehaviorSubject } from 'rxjs';
import { Booking } from './booking.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

interface BookingData {
  placeId: string;
  userId: string;
  placeName: string;
  placeImg: string;
  firstName: string;
  lastName: string;
  eventType: string;
  minGuestNumber: number;
  maxGuestNumber: number;
  bookedFrom: Date;
  bookedTo: Date;
}

@Injectable({
  providedIn: 'root',
})
export class BookingsService {
  private _bookings = new BehaviorSubject<Booking[]>([]);

  constructor(private authService: AuthService, private http: HttpClient) {}

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
    let generatedId: string;
    let newBooking: Booking;
    let fetchedUserId: string;
    return this.authService.userId.pipe(
      take(1),
      switchMap((userId) => {
        if (!userId) {
          throw new Error('Não foi encontrado nenhum ID de utilizador.');
        }
        fetchedUserId = userId;
        return this.authService.token;
      }),
      take(1),
      switchMap((token) => {
        newBooking = new Booking(
          Math.random().toString(),
          placeId,
          fetchedUserId,
          placeName,
          placeImg,
          firstName,
          lastName,
          eventType,
          dateFrom,
          dateTo,
          minGuestNumber,
          maxGuestNumber
        );
        return this.http.post<{ name: string }>(
          `https://portal-holistico-1c559-default-rtdb.firebaseio.com/agendamentos.json?auth=${token}`,
          { ...newBooking, id: null }
        );
      }),
      switchMap((resData) => {
        generatedId = resData.name;
        return this.bookings;
      }),
      take(1),
      tap((bookings) => {
        this._bookings.next(bookings.concat(newBooking));
      })
    );
  }

  cancelBooking(bookingId: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.delete(
          `https://portal-holistico-1c559-default-rtdb.firebaseio.com/agendamentos/${bookingId}.json?auth=${token}`
        );
      }),
      switchMap(() => {
        return this.bookings;
      }),
      take(1),
      tap((bookings) => {
        this._bookings.next(bookings.filter((b) => b.id !== bookingId));
      })
    );
  }

  fetchBookings() {
    let fetchedUserId: string;

    return this.authService.userId.pipe(
      take(1),
      switchMap((userId) => {
        if (!userId) {
          throw new Error('Não encontrado ID de utilizador.');
        }
        fetchedUserId = userId;
        return this.authService.token;
      }),
      take(1),
      switchMap((token) => {
        return this.http.get<{ [key: string]: BookingData }>(
          `https://portal-holistico-1c559-default-rtdb.firebaseio.com/agendamentos.json?agendamentoDe="idUtilizador"&equalto="${fetchedUserId}"&auth=${token}`
        );
      }),
      map((bookingData) => {
        const bookings = [];
        for (const key in bookingData) {
          if (bookingData.hasOwnProperty(key)) {
            bookings.push(
              new Booking(
                key,
                bookingData[key].placeId,
                bookingData[key].userId,
                bookingData[key].placeName,
                bookingData[key].placeImg,
                bookingData[key].firstName,
                bookingData[key].lastName,
                bookingData[key].eventType,
                new Date(bookingData[key].bookedFrom),
                new Date(bookingData[key].bookedTo),
                +bookingData[key].minGuestNumber,
                +bookingData[key].maxGuestNumber
              )
            );
          }
        }
        return bookings;
      }),
      tap((bookings) => {
        this._bookings.next(bookings);
      })
    );
  }
}
