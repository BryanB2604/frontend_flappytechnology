import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ApiService } from '../../services/app.service';

@Component({
  selector: 'app-nav',
  standalone: false,
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  usuario: any = null;
  mostrarInfo = false;
  mostrarActualizar = false;
  users: any[] = [];
  editForm!: FormGroup;
  mensaje = '';
  error = '';
  rutaActualEsHomeOQuienes = false;

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    public router: Router
  ) {}

  ngOnInit(): void {
    const data = localStorage.getItem('usuario');
    if (data) {
      this.usuario = JSON.parse(data);
      this.getUsers();
      this.initForms();
    }

    const urlActual = this.router.url;
    this.setRuta(urlActual);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.urlAfterRedirects || event.url;
        this.setRuta(url);
      });
  }

  setRuta(url: string): void {
    this.rutaActualEsHomeOQuienes =
      url === '/' ||
      url === '/user' ||
      url.startsWith('/user') ||
      url === '/quienes-somos' ||
      url === '/tienda';
  }

  verificarUsuario(): void {
    if (!this.usuario) {
      const data = localStorage.getItem('usuario');
      if (data) {
        this.usuario = JSON.parse(data);
      }
    }

    if (this.usuario) {
      this.toggleInfoUsuario();
    } else {
      this.router.navigate(['/login']);
    }
  }

  toggleInfoUsuario(): void {
    this.mostrarInfo = !this.mostrarInfo;
    this.mostrarActualizar = false;
  }

  toggleActualizar(): void {
    this.mostrarActualizar = !this.mostrarActualizar;
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

  initForms(): void {
    this.editForm = this.fb.group({
      id_user: [{ value: 0, disabled: true }],
      nombre: ['', [
        Validators.required,
        Validators.maxLength(30),
        Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,30}$/)
      ]],
      apellido: ['', [
        Validators.required,
        Validators.maxLength(30),
        Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,30}$/)
      ]],
      correo: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      contrasena: ['', [
        Validators.required,
        Validators.pattern(/^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{6,}$/)
      ]]
    });
  }

  getUsers(): void {
    this.api.getUser().subscribe({
      next: (res) => this.users = res.data,
      error: (err) => console.error('Error al obtener usuarios', err)
    });
  }

  updateUser(): void {
    if (this.editForm.invalid) {
      this.error = 'Por favor, completa correctamente todos los campos.';
      this.mensaje = '';
      this.editForm.markAllAsTouched();
      return;
    }

    const form = this.editForm.getRawValue();

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
          this.usuario = {
            ...this.usuario,
            nombre: form.nombre,
            apellido: form.apellido,
          };
          localStorage.setItem('usuario', JSON.stringify(this.usuario));

          this.getUsers();
          this.editForm.reset();
          this.mostrarActualizar = false;
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

  cerrarSesion(): void {
    localStorage.removeItem('usuario');
    this.usuario = null;
    this.mostrarInfo = false;
    this.mostrarActualizar = false;
    this.router.navigate(['/login']);
  }
}
