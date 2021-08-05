import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ClientesService } from '../services/clientes.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})

export class ClientesComponent implements OnInit {
  clientesForm: FormGroup;
  clientes: any;
  orderIDDesc: boolean;
  orderNombreDesc: boolean;
  orderApellidoDesc: boolean;
  orderFechaNacDesc: boolean;
  orderDocumentoDesc: boolean;
  orderTelefonoDesc: boolean;
  orderEmailDesc: boolean;

  constructor(private servicioClientes: ClientesService,
    private formBuilder: FormBuilder,
    private router: Router) { }

  ngOnInit(): void {
    this.clientesForm = this.formBuilder.group({
      filtro: ['']
    });

    this.cargarDatos();
  }

  cargarDatos() {
    this.servicioClientes.pedirClientes().subscribe((rta: any) => {
      console.log(rta.content);
      this.clientes = rta.content;
      // for (let i = 0; i < this.clientes.length; i++) {
      //   this.clientes[i].descripcionVehiculo = this.clientes[i].descripcionVehiculo.split('|').join('');
      //   // console.log(this.clientes[i]);
      // }
    }, (error) => {
      console.log(error);
    });
  }

  nuevoCliente() {
    this.router.navigate(["clientes/nuevo"]);
  }

  ver(id: number) {
    this.router.navigate(["clientes", id]);
  }

  eliminar(id: number) {
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
        this.servicioClientes.eliminarCliente(id).subscribe((rta: any) => {
          console.log("Eliminado:",rta);
          Swal.fire({
            icon: 'success',
            title: 'Cliente eliminado',
            text: 'El cliente ha sido eliminado de la BD exitosamente',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#0D6EFD',
          })
        }, (error) => {
          console.log(error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El cliente no ha podido ser eliminado',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#0D6EFD',
          })
        });
      }
    }) 
    
  }

  get f() {
    return this.clientesForm.controls;
  }

  filtrar() {
    this.filtrarImpl(this.f.filtro.value);
  }

  filtrarImpl(value: string, estrategia?: string, orden?: string) {
    this.servicioClientes.pedirClientesFiltradosPorNombre(value, estrategia, orden).subscribe((rta: any) => {
      // console.log(rta);
      if (rta && rta.content) {
        this.clientes = rta.content;
        console.log(rta.content);
      } else {
        this.clientes = rta;
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
      this.orderIDDesc, this.orderApellidoDesc, this.orderFechaNacDesc, this.orderDocumentoDesc = false;
      this.filtrarImpl(this.f.filtro.value, estrategia, this.orderNombreDesc ? ',desc' : ',asc');
    } else if (estrategia === 'id'){
      this.orderIDDesc = !this.orderIDDesc;
      this.orderNombreDesc, this.orderApellidoDesc, this.orderFechaNacDesc, this.orderDocumentoDesc = false;
      this.filtrarImpl(this.f.filtro.value, estrategia, this.orderIDDesc ? ',desc' : ',asc');
    } else if (estrategia === 'apellido'){
      this.orderApellidoDesc = !this.orderApellidoDesc;
      this.orderIDDesc, this.orderNombreDesc, this.orderFechaNacDesc, this.orderDocumentoDesc = false;
      this.filtrarImpl(this.f.filtro.value, estrategia, this.orderApellidoDesc ? ',desc' : ',asc');
    } else if (estrategia === 'fechaNacimiento'){
      this.orderFechaNacDesc = !this.orderFechaNacDesc;
      this.orderIDDesc, this.orderNombreDesc, this.orderApellidoDesc, this.orderDocumentoDesc = false;
      this.filtrarImpl(this.f.filtro.value, estrategia, this.orderFechaNacDesc ? ',desc' : ',asc');
    } 
  }

  
}
