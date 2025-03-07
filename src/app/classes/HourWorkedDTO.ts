export  class HourWorkedDTO {
     month!: string;
     day!: string;
    number!: string;
    year!: string;
    hour!: number;
    note!: string;
    place!: string;
    illness!: number;
    holiday!: number;
    hoursOff!: number;
    extraWork!:number;
     
    constructor(
        month: string,
        day: string,
        number: string,
        year: string = '',  
        hour: number = 0,   
        note: string = '',  
        place: string = '',  
        illness: number = 0,  
        holiday: number = 0,  
        hoursOff: number = 0,
        extraWork:number=0   
      ) {
        this.month = month;
        this.day = day;
        this.number = number;
        this.year = year;
        this.hour = hour;
        this.note = note;
        this.place = place;
        this.illness = illness;
        this.holiday = holiday;
        this.hoursOff = hoursOff;
        this.extraWork=extraWork;
      }
}