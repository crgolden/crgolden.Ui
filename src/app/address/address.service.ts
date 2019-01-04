import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Address } from './address';

@Injectable()
export class AddressService {

  constructor(private readonly http: HttpClient) {
  }

  protected get headers(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  validate(address: Address): Observable<boolean> {
    return this.http
      .post<boolean>(`${environment.apiUrl}/Addresses/Validate`, JSON.stringify(address), {
        headers: this.headers
      });
  }
}
