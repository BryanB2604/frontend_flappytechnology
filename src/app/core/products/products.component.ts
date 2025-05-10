import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/app.service';
import { TreeNode } from 'primeng/api';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-products',
  standalone: false,
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {

  files: TreeNode[] = [];
  products: any[] = [];
  search: any = {};

  createForm!: FormGroup;
  editForm!: FormGroup;
  deleteForm!: FormGroup;
  buscarForm!: FormGroup;

  error: string | undefined;
  mensaje: string | undefined;

  filterOptionsVisible: boolean = false; 
  selectedFilter: string = ''; 
  productoEncontrado: boolean = false;

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
      proveedor: [''],
      img: ['']
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
        console.log(this.products);
      },
      error: (err) => console.error('Error al obtener productos', err)
    });
  }

  createProduct(): void {
    const form = this.createForm.value;

    if (!form.nombre || !form.descripcion || form.valor_unitario <= 0 || !form.proveedor) {
      this.error = 'Todos los campos son obligatorios.';
      this.mensaje = '';
      return;
    }

    const nombreDuplicado = this.products.some(p =>
      (p.nom_prod || '').trim().toLowerCase() === form.nombre.trim().toLowerCase()
    );

    if (nombreDuplicado) {
      this.error = 'Ya existe un producto con ese nombre.';
      this.mensaje = '';
      return;
    }

    this.api.createProduct(
      form.nombre,
      form.descripcion,
      form.valor_unitario,
      form.proveedor
    ).subscribe({
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

  updateProduct(): void {
    const form = this.editForm.value;
    const productoExiste = this.products.find(p => p.id_prod === form.id_prod);

    if (!productoExiste) {
      this.error = `No se encontró el producto con ID ${form.id_prod}.`;
      this.mensaje = '';
      return;
    }

    const nombreDuplicado = this.products.some(
      p => (p.nom_prod || '').trim().toLowerCase() === form.nombre.trim().toLowerCase() && p.id_prod !== form.id_prod
    );

    if (nombreDuplicado) {
      this.error = 'Ya existe otro producto con ese nombre.';
      this.mensaje = '';
      return;
    }

    if (confirm('¿Estás seguro de actualizar este producto?')) {
      this.api.updateProduct(
        form.id_prod,
        form.nombre,
        form.descripcion,
        form.valor_unitario,
        form.proveedor,
        productoExiste.img // reutilizar imagen si ya existe
      ).subscribe({
        next: () => {
          this.getProduct();
          this.editForm.reset();
          this.error = '';
        },
        error: (err) => {
          console.error('Error al actualizar producto', err);
          this.error = 'Error al actualizar el producto.';
          this.mensaje = '';
        }
      });
    }
  }

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
        },
        error: (err) => {
          console.error('Error al eliminar producto', err);
          this.error = 'Error al eliminar el producto.';
          this.mensaje = '';
        }
      });
    }
  }

  buscarProductoPorId(id: number): void {
    this.api.searchProduct(id).subscribe({
      next: (res) => {
        if (res && res.data) {
          this.search = res.data;
          this.productoEncontrado = true;
          this.error = '';
        } else {
          this.search = {};
          this.productoEncontrado = false;
          this.error = `Producto con ID ${id} no encontrado.`;
        }
      },
      error: (err) => {
        console.error('Error al buscar producto', err);
        this.search = {};
        this.productoEncontrado = false;
        this.error = 'Ocurrió un error al buscar el producto.';
      }
    });
  }

  toggleFilterOptions(): void {
    this.filterOptionsVisible = !this.filterOptionsVisible;

    if (!this.filterOptionsVisible) {
      this.selectedFilter = '';
    }
  }

  selectFilter(filter: string): void {
    this.selectedFilter = filter;
  }

}
