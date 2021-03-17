export class Booking {
  constructor(
    public id: string,
    public placeId: string,
    public userId: string,
    public placeName: string,
    public placeImg: string,
    public eventType: string,
    public bookedFrom: Date,
    public bookedTo: Date,
    public minGuestNumber: number,
    public maxGuestNumber: number
  ) {}
}
