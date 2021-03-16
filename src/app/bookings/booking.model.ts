export class Booking {

  constructor(
    public id: string,
    public placeId: string,
    public userId: string,
    public placeName: string,
    public guestNumber: number
  ) {}
}
