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

  	pedirCliente(id:number) {
	  return this.http.get(environment.url + 'clientes/' + id);
	}
	
	pedirClientesFiltradosPorNombre(filtro: string, estrategia?: string, orden?: string) {
		if (orden) {
			return this.http.get(environment.url + 'clientes/filtrar?nombre=' + filtro + '&apellido=' + '&sort=' + estrategia + orden);
		}
		return this.http.get(environment.url + 'clientes/filtrar?nombre=' + filtro + '&apellido=');
	}

	actualizar(cliente: any) {
		return this.http.put(environment.url + 'clientes/' + cliente.id, cliente);
	}

  	guardar(nuevoCliente: any) {
		return this.http.post(environment.url + 'clientes/', nuevoCliente);
	}

	eliminarCliente(id:number) {
		return this.http.delete(environment.url + 'clientes/' + id);
	}

}
