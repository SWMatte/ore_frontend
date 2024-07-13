import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Company } from '../classes/Company';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {


  constructor(private http : HttpClient) { }
  

  url : string= 'http://localhost:8080/api/v1/';

  
  public getCompany(name: string, lastName: string): Observable<Company> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("name", name);
    queryParams = queryParams.append("lastName", lastName);

    return this.http.get<Company>(this.url + 'getCompany', { params: queryParams });
  }
/*
UNA VOLTA FATTO A BACK END IL RECUPERO DELLA COMPANY, BISOGNA VEDERE SE RECUPERO DALL USER ANCHE I DATI DELLA COMPANY
IN QUEL CASO DECIDO COME GESTIRLI SE METTERLI IN UNA SESSIONE O DALL'ID RIFARE UNA CHIAMTA
*/
}
