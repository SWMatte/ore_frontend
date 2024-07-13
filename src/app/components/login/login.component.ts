import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';
 import { User } from 'src/app/classes/User';
import { LoginService } from 'src/app/service/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private loginService : LoginService,  private router: Router ) { }

 /* QUESTA CLASSE NON APPENA CREO LA LOGIN A BACK END MI STACCA IL TOKEN O LA BASIC AUTENTICATION E SE MATCHA TI SPOSTA SULLA HOME DOVE PUOI FARE COSE
 IN BASE ALLA LOGIN E COSA RECUPERO QUEL GET USER ME LO PORTO IN GIRO
 */
  salvaDati(name: string, lastName: string): void {
      // this.getUser(name,lastName);
      sessionStorage.setItem('name',name);
      sessionStorage.setItem('lastName',lastName);
      this.router.navigate(['/home'])
   }


   getUser(name: string, lastName: string){
    
    this.loginService.getUser(name,lastName).subscribe((user:User)=>{
      sessionStorage.setItem('name',user.name);
      sessionStorage.setItem('lastName',user.lastName);
    })

    
   }

}
