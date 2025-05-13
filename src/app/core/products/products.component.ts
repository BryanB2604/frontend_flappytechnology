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
  mensajeVisible: boolean = false;
  errorVisible: boolean = false;

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
      error: (err) => {
        console.error('Error al obtener productos', err);
        this.showErrorMessage('Error al obtener los productos.');
      }
    });
  }

  createProduct(): void {
    const form = this.createForm.value;

    if (!form.nombre || !form.descripcion || form.valor_unitario <= 0 || !form.proveedor) {
      this.showErrorMessage('Todos los campos son obligatorios.');
      return;
    }

    const nombreDuplicado = this.products.some(p =>
      (p.nom_prod || '').trim().toLowerCase() === form.nombre.trim().toLowerCase()
    );

    if (nombreDuplicado) {
      this.showErrorMessage('Ya existe un producto con ese nombre.');
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
        this.showSuccessMessage('Producto creado exitosamente.');
      },
      error: (err) => {
        console.error('Error al crear producto', err);
        this.showErrorMessage('Error al crear el producto.');
      }
    });
  }

  updateProduct(): void {
    const form = this.editForm.value;
    const productoExiste = this.products.find(p => p.id_prod === form.id_prod);

    if (!productoExiste) {
      this.showErrorMessage(`No se encontró el producto con ID ${form.id_prod}.`);
      return;
    }

    const nombreDuplicado = this.products.some(
      p => (p.nom_prod || '').trim().toLowerCase() === form.nombre.trim().toLowerCase() && p.id_prod !== form.id_prod
    );

    if (nombreDuplicado) {
      this.showErrorMessage('Ya existe otro producto con ese nombre.');
      return;
    }

    if (confirm('¿Estás seguro de actualizar este producto?')) {
      this.api.updateProduct(
        form.id_prod,
        form.nombre,
        form.descripcion,
        form.valor_unitario,
        form.proveedor,
        productoExiste.img
      ).subscribe({
        next: () => {
          this.getProduct();
          this.editForm.reset();
          this.showSuccessMessage('Producto actualizado exitosamente.');
        },
        error: (err) => {
          console.error('Error al actualizar producto', err);
          this.showErrorMessage('Error al actualizar el producto.');
        }
      });
    }
  }

  deleteProduct(id: number): void {
    const productoExiste = this.products.find(p => p.id_prod === id);

    if (!productoExiste) {
      this.showErrorMessage(`No se encontró el producto con ID ${id}.`);
      return;
    }

    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.api.deleteProduct(id).subscribe({
        next: () => {
          this.getProduct();
          this.deleteForm.reset();
          this.showSuccessMessage('Producto eliminado correctamente.');
        },
        error: (err) => {
          console.error('Error al eliminar producto', err);
          this.showErrorMessage('Error al eliminar el producto.');
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
          this.showErrorMessage(`Producto con ID ${id} no encontrado.`);
        }
      },
      error: (err) => {
        console.error('Error al buscar producto', err);
        this.search = {};
        this.productoEncontrado = false;
        this.showErrorMessage('Ocurrió un error al buscar el producto.');
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

  showSuccessMessage(mensaje: string): void {
    this.mensaje = mensaje;
    this.mensajeVisible = true;
    setTimeout(() => {
      this.mensajeVisible = false;
      this.mensaje = '';
    }, 3000);
  }

  showErrorMessage(error: string): void {
    this.error = error;
    this.errorVisible = true;
    setTimeout(() => {
      this.errorVisible = false;
      this.error = '';
    }, 3000);
  }
}
