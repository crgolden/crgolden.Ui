import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ValidationController } from '@crgolden/core-controllers';
import { environment } from '../../environments/environment';
import { Address } from '@crgolden/core-claims';

@Injectable({
  providedIn: 'root'
})
export class AddressController extends ValidationController<Address> {

  constructor(http: HttpClient) {
    super('addresses', environment.apiUrl, http);
  }
}
