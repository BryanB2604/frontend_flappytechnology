import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/app.service';

@Component({
  selector: 'app-nav-admin',
  standalone: false,
  templateUrl: './nav-admin.component.html',
  styleUrl: './nav-admin.component.css'
})
export class NavAdminComponent implements OnInit {

  usuario: any = null;
  mostrarInfo = false;
  mostrarActualizar = false;
  mostrarEliminar = false;

  users: any[] = [];
  editForm!: FormGroup;
  deleteForm!: FormGroup;

  mensaje = '';
  error = '';

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    const data = localStorage.getItem('usuario');
    if (data) {
      this.usuario = JSON.parse(data);

      switch (this.usuario.tipo_user) {
        case 3:
          if (!this.router.url.includes('superadmin')) {
            this.cerrarSesion();
          }
          break;
        case 2:
          if (!this.router.url.includes('admin')) {
            this.cerrarSesion();
          }
          break;
        case 1:
          if (!this.router.url.includes('user')) {
            this.cerrarSesion();
          }
          break;
        default:
          this.cerrarSesion();
          break;
      }
    } else {
      this.router.navigate(['/']);
    }

    this.getUsers();
    this.initForms();
  }

  toggleInfoUsuario(): void {
    this.mostrarInfo = !this.mostrarInfo;
    this.mostrarActualizar = false;
    this.mostrarEliminar = false;
  }

  toggleActualizar(): void {
    this.mostrarActualizar = !this.mostrarActualizar;
    if (this.mostrarActualizar) this.mostrarEliminar = false;

    if (this.mostrarActualizar && this.usuario) {
      this.editForm.patchValue({
        id_user: this.usuario.id_user,
        nombre: this.usuario.nombre,
        apellido: this.usuario.apellido,
        correo: this.usuario.correo,
        contrasena: ''
      });
    }
  }

  toggleEliminar(): void {
    this.mostrarEliminar = !this.mostrarEliminar;
    if (this.mostrarEliminar) this.mostrarActualizar = false;

    if (this.mostrarEliminar && this.usuario) {
      this.deleteForm.patchValue({
        id_user: this.usuario.id_user
      });
    }
  }

  initForms(): void {
    this.editForm = this.fb.group({
      id_user: [0],
      nombre: [''],
      apellido: [''],
      correo: [''],
      contrasena: ['']
    });

    this.deleteForm = this.fb.group({
      id_user: [0]
    });
  }

  getUsers(): void {
    this.api.getUser().subscribe({
      next: (res) => this.users = res.data,
      error: (err) => console.error('Error al obtener usuarios', err)
    });
  }

  updateUser(): void {
    const form = this.editForm.value;
    const userExiste = this.users.find(u => u.id_user === form.id_user);

    if (!userExiste) {
      this.error = `No se encontró el usuario con ID ${form.id_user}.`;
      this.mensaje = '';
      return;
    }

    if (confirm('¿Estás seguro de actualizar este usuario?')) {
      this.api.updateUser(
        form.id_user,
        form.nombre,
        form.apellido,
        form.correo,
        form.contrasena,
        this.usuario.tipo_user
      ).subscribe({
        next: () => {
          this.getUsers();
          this.editForm.reset();
          this.error = '';
          this.mensaje = 'Usuario actualizado correctamente.';
        },
        error: () => {
          this.error = 'Error al actualizar el usuario.';
          this.mensaje = '';
        }
      });
    }
  }

  deleteUser(): void {
    const id = this.deleteForm.value.id_user;
    const userExiste = this.users.find(u => u.id_user === id);

    if (!userExiste) {
      this.error = `No se encontró el usuario con ID ${id}.`;
      this.mensaje = '';
      return;
    }

    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this.api.deleteUser(id).subscribe({
        next: () => {
          this.getUsers();
          this.deleteForm.reset();
          this.error = '';
          this.mensaje = 'Usuario eliminado correctamente.';
        },
        error: () => {
          this.error = 'Error al eliminar el usuario.';
          this.mensaje = '';
        }
      });
    }
  }

  cerrarSesion(): void {
    localStorage.removeItem('usuario');
    location.reload();
    this.router.navigate(['/']);
  }
}
