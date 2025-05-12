import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardUserComponent implements OnInit {
  products: any[] = [];
  carrito: any[] = [];
  user: any;
  busqueda: string = '';
  mostrarProductoNoEncontrado: boolean = false;

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
      error: (err) => {
        console.error('Error al obtener productos:', err);
      }
    });
  }

  openModal(product: any) {
    this.selectedProduct = product;
    this.cantidadElegida = product?.cantidad_disponible || 1;
    this.showModal = true;
  }

  closeModal() {
    this.selectedProduct = null;
    this.showModal = false;
  }

  addToCart() {
    if (this.cantidadElegida > 0 && this.selectedProduct) {
      if (this.cantidadElegida > this.selectedProduct.cantidad_disponible) {
        alert(`La cantidad seleccionada supera el stock disponible (${this.selectedProduct.cantidad_disponible}).`);
        return;
      }

      const index = this.carrito.findIndex(item =>
        item.id_prod === this.selectedProduct.id_prod &&
        item.id_stock === this.selectedProduct.id_stock
      );

      if (index !== -1) {
        const nuevaCantidad = this.carrito[index].elegido + this.cantidadElegida;
        this.carrito[index].elegido = Math.min(nuevaCantidad, this.selectedProduct.cantidad_disponible);
      } else {
        const productoCarrito = {
          id_user: this.user.id_user,
          id_prod: this.selectedProduct.id_prod,
          id_stock: this.selectedProduct.id_stock,
          valor_unitario: this.selectedProduct.valor_unitario,
          elegido: this.cantidadElegida,
          nom_prod: this.selectedProduct.nom_prod,
          cantidad_disponible: this.selectedProduct.cantidad_disponible
        };
        this.carrito.push(productoCarrito);
      }

      this.closeModal();
      this.checkCarrito();
    }
  }

  toggleCarrito() {
    this.mostrarCarrito = !this.mostrarCarrito;
  }

  calcularTotal(): number {
    return this.carrito.reduce((acc, item) => acc + item.valor_unitario * item.elegido, 0);
  }

  actualizarCantidad(index: number, nuevaCantidad: number) {
    const item = this.carrito[index];
    if (nuevaCantidad < 1) {
      item.elegido = 1;
    } else if (nuevaCantidad > item.cantidad_disponible) {
      item.elegido = item.cantidad_disponible;
    } else {
      item.elegido = nuevaCantidad;
    }

    this.checkCarrito();
  }

  removeFromCart(index: number) {
    this.carrito.splice(index, 1);
    this.checkCarrito();
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
        alert('Error al reservar productos.');
        console.error(err);
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
        console.error(err);
      }
    });
  }

  cerrarCarrito() {
    this.mostrarCarrito = false;
  }

  validarCantidad() {
    if (this.cantidadElegida.toString().length > 3) {
      this.cantidadElegida = Number(this.cantidadElegida.toString().slice(0, 3));
    }

    if (this.cantidadElegida > this.selectedProduct?.cantidad_disponible) {
      this.cantidadElegida = this.selectedProduct?.cantidad_disponible;
    }

    if (this.cantidadElegida < 1) {
      this.cantidadElegida = 1;
    }
  }

  validarCantidadCarrito(index: number) {
    const item = this.carrito[index];

    if (item.elegido > item.cantidad_disponible) {
      item.elegido = item.cantidad_disponible;
    }

    if (item.elegido < 1) {
      item.elegido = 1;
    }
  }

  checkCarrito() {
    if (this.carrito.length === 0) {
      this.mostrarCarrito = false;
    }
  }

  buscarProducto() {
    const nombreBuscado = this.busqueda.trim().toLowerCase();

    if (!nombreBuscado) {
      alert('Ingresa un nombre para buscar.');
      return;
    }

    const productoEncontrado = this.products.find(product =>
      product.nom_prod.toLowerCase().includes(nombreBuscado)
    );

    if (productoEncontrado) {
      this.openModal(productoEncontrado);
    } else {
      this.mostrarProductoNoEncontrado = true;
      setTimeout(() => {
        this.mostrarProductoNoEncontrado = false;
      }, 3000); 
    }

    this.busqueda = '';
  }
}
