import { Component } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent {
  name: string | null = sessionStorage.getItem('name');
  lastName: string | null = sessionStorage.getItem('lastName');

  /* PROFILO DEL UTENTE CHE MOSTRA I DATI ANAGRAFICI E LE CARATTERSTICHE EMAIL ECC*/
}
