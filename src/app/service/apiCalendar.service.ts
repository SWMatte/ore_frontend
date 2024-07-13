import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DayMonth } from '../classes/DayMonth';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http : HttpClient) { }

  url : string= 'http://localhost:8080/api/v1/';

  public getCalendar(month: string, year: string):Observable<DayMonth[]>{
    let queryParams = new HttpParams();
    queryParams= queryParams.append("month",month);
    queryParams= queryParams.append("year",year);

     return this.http.get<DayMonth[]>(this.url+'getMonth',{params:queryParams});
  }
}
