import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/app.service'; 
import { Router } from '@angular/router';

export interface Product {
  id_prod: number;
  nom_prod: string;
  descripcion: string;
  valor_unitario: number;
  proveedor: string;
  img: string;
}

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  products: Product[] = []; 

  constructor(private api: ApiService,  private router: Router) {}

  ngOnInit() {
    this.getProduct();
  }

  getProduct() {
    this.api.getProduct().subscribe({
      next: (res) => {
        this.products = res.data;
        console.log('Productos cargados:', this.products);
      },
      error: (err) => {
        console.error('Error al obtener productos', err);
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
