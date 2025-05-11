import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/app.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-socket',
  standalone: false,
  templateUrl: './socket.component.html',
  styleUrls: ['./socket.component.css']
})
export class SocketComponent implements OnInit {
  stockList: any[] = [];
  searchResult: any = {};
  stockForm!: FormGroup;
  searchForm!: FormGroup;
  deleteForm!: FormGroup;
  error: string | undefined;
  mensaje: string | undefined;
  stockEncontrado: boolean = false;

  filterOptionsVisible = false;
  selectedFilter: string = '';

  constructor(private api: ApiService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForms();
    this.getStock();
  }

  initForms(): void {
    this.stockForm = this.fb.group({
      id: [0],
      fk_prod: [0],
      cantidad_total: [0],
      cantidad_disponible: [0],
      cantidad_reservada: [0],
      ultima_actualizacion: [''],
      hora_actualizacion: ['']
    });

    this.searchForm = this.fb.group({ id: [0] });
    this.deleteForm = this.fb.group({ id: [0] });
  }

  toggleFilterOptions(): void {
    this.filterOptionsVisible = !this.filterOptionsVisible;
  }

  selectFilter(filter: string): void {
    this.selectedFilter = filter;
    this.mensaje = '';
    this.error = '';
    this.stockEncontrado = false;
  }

  getStock(): void {
    this.api.getStock().subscribe({
      next: (res) => this.stockList = res.data,
      error: (err) => console.error('Error al obtener stock', err)
    });
  }

  createStock(): void {
    const form = this.stockForm.value;
    this.api.createStock(
      form.id,
      form.fk_prod,
      form.cantidad_total,
      form.cantidad_disponible,
      form.cantidad_reservada,
      form.ultima_actualizacion,
      form.hora_actualizacion
    ).subscribe({
      next: () => {
        this.getStock();
        this.stockForm.reset();
        this.mensaje = 'Stock creado exitosamente.';
        this.error = '';
      },
      error: (err) => {
        console.error('Error al crear stock', err);
        this.error = 'Error al crear el stock';
        this.mensaje = '';
      }
    });
  }

  updateStock(): void {
    const form = this.stockForm.value;

    const stockExiste = this.stockList.find(s => s.id_stock === form.id);  
    
    if (!stockExiste) {
      this.error = `No se encontró el stock con ID ${form.id}.`;
      this.mensaje = '';
      return;
    }

    if (confirm('¿Estás seguro de actualizar este stock?')) {
      this.api.updateStock(
        form.id,  
        form.fk_prod,
        form.cantidad_total,
        form.cantidad_disponible,
        form.cantidad_reservada,
        form.ultima_actualizacion,
        form.hora_actualizacion
      ).subscribe({
        next: () => {
          this.getStock();  
          this.stockForm.reset();
          this.error = '';
          this.mensaje = 'Stock actualizado exitosamente.';
        },
        error: (err) => {
          console.error('Error al actualizar stock', err);
          this.error = 'Error al actualizar el stock.';
          this.mensaje = '';
        }
      });
    }
  }


  searchStock(): void {
    const id = this.searchForm.value.id;
    this.api.searchStock(id).subscribe({
      next: (res) => {
        if (res.data) {
          this.searchResult = res.data;
          this.stockEncontrado = true;
          this.error = '';
        } else {
          this.searchResult = {};
          this.stockEncontrado = false;
          this.error = `Stock con ID ${id} no encontrado.`;
        }
      },
      error: (err) => {
        console.error('Error al buscar stock', err);
        this.error = 'Ocurrió un error al buscar el stock';
        this.stockEncontrado = false;
      }
    });
  }

  deleteStock(): void {
    const id = this.deleteForm.value.id;
    this.api.deleteStock(id).subscribe({
      next: () => {
        this.getStock();
        this.deleteForm.reset();
        this.mensaje = 'Stock eliminado exitosamente';
        this.error = '';
      },
      error: (err) => {
        console.error('Error al eliminar stock', err);
        this.error = 'Error al eliminar el stock';
        this.mensaje = '';
      }
    });
  }
}
