import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/app.service';

@Component({
  selector: 'app-users',
  standalone: false,
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy {

  users: any[] = [];
  search: any = {};

  registerForm!: FormGroup;
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

  private refreshIntervalId: any; 

  constructor(private api: ApiService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForms();
    this.getUsers();  // Carga todos los usuarios sin filtro al inicio

    // Refresca la lista periódicamente sin filtro
    this.refreshIntervalId = setInterval(() => {
      if (!this.usuarioEncontrado) { // Solo refrescar si no hay búsqueda activa
        this.getUsers();
      }
    }, 30000);
  }

  ngOnDestroy(): void {
    if (this.refreshIntervalId) {
      clearInterval(this.refreshIntervalId);
    }
  }

  initForms(): void {
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{1,30}$')]],
      apellido: ['', [Validators.required, Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{1,30}$')]],
      correo: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@(gmail\\.com|yahoo\\.com|hotmail\\.com|ecci\\.edu\\.co)$')
      ]],
      contrasena: ['', [
        Validators.required,
        Validators.pattern('^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{6,}$')
      ]],
      tipo_user: [0, [Validators.required, Validators.min(1), Validators.max(3)]]
    });

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
      id_user: [null]  
    });
  }

  getUsers(): void {
    this.api.getUser().subscribe({
      next: (res) => {
        this.users = res.data;
        this.search = {};
        this.usuarioEncontrado = false;
      },
      error: (err) => {
        console.error('Error al obtener usuarios', err);
        this.showErrorMessage('Error al obtener los usuarios.');
      }
    });
  }

  crearUsuario(): void {
    if (this.registerForm.valid) {
      const { nombre, apellido, correo, contrasena, tipo_user } = this.registerForm.value;
      this.api.create_user(nombre, apellido, correo, contrasena, tipo_user).subscribe({
        next: () => {
          this.getUsers();
          this.registerForm.reset();
          this.showSuccessMessage('Usuario creado exitosamente.');
        },
        error: (err) => {
          this.showErrorMessage(err.error?.msg || 'Error al registrar usuario. Inténtalo de nuevo.');
        }
      });
    } else {
      this.showErrorMessage('Por favor completa todos los campos correctamente.');
    }
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

    if (confirm('¿Estás seguro de desactivar este usuario?')) {
      this.api.updateUser(
        id,
        userExiste.nombre,
        userExiste.apellido,
        userExiste.correo,
        userExiste.contrasena,
        0  // Cambiamos tipo_user a 0 para desactivar
      ).subscribe({
        next: () => {
          this.getUsers();
          this.showSuccessMessage('Usuario desactivado correctamente.');
        },
        error: (err) => {
          console.error('Error al desactivar usuario', err);
          this.showErrorMessage('Error al desactivar el usuario.');
        }
      });
    }
  }

  buscarUsuarioPorId(id: number): void {
    if (!id) {
      // Si no hay ID, mostramos todos los usuarios sin filtro
      this.getUsers();
      return;
    }

    this.api.searchUser(id).subscribe({
      next: (res) => {
        if (res && res.data && res.data.id_user) {
          this.search = res.data;
          this.usuarioEncontrado = true;
          this.error = '';
          this.users = []; // Vacía la lista para mostrar solo el usuario buscado
        } else {
          this.search = {};
          this.usuarioEncontrado = false;
          this.showErrorMessage(`Usuario con ID ${id} no encontrado.`);
          this.getUsers(); // Opcional: Mostrar todos si no se encuentra
        }
      },
      error: (err) => {
        console.error('Error al buscar usuario', err);
        this.search = {};
        this.usuarioEncontrado = false;
        this.showErrorMessage('Ocurrió un error al buscar el usuario.');
        this.getUsers(); // Opcional: Mostrar todos en caso de error
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
