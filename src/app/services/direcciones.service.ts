import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DireccionesService {

  constructor(private http: HttpClient) { }

  guardar(nuevaDireccion: any) {
		return this.http.post(environment.url + 'direcciones/', nuevaDireccion);
	}

  traerUltima() {
    return this.http.get(environment.url + 'direcciones/?sort=id,DESC');
  }

}
