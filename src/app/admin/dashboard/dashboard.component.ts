import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  vistaSeleccionada: 'ventas' | 'general' = 'general';

  seleccionarVista(vista: 'ventas' | 'general'): void {
    this.vistaSeleccionada = vista;
  }

}
