import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
  import { DayWorkedDTO } from '../classes/DayWorkedDTO';

@Injectable({
  providedIn: 'root'
})
export class HourWorkedService {

  constructor(private http : HttpClient) { }

  url : string= 'http://localhost:8080/api/v1/';

  
  public sendHoursWorked(body: DayWorkedDTO): Observable<HttpResponse<any>> {
         
    return this.http.post<any>(`${this.url}sendHourWorked`, body, { observe: 'response' }); /*
    { observe: 'response' } in Angular permette di osservare l'intera risposta HTTP, non solo il corpo della risposta. Ciò significa che la risposta conterrà informazioni aggiuntive, come lo status code, gli header e il corpo della risposta. 
    */
    
    
    }
     
}
