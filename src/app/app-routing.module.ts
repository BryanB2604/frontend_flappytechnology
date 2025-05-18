import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Importa tus componentes
import { HomeComponent } from './store/home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { DashboardSuperAdminComponent } from './superadmin/dashboard/dashboard.component';
import { DashboardUserComponent } from './user/dashboard/dashboard.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { WhoareweComponent } from './core/whoarewe/whoarewe.component';
import { StoreComponent } from './core/store/store.component';
import { BeginComponent } from './core/begin/begin.component';

const routes: Routes = [
  { path: '', component: BeginComponent },
  { path: 'login', component: LoginComponent }, 
  { path: 'register', component: RegisterComponent }, 
  { path: 'admin', component: DashboardComponent }, 
  { path: 'superadmin', component: DashboardSuperAdminComponent }, 
  { path: 'user', component: DashboardUserComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'quienes-somos', component: WhoareweComponent },
  { path: 'tienda', component: StoreComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule] 
})
export class AppRoutingModule { }
