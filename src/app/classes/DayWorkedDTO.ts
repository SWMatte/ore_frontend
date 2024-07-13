import { Company } from "./Company";
import { HourWorkedDTO } from "./HourWorkedDTO";
import { User } from "./User";

export class DayWorkedDTO {

     hourWorkedDTO!: HourWorkedDTO[];
     user!: User;
     company!: Company;
  
    constructor(hourWorkedDTO: HourWorkedDTO[], user: User, company: Company) {
      this.hourWorkedDTO = hourWorkedDTO;
      this.user = user;
      this.company = company;
    }

}