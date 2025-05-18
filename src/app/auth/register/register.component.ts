import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/app.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;
  codigoForm!: FormGroup;

  paso: number = 1;
  error: string = '';
  token: string = '';

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.registerForm = new FormGroup({
      nombre: new FormControl('', [Validators.required, Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÑñ\\s]{1,30}$')]),
      apellido: new FormControl('', [Validators.required, Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÑñ\\s]{1,30}$')]),
      correo: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@(gmail\\.com|yahoo\\.com|hotmail\\.com|ecci\\.edu\\.co)$')
      ]),
      contrasena: new FormControl('', [
        Validators.required,
        Validators.pattern('^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{6,}$')
      ])
    });

    this.codigoForm = new FormGroup({
      codigo: new FormControl('', [Validators.required, Validators.maxLength(10)])
    });
  }

  solicitarCodigo() {
    if (this.registerForm.valid) {
      const { nombre, apellido, correo, contrasena } = this.registerForm.value;
      this.api.create_user_validacion(nombre, apellido, correo, contrasena, 1).subscribe({
        next: (res) => {
          this.token = res.data?.token?.trim() || '';

          console.log('Token recibido:', this.token);

          if (this.token) {
            this.paso = 2;
            this.error = '';
          } else {
            this.error = 'No se recibió un token válido.';
          }
        },
        error: (err) => {
          console.error('Error al solicitar verificación:', err);
          this.error = err.error?.msg || 'No se pudo enviar el código de verificación.';
        }
      });
    } else {
      this.error = 'Completa todos los campos correctamente.';
    }
  }

  verificarCodigo() {
    if (this.codigoForm.valid && this.token) {
      const codigo = this.codigoForm.value.codigo.trim();
      const token = this.token.trim();

      console.log('Enviando token:', token);
      console.log('Código ingresado:', codigo);

      this.api.create_user_configuracion(token, codigo).subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Error al verificar código:', err);
          this.error = err.error?.msg || 'Código incorrecto o expirado.';
        }
      });
    } else {
      this.error = 'Código inválido.';
    }
  }

  volverRegistro() {
    this.paso = 1;
    this.token = '';
    this.codigoForm.reset();
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  gotHome() {
    this.router.navigate(['']);
  }

  cancelarRegistro() {
    this.token = '';
    this.registerForm.reset();
    this.codigoForm.reset();
    this.paso = 1;
    this.error = '';
  }
}
