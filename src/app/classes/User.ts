import { Company } from "./Company";

export class User {
  idUser!: string;
  name!: string;
  lastName!: string;
  company?: Company;

   


  constructor(idUser: string , name : string , lastName : string, company : Company) {

    this.idUser = idUser;
    if (name) {
      this.name = name;
    }
    if (lastName) {
      this.lastName = lastName;
    }
    if (company) {
      this.company = company;
    }
  }


  
}
