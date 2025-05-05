import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; 
import { provideHttpClient } from '@angular/common/http';  
import { TreeTableModule } from 'primeng/treetable';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './store/home/home.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { NavComponent } from './core/nav/nav.component';
import { DashboardSuperAdminComponent } from './superadmin/dashboard/dashboard.component';
import { DashboardUserComponent } from './user/dashboard/dashboard.component';
import { SocketComponent } from './core/socket/socket.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    DashboardComponent,
    NavComponent,
    DashboardSuperAdminComponent,
    DashboardUserComponent,
    SocketComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TreeTableModule
  ],
  providers: [
    provideHttpClient()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
