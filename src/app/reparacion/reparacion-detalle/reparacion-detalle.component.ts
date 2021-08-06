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
		if (this.modoEditar){
			this.btnModoText="Guardar";
			this.titulo = "Editar Reparación";
		} else {
			this.btnModoText="Editar";
			this.titulo = "Detalle de Reparación";
		}

		this.formulario = this.formBuilder.group({
			idReparacion: [''],
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
			this.form.idReparacion.setValue(this.reparacion.id);
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
			this.servicioClientes.pedirClientes().subscribe((rta: any) => {
				this.clientes = rta.content;
				this.clientesFiltrados = rta.content;
			}, (error) => {
				console.log("Error clientes: ", error);
			});
			this.form.selectCliente.setValue(this.clientes);
			this.servicioEstados.pedirEstados().subscribe((rta:any) => {
				this.estados = rta.slice(4);
			}, (error) => {
				console.log("Error estados: ", error);
			});
			this.form.selectEstado.setValue(this.estados);
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
		if (this.modoEditar){
			Swal.fire({
				title: '¿Seguro que desea continuar?',
				text: "No podrá revertir los cambios!",
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Aceptar'
			}).then((result) => {
				if (result.value) {
					this.cambiarModo(this.modoEditar);
					this.actualizar();
				}
			})
		}
		this.cambiarModo(this.modoEditar);
	}

	cambiarModo(modo:boolean) {
		this.modoEditar=!this.modoEditar;
		if (this.modoEditar){
			this.btnModoText="Guardar";
			this.titulo = "Editar Reparación";
		} else {
			this.btnModoText="Editar",
			this.titulo = "Detalle de Reparación";
		}
	}

	buscar() {
		this.filtroClientes = String((document.getElementById('nombreCliente') as HTMLInputElement).value).toUpperCase();
		this.clientesFiltrados = this.filtrarClientes();
	  }
	
	filtrarClientes(){
		let filtrados: object[] = [];
		for (let i = 0; i < this.clientes.length; i++) {
		  if (this.clientes[i].nombre.toUpperCase().includes(this.filtroClientes)){
			filtrados.push(this.clientes[i]);
		  }
		}
		return filtrados;
	}

	keyPress(evento: KeyboardEvent) {
		if (evento.keyCode === 13) {
		  this.buscar();
		}
	}

	actualizar() {
		var reparacionActualizada: any;
		reparacionActualizada = {};
		reparacionActualizada.id = this.form.idReparacion.value;
		reparacionActualizada.fechaEntrada = this.form.fechaEntrada.value;
		reparacionActualizada.fechaSalida = this.form.fechaSalida.value;
		reparacionActualizada.cliente = this.form.selectCliente.value;
		reparacionActualizada.descripcionVehiculo = this.form.marca.value + " |" + this.form.modelo.value + " |" + this.form.dominio.value.toUpperCase();
		reparacionActualizada.estado = this.form.selectEstado.value;
		reparacionActualizada.descripcion = this.form.descripcion.value;
		reparacionActualizada.costoTotal = this.form.costo.value;
		console.log(reparacionActualizada);
		this.servicioReparacion.actualizar(reparacionActualizada).subscribe((rta) => {
			Swal.fire({
				icon: 'success',
				title: 'Reparación guardada',
				text: 'La reparación ha sido actualizada exitosamente',
				confirmButtonText: 'Aceptar',
				confirmButtonColor: '#0D6EFD',
			})
			this.router.navigate(["reparaciones"]);
		}, (error) => {
			Swal.fire({
				icon: 'error',
				title: 'Error al actualizar',
				text: 'Se produjo un error al intentar actualizar la reparación',
				confirmButtonText: 'Aceptar',
				confirmButtonColor: '#0D6EFD',
			})
		});

	}
}
