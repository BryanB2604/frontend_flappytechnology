import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/app.service'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardUserComponent {

  products: any[] = []; 

  constructor(private api: ApiService,  private router: Router) {}

  ngOnInit() {
    this.getProduct();
  }

  getProduct() {
    this.api.getProductFront().subscribe({
      next: (res) => {
        this.products = res.data;
        console.log('Productos cargados:', this.products);
      },
      error: (err) => {
        console.error('Error al obtener productos', err);
      }
    });
  }

}
