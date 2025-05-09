import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardUserComponent implements OnInit {

  products: any[] = [];
  carrito: any[] = [];
  user: any;

  showModal = false;
  selectedProduct: any = null;
  cantidadElegida: number = 1;
  codigoCompra: string | null = null;
  mostrarCarrito = false;

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    const userFromStorage = localStorage.getItem('usuario');
    this.user = userFromStorage ? JSON.parse(userFromStorage) : null;
    this.getProduct();
  }

  getProduct() {
    this.api.getProductFront().subscribe({
      next: (res) => {
        this.products = res.data;
      },
      error: (err) => {}
    });
  }

  openModal(product: any) {
    this.selectedProduct = product;
    this.cantidadElegida = 1;
    this.showModal = true;
  }

  closeModal() {
    this.selectedProduct = null;
    this.showModal = false;
  }

  addToCart() {
    if (this.cantidadElegida > 0 && this.selectedProduct) {
      const productoCarrito = {
        id_user: this.user.id_user,
        id_prod: this.selectedProduct.id_prod,
        id_stock: this.selectedProduct.id_stock,
        valor_unitario: this.selectedProduct.valor_unitario,
        elegido: this.cantidadElegida,
        nom_prod: this.selectedProduct.nom_prod
      };
      this.carrito.push(productoCarrito);
      this.closeModal();
    }
  }

  toggleCarrito() {
    this.mostrarCarrito = !this.mostrarCarrito;
  }

  calcularTotal(): number {
    return this.carrito.reduce((acc, item) => acc + item.valor_unitario * item.elegido, 0);
  }

  actualizarCantidad(index: number, nuevaCantidad: number) {
    if (nuevaCantidad > 0) {
      this.carrito[index].elegido = nuevaCantidad;
    }
  }

  removeFromCart(index: number) {
    this.carrito.splice(index, 1);
  }

  reservar() {
    if (this.carrito.length === 0) {
      alert('El carrito está vacío.');
      return;
    }

    this.api.postReserva(this.carrito).subscribe({
      next: (res: any) => {
        if (res.code === 200 && res.data?.cod_compra) {
          this.codigoCompra = res.data.cod_compra;
          alert(`Productos reservados correctamente. Código de compra: ${this.codigoCompra}`);
          this.carrito = [];
          this.mostrarCarrito = false;
        } else {
          alert('Error inesperado en la respuesta del servidor.');
        }
      },
      error: (err) => {
        alert('Error al reservar productos');
      }
    });
  }

  confirmarCompra() {
    if (!this.codigoCompra) {
      alert('No hay código de compra disponible.');
      return;
    }

    this.api.confirmReserve(this.codigoCompra).subscribe({
      next: (res) => {
        if (res.code === 200) {
          alert('Compra confirmada con éxito.');
          this.codigoCompra = null;
        } else {
          alert('No se pudo confirmar la compra.');
        }
      },
      error: (err) => {
        alert('Error al confirmar la compra.');
      }
    });
  }
}
