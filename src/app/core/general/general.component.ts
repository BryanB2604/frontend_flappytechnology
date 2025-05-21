import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/app.service';

@Component({
  selector: 'app-general',
  standalone: false,
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css'],
})
export class GeneralComponent implements OnInit {
  products: any[] = [];
  createForm!: FormGroup;
  editForm!: FormGroup;
  mensaje?: string;
  error?: string;
  filterOptionsVisible = false;
  selectedFilter: string = '';
  mensajeVisible: boolean = false;
  errorVisible: boolean = false;

  constructor(private api: ApiService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.getProduct();
    this.initForms();
  }

  initForms(): void {
    this.createForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÑñ\\s]{1,30}$')]],
      descripcion: ['', [Validators.required, Validators.maxLength(300)]],
      valor_unitario: [0, [Validators.required, Validators.min(0), Validators.max(99999999)]],
      proveedor: ['', [Validators.required, Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÑñ\\s]{1,30}$')]],
      cantidad_disponible: [0, [Validators.min(0), Validators.max(99999999)]],
      cantidad_reservada: [0, [Validators.min(0), Validators.max(99999999)]],
      hora_actualizacion: [''],
      ultima_actualizacion: [''],
      img: ['', Validators.required]  // Agregado campo img con validación requerida
    });

    this.editForm = this.fb.group({
      id_prod: [0, Validators.required],
      nombre: ['', Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÑñ\\s]{1,30}$')],
      descripcion: ['', Validators.maxLength(300)],
      valor_unitario: [0, [Validators.min(0), Validators.max(999999999999999)]],
      proveedor: ['', Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÑñ\\s]{1,30}$')],
      cantidad_total: [0, [Validators.min(0), Validators.max(999999999999999)]],
      img: [''],
      id_stock: [0, Validators.required],
    });
  }

  getProduct(): void {
    this.api.getProductFront().subscribe({
      next: (res) => {
        this.products = res.data;
      },
      error: () => {
        this.showErrorMessage('Error al obtener productos.');
      },
    });
  }

  toggleFilterOptions(): void {
    this.filterOptionsVisible = !this.filterOptionsVisible;
    if (!this.filterOptionsVisible) {
      this.selectedFilter = '';
    }
  }

  selectFilter(option: string): void {
    this.selectedFilter = option;
  }

  createProduct(): void {
    if (this.createForm.valid) {
      const f = this.createForm.value;
      this.api.createProductSocket(
        f.nombre,
        f.descripcion,
        f.valor_unitario,
        f.proveedor,
        f.img,               // Aquí se envía el campo img
        0,                   // cantidad_total (puedes ajustar si lo quieres pedir en createForm)
        f.cantidad_disponible,
        f.cantidad_reservada,
        f.ultima_actualizacion,
        f.hora_actualizacion
      ).subscribe({
        next: (data) => {
          this.showSuccessMessage(data.msg);
          this.createForm.reset();
          this.getProduct();
        },
        error: (err) => {
          this.showErrorMessage(err.error.msg);
        },
      });
    } else {
      this.showErrorMessage('Formulario inválido. Por favor, revisa los campos.');
    }
  }

  updateProduct(): void {
    if (this.editForm.valid && confirm('¿Actualizar este producto?')) {
      const f = this.editForm.value;
      this.api.updateProductSocket(
        f.id_prod,
        f.nombre,
        f.descripcion,
        f.valor_unitario,
        f.proveedor,
        f.img,
        f.id_stock,
        f.cantidad_total
      ).subscribe({
        next: (data) => {
          this.showSuccessMessage(data.msg);
          this.editForm.reset();
          this.getProduct();
        },
        error: (err) => {
          this.showErrorMessage(err.error.msg);
        },
      });
    }
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
