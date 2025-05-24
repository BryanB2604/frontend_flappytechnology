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
        this.productsHome = res.data;
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
        this.products = res.data;
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

    this.productsFiltrados = resultado;
    this.mostrarProductoNoEncontrado = this.productsFiltrados.length === 0;
  }

  buscarProducto() {
    this.aplicarFiltros();
  }

  openModal(product: any) {
    this.selectedProduct = product;
    this.cantidadElegida = 1;
    this.showModal = true;
    this.clearTimeoutModal();
    this.timeoutModal = setTimeout(() => {
      this.closeModal();
    }, 5 * 60 * 1000);
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
    if (!this.selectedProduct || !this.user?.id_user) return;
    if (this.cantidadElegida < 1 || this.cantidadElegida > this.selectedProduct.cantidad_disponible) return;

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

    this.guardarCarritoLocalStorage();
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
      item.elegido = item.cantidad_disponible;
    } else {
      item.elegido = nuevaCantidad;
    }
    this.guardarCarritoLocalStorage();
  }

  removeFromCart(index: number) {
    this.carrito.splice(index, 1);
    this.guardarCarritoLocalStorage();
  }

  reservar() {
    if (this.carrito.length === 0) return;
    for (let item of this.carrito) {
      if (item.elegido > item.cantidad_disponible || item.elegido < 1) return;
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
          }, 5 * 60 * 1000);
        }
      },
      error: (err) => {}
    });
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
          this.guardarCarritoLocalStorage();  // Mantener el carrito para reintentar reserva
        }
      },
      error: (err) => {}
    });
  }

  cerrarCarrito() {
    this.mostrarCarrito = false;
  }

  isReservaValida(): boolean {
    if (this.carrito.length === 0) return false;
    return this.carrito.every(item => item.elegido >= 1 && item.elegido <= item.cantidad_disponible);
  }

  guardarCarritoLocalStorage() {
    localStorage.setItem('carrito', JSON.stringify(this.carrito));
  }
}
