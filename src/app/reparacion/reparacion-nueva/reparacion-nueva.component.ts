import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientesService } from 'src/app/services/clientes.service';
import { EstadosService } from 'src/app/services/estados.service';

@Component({
  selector: 'app-reparacion-nueva',
  templateUrl: './reparacion-nueva.component.html',
  styleUrls: ['./reparacion-nueva.component.css']
})
export class ReparacionNuevaComponent implements OnInit {
  formulario: FormGroup;
  titulo: string;
  estados: any;
  clientes: any;
  clientesFiltrados: any;
  filtroClientes: string;
  fechaActual: Date;
  fechaActualFormateada: any;
  enviado: boolean;

  constructor(
    private servicioClientes: ClientesService,
    private servicioEstados: EstadosService,
    private formBuilder: FormBuilder,
    public rutaActiva: ActivatedRoute,
    public router: Router    
  ) { 
    this.fechaActual = new Date();
    console.log("Date:",this.fechaActual);
    this.fechaActualFormateada = this.fechaActual.toISOString().split('T')[0];
    console.log("Fecha actual:",this.fechaActualFormateada);
  }

  ngOnInit() {
    this.cargarDatos();
    this.formulario = this.formBuilder.group({
      fechaEntrada: ['', [Validators.required]],
      nombreCliente: ['', [Validators.required, Validators.minLength(3)]],
      marca: ['', [Validators.required, Validators.minLength(3)]],
      modelo: ['', [Validators.required, Validators.minLength(5)]],
      dominio: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      estados: ['', [Validators.required]],
      descripcion: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(200)]],
      costo: ['', [Validators.required, Validators.minLength(3)]],
      })
  }

  cargarDatos() {
		this.servicioEstados.pedirEstados().subscribe((rta) => {
			console.log("Estados:",rta);
			this.estados = rta;
		}, (error) => {
			console.log("Error estados: ",error);
		});
    this.servicioClientes.pedirClientes().subscribe((rta:any) => {
      this.clientes = rta.content;
      console.log("Clientes:",rta.content);
      for(let i=0;i<rta.content.length;i++) {
        console.log(this.clientes[i]);
      }
		}, (error) => {
			console.log("Error clientes: ",error);
		});
	}

  get form() {
    return this.formulario.controls;
  }

  onSubmit() {
		this.enviado = true;
    this.validarDatos();
    console.log("Enviado?",this.enviado);
  }

  validarDatos(){
    // this.enviado = true;
    // this.formulario = this.formBuilder.group({
    //   fechaEntrada: ['', [Validators.required]],
    //   nombreCliente: ['', [Validators.required, Validators.minLength(3)]],
    //   marca: ['', [Validators.required, Validators.minLength(3)]],
    //   modelo: ['', [Validators.required, Validators.minLength(5)]],
    //   dominio: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    //   estados: ['', [Validators.required]],
    //   descripcion: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(200)]],
    //   costo: ['', [Validators.required, Validators.minLength(3)]],
    // });
  }

  buscar(){
    this.filtroClientes = String((document.getElementById('nombreCliente') as HTMLInputElement).value).toUpperCase();
    // alert(this.filtroClientes);
    console.log("Método buscar() incluye filtro '" + this.filtroClientes + "'?",this.clientes[1].nombre.toUpperCase().includes(this.filtroClientes));
    // this.filtrarClientes();
  }

  // filtrarClientes(){
  //   let filtrados: any[];
  //   console.log(this.clientes[1].nombre);
  //   for (let cliente in this.clientes) {
  //     console.log(cliente);
  //     if (cliente.nombre.toUpperCase().includes(this.filtroClientes)){
  //       filtrados.push(cliente);
  //     }
  //   }
  //   return filtrados;
  // }

}