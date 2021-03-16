export class Booking {

  constructor(
    public id: string,
    public placeId: string,
    public userId: string,
    public placeName: string,
    public eventType: string,
    public minGuestNumber: number,
    public maxGuestNumber: number
  ) {}
}
