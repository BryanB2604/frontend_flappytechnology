import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TreeTableModule } from 'primeng/treetable';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'; 

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
import { ProductsComponent } from './core/products/products.component';
import { UsersComponent } from './core/users/users.component';
import { SalesComponent } from './core/sales/sales.component';
import { GeneralComponent } from './core/general/general.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { FooterComponent } from './core/footer/footer.component';
import { WhoareweComponent } from './core/whoarewe/whoarewe.component';
import { StoreComponent } from './core/store/store.component';
import { BeginComponent } from './core/begin/begin.component';

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
    SocketComponent,
    ProductsComponent,
    UsersComponent,
    SalesComponent,
    GeneralComponent,
    ResetPasswordComponent,
    FooterComponent,
    WhoareweComponent,
    StoreComponent,
    BeginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TreeTableModule,
    CommonModule
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()) 
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
