import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class EstadosService {

	constructor(private http: HttpClient) { }

	pedirEstados() {
		return this.http.get(environment.url + 'estados');
	}

	pedirEstado(id: number) {
		return this.http.get(environment.url + 'estados/' + id);
	}
}
