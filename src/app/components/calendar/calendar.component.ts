import { Component, OnInit, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ApiService } from 'src/app/service/apiCalendar.service';
import { DayMonth } from 'src/app/classes/DayMonth';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

/*
 * QUESTO COMPONENTE VIENE RICHIAMATO NEL FORM.
 * QUI ANDRO' AD IMPOSTARE I VALORI CHE COMPILANO LA TABELLA CON GIORNO, ORE E ALTRO.
 */
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent implements OnInit  {
  daysOfMonth$!: Observable<DayMonth[]>;
  selectedDate: Date | null;
  homeform!: FormGroup;
  hours: number[] = [0,1, 2, 3, 4, 5, 6, 7, 8]; 
  places: string[] = ['SEDE','SMART_WORKING','SEDE_CLIENTE'];
  totalHoursWorked: number = 0;
  totalIllnessHours: number = 0;
  totalHoliday: number = 0;
  totalDayOff: number = 0;
  totalMonthHour: number=0;
  viewTotal : boolean = false;

  constructor(private apiService: ApiService) {
    this.selectedDate = null;
  }


 
 

  ngOnInit(): void {
    // Inizializzo il FormGroup con un FormArray vuoto per i giorni del mese
    this.homeform = new FormGroup({
      days: new FormArray([]),
    });

    // Sottoscrivo agli eventi di cambiamento del valore del form
    this.homeform.valueChanges.subscribe(() => {
      this.calculateTotals();
    });


     
  }

  getCalendar(month: string, year: string) {
    // Richiamo il backend per ottenere il calendario del mese e dell'anno specificato
    this.daysOfMonth$ = this.apiService.getCalendar(month, year);

    // Sottoscrivo all'osservabile e passo i dati dei giorni al metodo per impostare il FormArray
    this.daysOfMonth$.subscribe((days) => {
      this.setDaysFormArray(days);
    });
  }

  setDaysFormArray(days: DayMonth[]) {
    // Recupero il FormArray 'days' dal FormGroup
    const daysFormArray = this.homeform.get('days') as FormArray;
    // Pulisco il FormArray per rimuovere eventuali dati precedenti
    daysFormArray.clear();
    // Itero sui giorni ottenuti dall'osservabile e aggiungo un nuovo FormGroup per ciascun giorno
    days.forEach(day => {
      // Verifico se il giorno è sabato o domenica e imposto il valore di default a 0
      const isWeekend = (day.day.toLowerCase() === 'sabato' || day.day.toLowerCase() === 'domenica');
      daysFormArray.push(new FormGroup({
        day: new FormControl({ value: day.day, disabled: true }), // Campo giorno non modificabile
        number: new FormControl({ value: day.number, disabled: true }), // Campo numero non modificabile
        hoursWorked: new FormControl(isWeekend ? 0 : null), // Campo ore lavorate, 0 per sabato e domenica
        places: new FormControl(),
        illnessHours: new FormControl(0),   
        holiday: new FormControl(0),
        dayOff: new FormControl(0),
        note: new FormControl(null) // Campo note
      }));
    });

    this.calculateTotals(); // richiamo il metodo che mi fa la somma delle ore
  }

  dateSelected(event: MatDatepickerInputEvent<Date>) {
    // Metodo evento che recupera la data e l'anno selezionati dall'HTML
    this.selectedDate = event.value;

    if (this.selectedDate) {
      // Recupero mese e anno dalla data selezionata
      const month: number = this.selectedDate.getMonth() + 1;
      const year: number = this.selectedDate.getFullYear();
      // Richiamo il metodo per ottenere il calendario per il mese e anno selezionati
      this.getCalendar(month.toString(), year.toString());
    }
  }

  calculateTotals() {
    // Reset dei totali
    this.totalHoursWorked = 0;
    this.totalIllnessHours = 0;
    this.totalHoliday = 0;
    this.totalDayOff = 0;
  
    // Recupero il FormArray 'days' dal FormGroup dichiarato in cima
    const daysFormArray = this.homeform.get('days') as FormArray;
  
    // Itero sui controlli del form per sommare i valori
    daysFormArray.controls.forEach((control) => {
      const group = control as FormGroup; //dall'array estraggo il formgroup che contiene i controlli
      this.totalHoursWorked += group.get('hoursWorked')?.value || 0;
      this.totalIllnessHours += group.get('illnessHours')?.value || 0;
      this.totalHoliday += group.get('holiday')?.value || 0;
      this.totalDayOff += group.get('dayOff')?.value || 0;
    });
    this.totalMonthHour= this.totalHoursWorked+this.totalIllnessHours+this.totalHoliday+ this.totalDayOff
    this.viewTotal = this.totalMonthHour > 0; // Imposta viewTotal a true se ci sono ore totali maggiori di zero

  }
  

  onSubmit() {
    if (this.homeform.valid) {
      // Recupero il FormArray 'days' dal FormGroup
      const daysFormArray = this.homeform.get('days') as FormArray;
      // Utilizzo getRawValue() per ottenere tutti i dati del form, inclusi i campi disabilitati
      const formData = daysFormArray.getRawValue();
      console.log(formData);
     }
  }
}
