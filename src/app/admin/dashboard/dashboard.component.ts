import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  vistaSeleccionada: 'productos' | 'ventas' = 'productos';

  seleccionarVista(vista: 'productos' | 'ventas') {
    this.vistaSeleccionada = vista;
  }

}
