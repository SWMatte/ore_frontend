import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../classes/User';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http : HttpClient) { }

  url : string= 'http://localhost:8080/api/v1/';

  
  public getUser(name: string, lastName: string): Observable<User> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("name", name);
    queryParams = queryParams.append("lastName", lastName);

    return this.http.get<any>(this.url + 'getLogin', { params: queryParams })
    .pipe(map(respone => respone.body as User))
  }

}
