import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../../services/app.service';

@Component({
  selector: 'app-sales',
  standalone: false,
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit {

  sales: any[] = [];
  search: any = {};
  saleFound: boolean = false;

  createForm!: FormGroup;
  editForm!: FormGroup;
  deleteForm!: FormGroup;
  searchForm!: FormGroup;

  error?: string;
  mensaje?: string;

  filterOptionsVisible = false;
  selectedFilter = '';
  mensajeVisible: boolean | undefined;
  errorVisible: boolean | undefined;

  constructor(private api: ApiService, private fb: FormBuilder) {}
  intervalId: any;

  ngOnInit(): void {
    this.loadSales();
    this.initForms();

    this.intervalId = setInterval(() => {
      this.loadSales();
    }, 30000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  initForms(): void {
    this.createForm = this.fb.group({
      fk_user: [0],
      fk_prod: [0],
      fk_estado: [0],
      fecha: [''],
      hora: [''],
      cantidad: [0],
      total: [0],
      cod_compra: ['']
    });

    this.editForm = this.fb.group({
      id_venta: [0],
      fk_user: [0],
      fk_prod: [0],
      fk_estado: [0],
      fecha: [''],
      hora: [''],
      cantidad: [0],
      total: [0],
      cod_compra: ['']
    });

    this.deleteForm = this.fb.group({ id_venta: [0] });
    this.searchForm = this.fb.group({ id_venta: [0] });
  }

  loadSales(): void {
    this.api.getSales().subscribe({
      next: (res) => this.sales = res.data,
      error: (err) => this.error = 'Error al cargar ventas.'
    });
  }

  createSale(): void {
    const f = this.createForm.value;
    if (confirm('¿Crear esta venta?')) {
      this.api.createSales(f.fk_user, f.fk_prod, f.fk_estado, f.fecha, f.hora, f.cantidad, f.total, f.cod_compra)
      .subscribe({
        next: () => {
          this.loadSales();
          this.createForm.reset();
          this.showSuccessMessage('Venta creada exitosamente.');
        },
        error: () => {
          this.showErrorMessage('Error al crear la venta.');
        }
      });
    }
  }

  updateSale(): void {
    const f = this.editForm.value;
    if (confirm('¿Actualizar esta venta?')) {
      this.api.updateSales(f.id_venta, f.fk_user, f.fk_prod, f.fk_estado, f.fecha, f.hora, f.cantidad, f.total, f.cod_compra)
        .subscribe({
          next: () => {
            this.loadSales();
            this.editForm.reset();
            this.showSuccessMessage('Venta actualizada.');
          },
          error: () => {
            this.showErrorMessage('Error al actualizar la venta.');
          }
        });
    }
  }

  deleteSale(id: number): void {
    if (confirm('¿Eliminar esta venta?')) {
      this.api.deleteSales(id).subscribe({
        next: () => {
          this.loadSales();
          this.deleteForm.reset();
          this.showSuccessMessage('Venta eliminada.');
        },
        error: () => {
          this.showErrorMessage('Error al eliminar la venta.');
        }
      });
    }
  }

  searchSaleById(id: number): void {
    this.api.searchSales(id).subscribe({
      next: (res) => {
        if (res && res.data) {
          this.search = res.data;
          this.saleFound = true;
          this.error = '';
        } else {
          this.saleFound = false;
          this.showErrorMessage(`Venta con ID ${id} no encontrada.`);
        }
      },
      error: () => {
        this.showErrorMessage('Error al buscar la venta.');
        this.saleFound = false;
      }
    });
  }

  toggleFilterOptions(): void {
    this.filterOptionsVisible = !this.filterOptionsVisible;
    if (!this.filterOptionsVisible) this.selectedFilter = '';
  }

  selectFilter(filter: string): void {
    this.selectedFilter = filter;
  }

  showSuccessMessage(mensaje: string) {
    this.mensaje = mensaje;
    this.mensajeVisible = true;
    setTimeout(() => {
      this.mensajeVisible = false;  
      this.mensaje = ''; 
    }, 3000); 
  }

  showErrorMessage(error: string) {
    this.error = error;
    this.errorVisible = true;
    setTimeout(() => {
      this.errorVisible = false;
      this.error = '';  
    }, 3000); 
  }
}
