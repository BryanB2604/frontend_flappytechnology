import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../../services/app.service';

@Component({
  selector: 'app-users',
  standalone: false,
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {

  users: any[] = [];
  search: any = {};

  editForm!: FormGroup;
  deleteForm!: FormGroup;
  buscarForm!: FormGroup;

  error: string = '';
  mensaje: string = '';

  filterOptionsVisible: boolean = false;
  selectedFilter: string = '';
  usuarioEncontrado: boolean = false;
  mensajeVisible: boolean = false;
  errorVisible: boolean = false;

  constructor(private api: ApiService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.getUsers();
    this.initForms();
  }

  initForms(): void {
    this.editForm = this.fb.group({
      id_user: [0],
      nombre: [''],
      apellido: [''],
      correo: [''],
      contrasena: [''],
      tipo_user: [0]
    });

    this.deleteForm = this.fb.group({
      id_user: [0]
    });

    this.buscarForm = this.fb.group({
      id_user: [0]
    });
  }

  getUsers(): void {
    this.api.getUser().subscribe({
      next: (res) => {
        this.users = res.data;
      },
      error: (err) => {
        console.error('Error al obtener usuarios', err);
        this.showErrorMessage('Error al obtener los usuarios.');
      }
    });
  }

  updateUser(): void {
    const form = this.editForm.value;
    const userExiste = this.users.find(u => u.id_user === form.id_user);

    if (!userExiste) {
      this.showErrorMessage(`No se encontró el usuario con ID ${form.id_user}.`);
      return;
    }

    if (confirm('¿Estás seguro de actualizar este usuario?')) {
      this.api.updateUser(
        form.id_user,
        form.nombre,
        form.apellido,
        form.correo,
        form.contrasena,
        form.tipo_user
      ).subscribe({
        next: () => {
          this.getUsers();
          this.editForm.reset();
          this.showSuccessMessage('Usuario actualizado exitosamente.');
        },
        error: (err) => {
          console.error('Error al actualizar usuario', err);
          this.showErrorMessage('Error al actualizar el usuario.');
        }
      });
    }
  }

  deleteUser(id: number): void {
    const userExiste = this.users.find(u => u.id_user === id);

    if (!userExiste) {
      this.showErrorMessage(`No se encontró el usuario con ID ${id}.`);
      return;
    }

    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this.api.deleteUser(id).subscribe({
        next: () => {
          this.getUsers();
          this.deleteForm.reset();
          this.showSuccessMessage('Usuario eliminado correctamente.');
        },
        error: (err) => {
          console.error('Error al eliminar usuario', err);
          this.showErrorMessage('Error al eliminar el usuario.');
        }
      });
    }
  }

  buscarUsuarioPorId(id: number): void {
    this.api.searchUser(id).subscribe({
      next: (res) => {
        if (res && res.data) {
          this.search = res.data;
          this.usuarioEncontrado = true;
          this.error = '';
        } else {
          this.search = {};
          this.usuarioEncontrado = false;
          this.showErrorMessage(`Usuario con ID ${id} no encontrado.`);
        }
      },
      error: (err) => {
        console.error('Error al buscar usuario', err);
        this.search = {};
        this.usuarioEncontrado = false;
        this.showErrorMessage('Ocurrió un error al buscar el usuario.');
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
