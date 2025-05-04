import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'https://back-node-flappytechnology-production.up.railway.app';

  constructor(private http: HttpClient) {}

  // Endpoints User
  // Obtener todos los usuarios
  getUser(): Observable<any> {
    return this.http.get(`${this.baseUrl}/usuarios/getallusuarios`);
  }

  // Login
  login(correo: string, contrasena: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/usuarios/login`, {
      correo,
      contrasena
    });
  }

  // Crear Usuario
  create_user(nombre: string, apellido: string, correo: string, contrasena: string, tipo_user: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/usuarios/createusuario`, {
      nombre,
      apellido,
      correo,
      contrasena,
      tipo_user
    });
  }

  // Obtener todos los productos
  getProduct(): Observable<any> {
    return this.http.get(`${this.baseUrl}/productos/getAllProductos`);
  }

}
