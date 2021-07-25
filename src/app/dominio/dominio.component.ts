import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DominioService } from '../services/dominio.service';

@Component({
	selector: 'app-dominio',
	templateUrl: './dominio.component.html',
	styleUrls: ['./dominio.component.css']
})
export class DominioComponent implements OnInit {

	filtrarDominiosForm: FormGroup;
	dominios: any;
	orderNombreDesc: boolean;

	constructor(private servicioDominios: DominioService,
		private formBuilder: FormBuilder,
		private router : Router) { }

	ngOnInit() {
		this.filtrarDominiosForm = this.formBuilder.group({
			filtro: ['']
		});

		// Debo pedir los dominios al backend
		this.cargarDatos();
	}

	cargarDatos() {
		this.servicioDominios.pedirDominios().subscribe((rta) => {
			console.log(rta);
			this.dominios = rta;
		}, (error) => {
			console.log(error);
		});
	}


	nuevoDominio() {
		this.router.navigate(["dominios" , "nuevo"]);
	}


	ver(id: number) {
		this.router.navigate(["dominios" , id]);
		//Router ir a /dominios/:id
	}

	get f() {
		return this.filtrarDominiosForm.controls;
	}

	filtrar() {
		this.filtrarImpl(this.f.filtro.value);
	}

	filtrarImpl(valor: string, orden? : string) {
		this.servicioDominios.pedirDominiosFiltradosPorNombre(valor, orden).subscribe((rta: any) => {
			console.log(rta);
			if (rta && rta.content) {
				this.dominios = rta.content;	
			} else {
				this.dominios = rta;
			}
		}, (error) => {
			console.log(error);
		});
	}

	limpiar() {
		this.f.filtro.setValue('');
		this.filtrar();
	}

	keyPress(evento: KeyboardEvent) {
		if (evento.keyCode === 13) {
			this.filtrarImpl(this.f.filtro.value);
		}
	}

	ordenar(estrategia: string) {
		if (estrategia === 'nombre') {
			this.orderNombreDesc = !this.orderNombreDesc;
			//llamar al metodo de filtrar 
			this.filtrarImpl(this.f.filtro.value, this.orderNombreDesc ? 'nombreDominio,desc' : 'nombreDominio,asc' );
			
		}
	}


}
