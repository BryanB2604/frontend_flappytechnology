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
  cantidad_total: number; // asegúrate que venga del backend para stock
}

@Component({
  selector: 'app-store',
  standalone: false,
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent implements OnInit {
  productsHome: Product[] = [];
  products: any[] = [];
  productsFiltrados: any[] = [];
  carrito: any[] = [];
  user: any;
  busqueda: string = '';
  mostrarProductoNoEncontrado: boolean = false;

  filtroPrecioMin: number | null = null;
  filtroPrecioMax: number | null = null;
  ordenAlfabetico: string = '';

  showModal = false;
  selectedProduct: any = null;
  cantidadElegida = 1;
  codigoCompra: string | null = null;
  mostrarCarrito = false;

  timeoutModal: any;
  timeoutCodigoCompra: any;

  mensajeError: string | null = null; // Mensajes claros para usuario
  mensajeReservaError: string | null = null;

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.getProductHome();
    const userFromStorage = localStorage.getItem('usuario');
    this.user = userFromStorage ? JSON.parse(userFromStorage) : null;
    this.getProduct();

    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      this.carrito = JSON.parse(carritoGuardado);
    }
  }

  getProductHome() {
    this.api.getProductFront().subscribe({
      next: (res) => {
        this.productsHome = res.data.filter((p: any) => p.cantidad_total > 0);
      },
      error: (err) => {}
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  getProduct() {
    this.api.getProductFront().subscribe({
      next: (res) => {
        this.products = res.data.filter((p: any) => p.cantidad_total > 0);
        this.productsFiltrados = [...this.products];
      },
      error: (err) => {}
    });
  }

  aplicarFiltros() {
    let resultado = [...this.products];

    if (this.busqueda.trim() !== '') {
      const nombreBuscado = this.busqueda.trim().toLowerCase();
      resultado = resultado.filter(product =>
        product.nom_prod.toLowerCase().includes(nombreBuscado)
      );
    }

    if (this.filtroPrecioMin != null) {
      resultado = resultado.filter(product =>
        product.valor_unitario >= this.filtroPrecioMin!
      );
    }

    if (this.filtroPrecioMax != null) {
      resultado = resultado.filter(product =>
        product.valor_unitario <= this.filtroPrecioMax!
      );
    }

    if (this.ordenAlfabetico === 'asc') {
      resultado.sort((a, b) => a.nom_prod.localeCompare(b.nom_prod));
    } else if (this.ordenAlfabetico === 'desc') {
      resultado.sort((a, b) => b.nom_prod.localeCompare(a.nom_prod));
    }

    // Filtrar productos sin stock incluso luego del filtro
    this.productsFiltrados = resultado.filter(p => p.cantidad_total > 0);

    this.mostrarProductoNoEncontrado = this.productsFiltrados.length === 0;
  }

  buscarProducto() {
    this.aplicarFiltros();
  }

  openModal(product: any) {
    this.selectedProduct = product;
    this.cantidadElegida = 1;
    this.mensajeError = null;
    this.showModal = true;
    this.clearTimeoutModal();
    this.timeoutModal = setTimeout(() => {
      this.closeModal();
    }, 5 * 60 * 1000); // 5 minutos
  }

  closeModal() {
    this.selectedProduct = null;
    this.cantidadElegida = 1;
    this.mensajeError = null;
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

  validarCantidadModal(): void {
    if (!this.selectedProduct) return;

    if (this.cantidadElegida < 1) {
      this.cantidadElegida = 1;
    } else if (this.cantidadElegida > this.selectedProduct.cantidad_total) {
      this.cantidadElegida = this.selectedProduct.cantidad_total;
    }
  }

  isReservaValida(): boolean {
    if (!this.carrito.length) return false;

    return this.carrito.every(item =>
      item.elegido >= 1 &&
      item.elegido <= item.cantidad_total &&
      item.cantidad_total > 0
    );
  }

  addToCart() {
    this.mensajeError = null;
    if (!this.selectedProduct) {
      this.mensajeError = 'No hay producto seleccionado.';
      return;
    }
    if (!this.user?.id_user) {
      this.mensajeError = 'Debe iniciar sesión para agregar productos al carrito.';
      return;
    }
    if (this.cantidadElegida < 1) {
      this.mensajeError = 'La cantidad debe ser al menos 1.';
      return;
    }
    if (this.cantidadElegida > this.selectedProduct.cantidad_total) {
      this.mensajeError = `La cantidad máxima disponible es ${this.selectedProduct.cantidad_total}.`;
      return;
    }
    if (this.selectedProduct.cantidad_total <= 0) {
      this.mensajeError = 'El producto no tiene stock disponible.';
      return;
    }

    const index = this.carrito.findIndex(item =>
      item.id_prod === this.selectedProduct.id_prod &&
      item.id_stock === this.selectedProduct.id_stock
    );

    if (index !== -1) {
      const nuevaCantidad = this.carrito[index].elegido + this.cantidadElegida;
      this.carrito[index].elegido = Math.min(nuevaCantidad, this.selectedProduct.cantidad_total);
    } else {
      const productoCarrito = {
        id_user: this.user.id_user,
        id_prod: this.selectedProduct.id_prod,
        id_stock: this.selectedProduct.id_stock,
        valor_unitario: this.selectedProduct.valor_unitario,
        elegido: this.cantidadElegida,
        nom_prod: this.selectedProduct.nom_prod,
        cantidad_total: this.selectedProduct.cantidad_total
      };
      this.carrito.push(productoCarrito);
    }

    this.guardarCarritoLocalStorage();
    this.closeModal();
  }

  actualizarCantidad(index: number, nuevaCantidad: number) {
    const item = this.carrito[index];
    if (nuevaCantidad < 1) {
      item.elegido = 1;
    } else if (nuevaCantidad > item.cantidad_total) {
      item.elegido = item.cantidad_total;
    } else {
      item.elegido = nuevaCantidad;
    }
    this.guardarCarritoLocalStorage();
  }

  reservar() {
    this.mensajeReservaError = null;

    if (this.carrito.length === 0) {
      this.mensajeReservaError = 'El carrito está vacío. Agregue productos antes de reservar.';
      this.limpiarMensajeErrorDespuesDe5Segundos();
      return;
    }

    for (let item of this.carrito) {
      if (item.elegido > item.cantidad_total || item.elegido < 1) {
        this.mensajeReservaError = `La cantidad elegida para "${item.nom_prod}" no es válida.`;
        this.limpiarMensajeErrorDespuesDe5Segundos();
        return;
      }
    }

    this.api.postReserva(this.carrito).subscribe({
      next: (res: any) => {
        if (res.code === 200 && res.data?.cod_compra) {
          this.codigoCompra = res.data.cod_compra;
          this.mostrarCarrito = false;
          this.getProduct();
          this.clearTimeoutCodigoCompra();
          this.timeoutCodigoCompra = setTimeout(() => {
            this.codigoCompra = null;
          }, 5 * 60 * 1000); // 5 minutos para limpiar código de compra
        } else {
          this.mensajeReservaError = res.msg || 'Error al realizar la reserva, intente de nuevo.';
          this.limpiarMensajeErrorDespuesDe5Segundos();
        }
      },
      error: (err) => {
        if (err.error && err.error.msg) {
          this.mensajeReservaError = err.error.msg;
        } else {
          this.mensajeReservaError = 'Error de red o servidor al reservar.';
        }
        this.limpiarMensajeErrorDespuesDe5Segundos();
      }
    });
  }

  limpiarMensajeErrorDespuesDe5Segundos() {
    setTimeout(() => {
      this.mensajeReservaError = null;
    }, 5000);
  }

  toggleCarrito() {
    this.mostrarCarrito = !this.mostrarCarrito;
  }

  calcularTotal(): number {
    return this.carrito.reduce((acc, item) => acc + item.valor_unitario * item.elegido, 0);
  }

  removeFromCart(index: number) {
    this.carrito.splice(index, 1);
    this.guardarCarritoLocalStorage();
  }

  confirmarCompra() {
    if (!this.codigoCompra) return;

    this.api.confirmReserve(this.codigoCompra).subscribe({
      next: (res) => {
        if (res.code === 200) {
          this.codigoCompra = null;
          this.clearTimeoutCodigoCompra();
          this.carrito = [];
          localStorage.removeItem('carrito');
          this.getProduct();
        }
      },
      error: (err) => {}
    });
  }

  cancelarCompra() {
    if (!this.codigoCompra) return;

    this.api.cancelarReserve(this.codigoCompra).subscribe({
      next: (res) => {
        if (res.code === 200) {
          this.codigoCompra = null;
          this.clearTimeoutCodigoCompra();
          this.getProduct();
          this.guardarCarritoLocalStorage();
        }
      },
      error: (err) => {}
    });
  }

  cerrarCarrito() {
    this.mostrarCarrito = false;
  }

  guardarCarritoLocalStorage() {
    localStorage.setItem('carrito', JSON.stringify(this.carrito));
  }
}
