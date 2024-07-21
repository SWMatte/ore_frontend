import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ApiService } from 'src/app/service/apiCalendar.service';
import { DayMonth } from 'src/app/classes/DayMonth';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { HourWorkedDTO } from 'src/app/classes/HourWorkedDTO';
import { User } from 'src/app/classes/User';
import { Company } from 'src/app/classes/Company';
import { DayWorkedDTO } from 'src/app/classes/DayWorkedDTO';
import { HourWorkedService } from 'src/app/service/hour-worked.service';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ExcelService } from 'src/app/service/excel.service';
import * as FileSaver from 'file-saver'; // npm install --save-dev @types/file-saver  || npm install file-saver
import * as saveAs from 'file-saver';

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
export class CalendarComponent implements OnInit {
  daysOfMonth$!: Observable<DayMonth[]>;
  selectedDate: Date | null;
  homeform!: FormGroup;
  hours: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  places: string[] = ['SEDE', 'SMART_WORKING', 'SEDE_CLIENTE'];
  totalHoursWorked: number = 0;
  totalIllnessHours: number = 0;
  totalHoliday: number = 0;
  totalDayOff: number = 0;
  totalMonthHour: number = 0;
  viewTotal: boolean = false;
  dataSent: boolean = false;
  selectedMonth!: number;

  constructor(
    private apiService: ApiService,
    private hourWorkedService: HourWorkedService,
    private messageButton: MatSnackBar,
    private router: Router,
    private excel: ExcelService
  ) {
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
    days.forEach((day) => {
      // Verifico se il giorno è sabato o domenica e imposto il valore di default a 0
      const isWeekend =
        day.day.toLowerCase() === 'sabato' ||
        day.day.toLowerCase() === 'domenica';

      daysFormArray.push(
        new FormGroup({
          day: new FormControl({ value: day.day, disabled: true }), // Campo giorno non modificabile
          number: new FormControl({ value: day.number, disabled: true }), // Campo numero non modificabile
          hoursWorked: new FormControl(isWeekend ? 0 : null), // campo per il weekend default 0
          places: new FormControl(this.places[0]),
          illnessHours: new FormControl(0),
          holiday: new FormControl(0),
          dayOff: new FormControl(0),
          note: new FormControl(null),
        })
      );
    });

    this.calculateTotals(); // richiamo il metodo che mi fa la somma delle ore
  }

  dateSelected(event: MatDatepickerInputEvent<Date>) {
    // Metodo evento che recupera la data e l'anno selezionati dall'HTML
    this.selectedDate = event.value;

    if (this.selectedDate) {
      // Recupero mese e anno dalla data selezionata
      const month: number = this.selectedDate.getMonth() + 1;
      this.selectedMonth = month;
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
    this.totalMonthHour =
      this.totalHoursWorked +
      this.totalIllnessHours +
      this.totalHoliday +
      this.totalDayOff;
    this.viewTotal = this.totalMonthHour > 0; // Imposta viewTotal a true se ci sono ore totali maggiori di zero
  }

  // questo metodo permette di ottenere il dto che accetta il backend
  splitDate(dateString: string): {
    dayNumber: string;
    month: string;
    year: string;
  } {
    const [dayNumber, month, year] = dateString.split('-');
    return { dayNumber, month, year };
  }

  onSubmit() {
    if (this.homeform.valid) {
      // se il form è valido disabilito i campi
      this.setFormDisabled(true);
      // Recupero il FormArray 'days' dal FormGroup
      const daysFormArray = this.homeform.get('days') as FormArray;

      // Array per contenere gli oggetti HourWorkedDTO
      const hourWorkedDTOArray: HourWorkedDTO[] = [];

      // Popola l'array con i dati dal form
      daysFormArray.controls.forEach((control) => {
        const group = control as FormGroup;

        const dateParts = this.splitDate(group.get('number')?.value || '');
        const dto = new HourWorkedDTO(
          dateParts.month,
          group.get('day')?.value || '',
          dateParts.dayNumber,
          dateParts.year,
          group.get('hoursWorked')?.value || 0,
          group.get('note')?.value || '',
          group.get('places')?.value || '',
          group.get('illnessHours')?.value || 0,
          group.get('holiday')?.value || 0,
          group.get('dayOff')?.value || 0
        );
        hourWorkedDTOArray.push(dto);
      });

      // Costruisci la classe DayWorkedDTO e inviala al backend
      this.buildHoursClass(hourWorkedDTOArray);
    }
  }

  // costruisco la classe da mandare al backend
  buildHoursClass(hourWorkedDTOArray: HourWorkedDTO[]) {
    const company = new Company(sessionStorage.getItem('idCompany') || '');
    const user = new User(sessionStorage.getItem('idUser') || '');

    const dto: DayWorkedDTO = new DayWorkedDTO(
      hourWorkedDTOArray,
      user,
      company
    );

    this.sendData(dto);
  }

  async sendData(dto: DayWorkedDTO) {
    try {
      const response = await firstValueFrom(
        this.hourWorkedService.sendHoursWorked(dto)
      );

      if (response.status == 200) {
        this.dataSent = true;

        if (this.dataSent) {
          this.openSnackBar('Calendar registrato con successo', 'chiudi');
        }
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  setFormDisabled(disabled: boolean): void {
    // dopo che invio il form disabilito i campi
    const daysFormArray = this.homeform.get('days') as FormArray;

    daysFormArray.controls.forEach((control) => {
      const group = control as FormGroup;

      // per ogni campo verifico com'è lo stato di disable e nel caso attivo o disattivo il singolo valore di input, viene verificato dopo che nel submit il form e' valido
      group.get('day')?.[disabled ? 'disable' : 'enable']();
      group.get('number')?.[disabled ? 'disable' : 'enable']();
      group.get('hoursWorked')?.[disabled ? 'disable' : 'enable']();
      group.get('places')?.[disabled ? 'disable' : 'enable']();
      group.get('illnessHours')?.[disabled ? 'disable' : 'enable']();
      group.get('holiday')?.[disabled ? 'disable' : 'enable']();
      group.get('dayOff')?.[disabled ? 'disable' : 'enable']();
      group.get('note')?.[disabled ? 'disable' : 'enable']();
    });
  }

  //apri messaggino dopo aver inviato form
  openSnackBar(message: string, action: string) {
    this.messageButton.open(message, action, {
      duration: 3000,
    });
  }

  async generaExcel(numero: number) { // questo metodo dopo aver importato le librerie permette di andare a salvare un file in formato xml che è il report preso da db
    try {
        const monthString = numero.toString();
       const data = await firstValueFrom(this.excel.getExcel(monthString))
       saveAs(data,`export_${monthString}.xlsx`)
           setTimeout(() => {
            /* setta un ritardo di 3 se e dopo ti sposta*/
            this.router.navigate(['/home']);
          }, 3000);

    } catch (error) {
      console.log(error)
    }
  }
}
