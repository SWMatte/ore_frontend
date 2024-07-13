export class User {
  idUser!: number;
  name!: string;
  lastName!: string;

   


  constructor(idUser: number , name : string , lastName : string) {

    this.idUser = idUser;
    if (name) {
      this.name = name;
    }
    if (lastName) {
      this.lastName = lastName;
    }
  }


  
}
