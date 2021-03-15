import { Injectable } from '@angular/core';
import { Place } from './place.model';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  private _places: Place[] = [
    new Place(
      'p1',
      'Naniora',
      'Espaço de desenvolvimento pessoal com um vasto leque de ofertas, dentro do universo holístico, para alcançar todos os sonhos.',
      'https://scontent.flis9-1.fna.fbcdn.net/v/t1.0-9/30127682_433222523790949_1507278567342342144_o.jpg?_nc_cat=110&ccb=1-3&_nc_sid=973b4a&_nc_ohc=mGQyN9cHkaUAX-Fvf5T&_nc_ht=scontent.flis9-1.fna&oh=69f47186ce7a0ca7bfee676f7e0e7121&oe=6075F9FD',
      'Comissão',
      30.00),
    new Place(
      'p2',
      'Terra Luz',
      'Terraluz é um espaço de terapias e formação orientada para o desenvolvimento pessoal, assim como um lugar de encontro onde se poderá beber um chá, ler um livro, assistir a uma palestra, um concerto meditativo ou simplesmente estar.',
      'https://scontent.flis9-1.fna.fbcdn.net/v/t31.0-8/21272868_1492806177451382_998199050077695209_o.jpg?_nc_cat=106&ccb=1-3&_nc_sid=973b4a&_nc_ohc=HYAJT_M1Dc0AX-U0dBj&_nc_ht=scontent.flis9-1.fna&oh=e4a280970d4fd7e247d82045077e854e&oe=60752036',
      'Valor por hora',
      25.99)
  ];

  get places() {
    return [...this._places];
  }

  getPlace(id: string) {
    return {...this._places.find(p => p.id === id)};
  }

  constructor() { }
}
