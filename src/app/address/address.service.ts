import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Address } from './address';

@Injectable()
export class AddressService {

  constructor(private readonly http: HttpClient) {
  }

  validate(address: Address): Observable<boolean> {
    return this.http
      .post<boolean>(`${environment.apiUrl}/Addresses/Validate`, JSON.stringify(address));
  }
}
