import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/app.service';
import { TreeNode } from 'primeng/api';
import { FormBuilder, FormGroup } from '@angular/forms';

export interface Product {
  id_prod: number;
  nombre: string;
  descripcion: string;
  valor_unitario: number;
  proveedor: string;
}

@Component({
  selector: 'app-socket',
  standalone: false,
  templateUrl: './socket.component.html',
  styleUrls: ['./socket.component.css']
})
export class SocketComponent implements OnInit {
  files: TreeNode[] = [];
  products: Product[] = [];

  createForm!: FormGroup;
  editForm!: FormGroup;
  deleteForm!: FormGroup;
  buscarForm!: FormGroup;

  error: string | undefined;
  mensaje: string | undefined;
  productoEncontrado: Product | undefined;  // Para almacenar el producto encontrado

  filterOptionsVisible: boolean = false; // Controla la visibilidad de las opciones de filtro
  selectedFilter: string = ''; // Almacena el filtro seleccionado

  constructor(private api: ApiService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.getProduct();
    this.initForms();
  }

  initForms(): void {
    this.createForm = this.fb.group({
      nombre: [''],
      descripcion: [''],
      valor_unitario: [0],
      proveedor: ['']
    });

    this.editForm = this.fb.group({
      id_prod: [0],
      nombre: [''],
      descripcion: [''],
      valor_unitario: [0],
      proveedor: ['']
    });

    this.deleteForm = this.fb.group({
      id_prod: [0]
    });

    this.buscarForm = this.fb.group({
      id_prod: [0]
    });
  }

  getProduct(): void {
    this.api.getProduct().subscribe({
      next: (res) => {
        this.products = res.data;
      },
      error: (err) => console.error('Error al obtener productos', err)
    });
  }

  // Método para alternar la visibilidad de las opciones de filtro
  toggleFilterOptions(): void {
    this.filterOptionsVisible = !this.filterOptionsVisible;
  }

  // Método para seleccionar qué filtro mostrar
  selectFilter(filter: string): void {
    this.selectedFilter = filter;
  }

  // Crear un nuevo producto
  createProduct(): void {
    const form = this.createForm.value;
    const nombreDuplicado = this.products.some(p =>
      p.nombre.trim().toLowerCase() === form.nombre.trim().toLowerCase()
    );

    if (nombreDuplicado) {
      this.error = 'Ya existe un producto con ese nombre.';
      this.mensaje = '';
      return;
    }

    this.api.createProduct(form.nombre, form.descripcion, form.valor_unitario, form.proveedor).subscribe({
      next: () => {
        this.getProduct();
        this.createForm.reset();
        this.error = '';
        this.mensaje = 'Producto creado exitosamente.';
      },
      error: (err) => {
        console.error('Error al crear producto', err);
        this.error = 'Error al crear el producto.';
        this.mensaje = '';
      }
    });
  }

  // Actualizar un producto
  updateProduct(): void {
    const form = this.editForm.value;
    const productoExiste = this.products.find(p => p.id_prod === form.id_prod);

    if (!productoExiste) {
      this.error = `No se encontró el producto con ID ${form.id_prod}.`;
      this.mensaje = '';
      return;
    }

    const nombreDuplicado = this.products.some(
      p => p.nombre.trim().toLowerCase() === form.nombre.trim().toLowerCase() && p.id_prod !== form.id_prod
    );

    if (nombreDuplicado) {
      this.error = 'Ya existe otro producto con ese nombre.';
      this.mensaje = '';
      return;
    }

    this.api.updateProduct(form.id_prod, form.nombre, form.descripcion, form.valor_unitario, form.proveedor).subscribe({
      next: () => {
        this.getProduct();
        this.editForm.reset();
        this.error = '';
        this.mensaje = 'Producto actualizado correctamente.';
      },
      error: (err) => {
        console.error('Error al actualizar producto', err);
        this.error = 'Error al actualizar el producto.';
        this.mensaje = '';
      }
    });
  }

  // Eliminar un producto
  deleteProduct(id: number): void {
    const productoExiste = this.products.find(p => p.id_prod === id);

    if (!productoExiste) {
      this.error = `No se encontró el producto con ID ${id}.`;
      this.mensaje = '';
      return;
    }

    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.api.deleteProduct(id).subscribe({
        next: () => {
          this.getProduct();
          this.deleteForm.reset();
          this.error = '';
          this.mensaje = 'Producto eliminado correctamente.';
        },
        error: (err) => {
          console.error('Error al eliminar producto', err);
          this.error = 'Error al eliminar el producto.';
          this.mensaje = '';
        }
      });
    }
  }

  // Buscar producto por ID
  buscarProductoPorId(id: number): void {
    const producto = this.products.find(p => p.id_prod === id);
    if (producto) {
      this.mensaje = `Producto encontrado: ${producto.nombre} - ${producto.descripcion}`;
      this.error = '';
    } else {
      this.error = `No se encontró el producto con ID ${id}.`;
      this.mensaje = '';
    }
  }
}
