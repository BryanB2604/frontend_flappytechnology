import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardSuperAdminComponent {

  vistaSeleccionada: 'productos' | 'ventas' | 'usuarios' | 'socket' | 'general' = 'productos';

  seleccionarVista(vista: 'productos' | 'ventas' | 'usuarios' | 'socket' | 'general'): void {
    this.vistaSeleccionada = vista;
  }
  
}
