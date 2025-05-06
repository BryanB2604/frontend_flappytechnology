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
  create_user(nombre: string, apellido: string, correo: string, contrasena: string, tipo_user: number) {
    const body = { nombre, apellido, correo, contrasena, tipo_user };
    return this.http.post<any>(`${this.baseUrl}/usuarios/createusuario`, body);
  }

   // Obtener todos los productos
   getProduct(): Observable<any> {
    return this.http.get(`${this.baseUrl}/productos/getAllProductos`);
  }

  // Eliminar producto
  searchProduct(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/productos/getProductoById/${id}`);
  }

  // Crear producto
  createProduct(nombre: string, descripcion: string, valor_unitario: number, proveedor: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/productos/createProducto`, {
      nombre,
      descripcion,
      valor_unitario,
      proveedor
    });
  }

  // Actualizar producto
  updateProduct(id: number, nombre: string, descripcion: string, valor_unitario: number, proveedor: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/productos/updateProductoById/${id}`, {
      nombre,
      descripcion,
      valor_unitario,
      proveedor
    });
  }
  

  // Eliminar producto
  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/productos/deleteProductoById/${id}`);
  }

}
