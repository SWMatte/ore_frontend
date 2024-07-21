import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule, NativeDateAdapter } from '@angular/material/core'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormComponent } from './components/form/form.component';  
import { CalendarComponent } from './components/calendar/calendar.component';
import { CompanyComponent } from './components/company/company.component';
import { UserComponent } from './components/user/user.component';
import { LoginComponent } from './components/login/login.component';
import { NavigationMenuComponent } from './components/navigation-menu/navigation-menu.component';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import{ ReactiveFormsModule} from'@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';  

 @NgModule({
  declarations: [AppComponent, HomeComponent, FormComponent, CalendarComponent,CompanyComponent,UserComponent,LoginComponent, NavigationMenuComponent ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    BrowserAnimationsModule,
    MatGridListModule,
    MatSidenavModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  providers: [
    { provide: NativeDateAdapter, useClass: NativeDateAdapter }, //per far funzionare il calendar
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
