import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardSuperAdminComponent {

  vistaSeleccionada: 'ventas' | 'usuarios' | 'general' = 'general';

  seleccionarVista(vista: 'ventas' | 'usuarios' | 'general' ): void {
    this.vistaSeleccionada = vista;
  }
  
}
