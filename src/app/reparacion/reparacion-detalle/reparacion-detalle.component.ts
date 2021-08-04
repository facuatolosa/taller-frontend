import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientesService } from 'src/app/services/clientes.service';
import { EstadosService } from 'src/app/services/estados.service';
import { ReparacionService } from 'src/app/services/reparacion.service';
import Swal from 'sweetalert2';

@Component({
	selector: 'app-reparacion-detalle',
	templateUrl: './reparacion-detalle.component.html',
	styleUrls: ['./reparacion-detalle.component.css']
})
export class ReparacionDetalleComponent implements OnInit {
	formulario: FormGroup;
	titulo: string;
	modoEditar: boolean;
	btnModoText: string;
	enviado: boolean;
	reparacion: any;
	estados: any;
	clientes: any;
	clientesFiltrados: any;
	filtroClientes: string;
	id: number;
	fechaActual: Date;
	fechaActualFormateada: any;
	datosVehiculo: any;

	constructor(
		private servicioReparacion: ReparacionService,
    	private servicioClientes: ClientesService,
    	private servicioEstados: EstadosService,
		private formBuilder: FormBuilder,
		public rutaActiva: ActivatedRoute,
		public router: Router
	) { }

	ngOnInit(): void {
		this.modoEditar = false;
		console.log("Modo en el onInit():",this.modoEditar);
		if (this.modoEditar){
			this.btnModoText="Guardar";
			this.titulo = "Editar Reparación";
		} else {
			this.btnModoText="Editar";
			this.titulo = "Detalle de Reparación";
		}
		this.formulario = this.formBuilder.group({
			fechaEntrada: ['', [Validators.required]],
			fechaSalida: ['', [Validators.required]],
			nombreCliente: [''],
			marca: ['', [Validators.required, Validators.minLength(3)]],
			modelo: ['', [Validators.required, Validators.minLength(5)]],
			dominio: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(7)]],
			descripcion: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(200)]],
			estado: [''],
			estados: ['', [Validators.required]],
			costo: ['', [Validators.required]],
			selectCliente: ['', [Validators.required]],
			selectEstado: ['', [Validators.required]],
		})

		this.id = this.rutaActiva.snapshot.params.id;
		// A continuación procedemos a cargar los campos con la información de la reparación seleccionada
		this.servicioReparacion.pedirReparacion(this.id).subscribe((rta: any) => {
			// console.log("Rta:",rta);
			if (rta && rta.content) {
			  this.reparacion = rta.content;
			//   console.log("Content:",rta.content);
			} else {
			  this.reparacion = rta;
			}
			this.form.fechaEntrada.setValue(this.reparacion.fechaEntrada);
			this.form.fechaSalida.setValue(this.reparacion.fechaSalida);
			this.form.nombreCliente.setValue(this.reparacion.cliente.apellido+", "+this.reparacion.cliente.nombre);
			this.datosVehiculo = this.reparacion.descripcionVehiculo.split('|',3);
			this.form.marca.setValue(this.datosVehiculo[0]);
			this.form.modelo.setValue(this.datosVehiculo[1]);
			this.form.dominio.setValue(this.datosVehiculo[2]);
			this.form.estado.setValue(this.reparacion.estado.nombre);
			this.form.descripcion.setValue(this.reparacion.descripcion);
			this.form.costo.setValue(this.reparacion.costoTotal);
		}, (error) => {
			console.log(error);
		});
		
	}

	cargarDatos() {
		this.servicioEstados.pedirEstados().subscribe((rta) => {
		  // console.log("Estados:", rta);
		  this.estados = rta;
		}, (error) => {
		  console.log("Error estados: ", error);
		});
		this.servicioClientes.pedirClientes().subscribe((rta: any) => {
		  this.clientes = rta.content;
		  this.clientesFiltrados = rta.content;
		  // console.log("Clientes:", rta.content);
		}, (error) => {
		  console.log("Error clientes: ", error);
		});
	  }
	
	get form() {
		return this.formulario.controls;
	}

	onSubmit() {
		this.cambiarModo(this.modoEditar);
	}

	cambiarModo(modo:boolean) {
		// console.log("Modo antes de ejecutar:",this.modoEditar);
		this.modoEditar=!this.modoEditar;
		if (this.modoEditar){
			this.btnModoText="Guardar";
			this.titulo = "Editar Reparación";
			// A continuación se procede a habilitar los campos deshabilitados (puestos como read only)
			// this.habilitarCampos();
		} else {
			this.btnModoText="Editar",
			this.titulo = "Detalle de Reparación";
		}
		// console.log("Modo despues de ejecutar:",this.modoEditar);
	}

	buscar() {
		this.filtroClientes = String((document.getElementById('nombreCliente') as HTMLInputElement).value).toUpperCase();
		// alert(this.filtroClientes);
		this.clientesFiltrados = this.filtrarClientes();
	  }
	
	filtrarClientes(){
		let filtrados: object[] = [];
		for (let i = 0; i < this.clientes.length; i++) {
		  // console.log(this.clientes[i]);
		  // console.log("Método buscar() incluye filtro '" + this.filtroClientes + "'?", this.clientes[i].nombre.toUpperCase().includes(this.filtroClientes));
		  if (this.clientes[i].nombre.toUpperCase().includes(this.filtroClientes)){
			filtrados.push(this.clientes[i]);
		  }
		}
		return filtrados;
	}

	habilitarCampos(){
		(document.getElementById('nombreCliente') as HTMLInputElement).readOnly=false;
		(document.getElementById('costo') as HTMLInputElement).readOnly=false;
	}

	keyPress(evento: KeyboardEvent) {
		if (evento.keyCode === 13) {
		  this.buscar();
		}
	}
}
