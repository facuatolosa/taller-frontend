import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReparacionService {

	
	constructor(private http: HttpClient) { }

	pedirReparacion(id:number) {
		return this.http.get(environment.url + 'reparaciones/' + id);
	}
	
	pedirReparaciones() {
		return this.http.get(environment.url + 'reparaciones/?sort=id,asc');
	}

	pedirReparacionesFiltradasPorNombre(filtro: string, orden?: string) {
		if (orden) {
			return this.http.get(environment.url + 'reparaciones/filtrar?nombre=' + filtro + '&apellido=' + '&sort=cliente.' + orden);
		}
		return this.http.get(environment.url + 'reparaciones/filtrar?nombre=' + filtro + '&apellido=');
	}

	guardar(nuevaReparacion: any) {
		return this.http.post(environment.url + 'reparaciones/', nuevaReparacion);
	}

	actualizar(reparacion: any) {
		return this.http.put(environment.url + 'reparaciones/' + reparacion.id, reparacion);
	}

	eliminarReparacion(id:number) {
		return this.http.delete(environment.url + 'reparaciones/' + id);
	}
}
