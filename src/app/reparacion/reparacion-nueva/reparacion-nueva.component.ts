import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientesService } from 'src/app/services/clientes.service';
import { EstadosService } from 'src/app/services/estados.service';
import { ReparacionService } from 'src/app/services/reparacion.service';
import Swal from 'sweetalert2';

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
    private servicioReparacion: ReparacionService,
    private servicioClientes: ClientesService,
    private servicioEstados: EstadosService,
    private formBuilder: FormBuilder,
    public rutaActiva: ActivatedRoute,
    public router: Router
  ) {
    this.fechaActual = new Date();
    // console.log("Date:", this.fechaActual);
    this.fechaActualFormateada = this.fechaActual.toISOString().split('T')[0];
    // console.log("Fecha actual:", this.fechaActualFormateada);
  }

  ngOnInit() {
    this.cargarDatos();
    this.formulario = this.formBuilder.group({
      fechaEntrada: ['', [Validators.required]],
      fechaSalida: ['', [Validators.required]],
      nombreCliente: [''],
      marca: ['', [Validators.required, Validators.minLength(3)]],
      modelo: ['', [Validators.required, Validators.minLength(5)]],
      dominio: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(7)]],
      descripcion: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(200)]],
      estados: ['', [Validators.required]],
      costo: ['', [Validators.required]],
      selectCliente: ['', [Validators.required]],
      selectEstado: ['', [Validators.required]],
    })
  }

  cargarDatos() {
    this.servicioEstados.pedirEstados().subscribe((rta:any) => {
      // console.log("Estados:", rta);
      this.estados = rta.slice(4);
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
    this.enviado = true;
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
        var nuevaReparacion: any;
        nuevaReparacion = {}; 
        nuevaReparacion.fechaEntrada = this.form.fechaEntrada.value;
        nuevaReparacion.fechaSalida = this.form.fechaSalida.value;
        nuevaReparacion.cliente = this.form.selectCliente.value;
        nuevaReparacion.descripcionVehiculo = this.form.marca.value+" |"+this.form.modelo.value+" |"+this.form.dominio.value.toUpperCase();
        nuevaReparacion.estado = this.form.selectEstado.value;
        nuevaReparacion.descripcion = this.form.descripcion.value;
        nuevaReparacion.costoTotal = this.form.costo.value;
        console.log(nuevaReparacion);
        this.servicioReparacion.guardar(nuevaReparacion).subscribe((rta) => {
          Swal.fire({
            icon: 'success',
            title: 'Reparación guardada',
            text: 'La reparación ha sido guardada en la BD exitosamente',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#0D6EFD',
          })
          this.router.navigate(["reparaciones"]);
        }, (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error al guardar',
            text: 'Se produjo un error al intentar guardar la reparación',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#0D6EFD',
          })
        });
      }
    }) 
    
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

}