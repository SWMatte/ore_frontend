import { Component } from '@angular/core';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent {
/* ANDRO AD ESPORRE I VALORI DELLA COMPAGNIA PER OGNI UTENTE DA MOSTRARE NEL PROFILO, QUESTO COMPONETNE VIENE RICHIAMATO NEL PROFILO
DELL USER */

 
idCompany: string | null = sessionStorage.getItem('idCompany');
placeCompany: string | null = sessionStorage.getItem('placeCompany');
nomeCompany: string | null = sessionStorage.getItem('nameCompany');



}