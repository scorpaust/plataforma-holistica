import { PlaceLocation } from './location.model';

export class Place {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public imageUrl: string,
    public payType: string,
    public price: number,
    public availableFrom: Date,
    public availableTo: Date,
    public userId: string,
    public location: PlaceLocation
  ) {}
}
