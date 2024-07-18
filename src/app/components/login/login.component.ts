import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { Route, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
 import { User } from 'src/app/classes/User';
import { LoginService } from 'src/app/service/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

 /* QUESTA CLASSE NON APPENA CREO LA LOGIN A BACK END MI STACCA IL TOKEN O LA BASIC AUTENTICATION E SE MATCHA TI SPOSTA SULLA HOME DOVE PUOI FARE COSE
 IN BASE ALLA LOGIN E COSA RECUPERO QUEL GET USER ME LO PORTO IN GIRO
 */
 isLoading: boolean = false; 

 constructor(private loginService : LoginService,  private router: Router ) { }
   

  salvaDati(name: string, lastName: string): void {
    this.isLoading = true; 
      this.getUser(name,lastName);
      
   }


    async getUser(name: string, lastName: string){
     
      try {
        const data = this.loginService.getUser(name,lastName);
        const user = await lastValueFrom(data);
        sessionStorage.setItem('name',user.lastName||'');
        sessionStorage.setItem('lastName',user.name||'');
        sessionStorage.setItem('idUser',user.idUser);
   
        if (user.company) {
          sessionStorage.setItem('nameCompany', user.company.nameCompany||'');
          sessionStorage.setItem('placeCompany', user.company.placeCompany||'');
          sessionStorage.setItem('idCompany', user.company.idCompany);
        }
        
      } catch (error) {
         console.log(error);
      } finally{
        setTimeout(() => {  /* setta un ritardo di 3 se e dopo ti sposta*/
          this.isLoading = false;
          this.router.navigate(['/home']);
        }, 3000); 
      }
    
     
      
      
     
    

    
   }

}
