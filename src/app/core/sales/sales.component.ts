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

  constructor(private api: ApiService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loadSales();
    this.initForms();
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
    this.api.createSales(f.fk_user, f.fk_prod, f.fk_estado, f.fecha, f.hora, f.cantidad, f.total, f.cod_compra)
      .subscribe({
        next: () => {
          this.loadSales();
          this.createForm.reset();
          this.mensaje = 'Venta creada exitosamente.';
          this.error = '';
        },
        error: () => {
          this.error = 'Error al crear la venta.';
          this.mensaje = '';
        }
      });
  }

  updateSale(): void {
    const f = this.editForm.value;
    if (confirm('¿Actualizar esta venta?')) {
      this.api.updateSales(f.id_venta, f.fk_user, f.fk_prod, f.fk_estado, f.fecha, f.hora, f.cantidad, f.total, f.cod_compra)
        .subscribe({
          next: () => {
            this.loadSales();
            this.editForm.reset();
            this.mensaje = 'Venta actualizada.';
            this.error = '';
          },
          error: () => {
            this.error = 'Error al actualizar la venta.';
            this.mensaje = '';
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
          this.mensaje = 'Venta eliminada.';
          this.error = '';
        },
        error: () => {
          this.error = 'Error al eliminar la venta.';
          this.mensaje = '';
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
          this.error = `Venta con ID ${id} no encontrada.`;
        }
      },
      error: () => {
        this.error = 'Error al buscar la venta.';
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

}
