import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/app.service';
import { FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-general',
  standalone: false,
  templateUrl: './general.component.html',
  styleUrl: './general.component.css'
})
export class GeneralComponent {

  products: any[] = [];

  constructor(private api: ApiService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.getProduct();
  }

  getProduct(): void {
    this.api.getProductFront().subscribe({
      next: (res) => {
        this.products = res.data;
        console.log(this.products)
      },
      error: (err) => console.error('Error al obtener productos', err)
    });
  }

}

