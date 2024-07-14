export class Company {
    idCompany!: string;
  nameCompany!: string;
  placeCompany!: string;



  constructor(idCompany: string , nameCompany : string , placeCompany : string) {

    this.idCompany = idCompany;
    if (nameCompany) {
      this.nameCompany = nameCompany;
    }
    if (placeCompany) {
      this.placeCompany = placeCompany;
    }
  }
}
