import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Driver } from '../models/driver.model';

const baseUrl = 'http://localhost:8080/api/drivers';

@Injectable({
  providedIn: 'root',
})
export class DriverService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Driver[]> {
    return this.http.get<Driver[]>(`${baseUrl}/list`);
  }

  get(id: any): Observable<Driver> {
    return this.http.get<Driver>(`${baseUrl} / ${id}`);
  }
  create(data: any): Observable<any> {
    console.log('DATA' + data);
    return this.http.post(`${baseUrl}/add`, data);
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl} / ${id}`);
  }
}
