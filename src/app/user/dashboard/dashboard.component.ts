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
  cantidadElegida = 1;
  codigoCompra: string | null = null;
  mostrarCarrito = false;

  timeoutModal: any;
  timeoutCodigoCompra: any;

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
    this.cantidadElegida = 1;
    this.showModal = true;
    this.clearTimeoutModal();
    this.timeoutModal = setTimeout(() => {
      this.closeModal();
    }, 5 * 60 * 1000); // 5 minutos
  }

  closeModal() {
    this.selectedProduct = null;
    this.showModal = false;
    this.clearTimeoutModal();
  }

  clearTimeoutModal() {
    if (this.timeoutModal) {
      clearTimeout(this.timeoutModal);
      this.timeoutModal = null;
    }
  }

  clearTimeoutCodigoCompra() {
    if (this.timeoutCodigoCompra) {
      clearTimeout(this.timeoutCodigoCompra);
      this.timeoutCodigoCompra = null;
    }
  }

  validarCantidadModal() {
    if (!this.selectedProduct) return;
    if (this.cantidadElegida < 1) this.cantidadElegida = 1;
    if (this.cantidadElegida > this.selectedProduct.cantidad_disponible)
      this.cantidadElegida = this.selectedProduct.cantidad_disponible;
  }

  addToCart() {
    if (!this.selectedProduct) return;
    if (this.cantidadElegida < 1 || this.cantidadElegida > this.selectedProduct.cantidad_disponible) {
      alert(`Cantidad inválida. Disponible: ${this.selectedProduct.cantidad_disponible}`);
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
      alert(`No puedes seleccionar más de ${item.cantidad_disponible} unidades de "${item.nom_prod}"`);
      item.elegido = item.cantidad_disponible;
    } else {
      item.elegido = nuevaCantidad;
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
    for (let item of this.carrito) {
      if (item.elegido > item.cantidad_disponible) {
        alert(`La cantidad seleccionada para el producto "${item.nom_prod}" supera el stock disponible (${item.cantidad_disponible}).`);
        return;
      }
      if (item.elegido < 1) {
        alert(`La cantidad seleccionada para el producto "${item.nom_prod}" no puede ser menor a 1.`);
        return;
      }
    }
    this.api.postReserva(this.carrito).subscribe({
      next: (res: any) => {
        if (res.code === 200 && res.data?.cod_compra) {
          this.codigoCompra = res.data.cod_compra;
          alert(`Productos reservados correctamente. Código de compra: ${this.codigoCompra}`);
          this.carrito = [];
          this.mostrarCarrito = false;
          this.getProduct();

          this.clearTimeoutCodigoCompra();
          this.timeoutCodigoCompra = setTimeout(() => {
            this.codigoCompra = null;
            alert('Tiempo de reserva agotado. El código ha expirado.');
          }, 5 * 60 * 1000); // 5 minutos
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
          this.clearTimeoutCodigoCompra();
          this.getProduct();
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

  cancelarCompra() {
    if (!this.codigoCompra) {
      return;
    }
    this.api.cancelarReserve(this.codigoCompra).subscribe({
      next: (res) => {
        if (res.code === 200) {
          alert('Compra cancelada automáticamente.');
          this.codigoCompra = null;
          this.clearTimeoutCodigoCompra();
          this.getProduct();
          this.verificarCarritoVacioTrasCancelar();
        } else {
          alert('No se pudo cancelar la compra.');
        }
      },
      error: (err) => {
        alert('Error al cancelar la compra.');
        console.error(err);
      }
    });
  }

  verificarCarritoVacioTrasCancelar() {
    if (this.carrito.length === 0 && !this.codigoCompra) {
      alert('Se agotó el tiempo para reservar el producto.');
      this.cerrarCarrito();
    }
  }

  cerrarCarrito() {
    this.mostrarCarrito = false;
  }

  isReservaValida(): boolean {
    if (this.carrito.length === 0) return false;
    return this.carrito.every(item => item.elegido >= 1 && item.elegido <= item.cantidad_disponible);
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
      this.mostrarProductoNoEncontrado = false;
      this.products = [productoEncontrado];
    } else {
      this.mostrarProductoNoEncontrado = true;
      this.products = [];
    }
  }
}
