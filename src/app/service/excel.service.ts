import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  constructor(private http : HttpClient) { }

  url : string= 'http://localhost:8080/api/v1/';

 
  public getExcel(month: string): Observable<Blob> {
    let queryParams = new HttpParams().set('month', month);
    
    return this.http.get<Blob>(this.url + 'exportExcel', {
      params: queryParams,
      responseType: 'blob' as 'json'  // Specifica che la risposta è un blob
    });
  }

  }
