import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  constructor(private http: HttpClient) { }

  pedirClientes() {
    return this.http.get(environment.url + 'clientes/?sort=apellido,asc');
  }

}
