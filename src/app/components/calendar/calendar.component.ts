import { Component, OnInit,ChangeDetectionStrategy, OnChanges, SimpleChanges} from '@angular/core';
 import { Observable } from 'rxjs';
 import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ApiService } from 'src/app/service/apiCalendar.service';
import { DayMonth } from 'src/app/classes/DayMonth';
 /*
 QUESTO COMPONENTE VIENE RICHIAMATO NEL FORM QUA ANDRO' AD IMPOSTARE I VALORI CHE COMPILANO LA TABELLA CON GIORNO-ORE E VEDOCHE ALTRO
 */
  @Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush
 })
export class CalendarComponent implements OnChanges{
  
  daysOfMonth$!: Observable<DayMonth[]>;
  selectedDate: Date | null;

constructor(private apiService:ApiService,){
  this.selectedDate = null;
}

   ngOnChanges(changes: SimpleChanges): void {  // tengo traccia dei cambiamenti dell'oservable ogni volta che cambia la data selezionata
       changes["daysOfMonth$"]
    }
  

  getCalendar(month : string , year : string){ // richiamo il back end con il calendario che voglio ottenere
   this.daysOfMonth$ = this.apiService.getCalendar(month, year);
  }

  
  dateSelected(event: MatDatepickerInputEvent<Date>) { // metodo evento che recupera la data e anno selezionato dall html
    this.selectedDate = event.value;

    if (this.selectedDate) {
      const month: number = this.selectedDate.getMonth()+1;
      const year: number = this.selectedDate.getFullYear();
      this.getCalendar(month.toString(), year.toString());
    }
  
  }


}
