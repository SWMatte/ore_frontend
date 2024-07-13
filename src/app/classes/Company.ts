export class Company {
    idCompany!: number;
  nameCompany!: string;
  placeCompany!: string;



  constructor(idCompany: number , nameCompany : string , placeCompany : string) {

    this.idCompany = idCompany;
    if (nameCompany) {
      this.nameCompany = nameCompany;
    }
    if (placeCompany) {
      this.placeCompany = placeCompany;
    }
  }
}
