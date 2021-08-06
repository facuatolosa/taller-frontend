import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientesService } from 'src/app/services/clientes.service';
import { DireccionesService } from 'src/app/services/direcciones.service';
import { EstadosService } from 'src/app/services/estados.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cliente-nuevo',
  templateUrl: './cliente-nuevo.component.html',
  styleUrls: ['./cliente-nuevo.component.css']
})
export class ClienteNuevoComponent implements OnInit {
  nuevoClienteForm: FormGroup;
  titulo: string;
  modoNuevo: boolean;
  estado: any;
  enviado: boolean;

  constructor(
    private servicioDireccion: DireccionesService,
    private servicioCliente: ClientesService,
    private servicioEstados: EstadosService,
    private formBuilder: FormBuilder,
    public rutaActiva: ActivatedRoute,
    public router: Router
  ) { }

  ngOnInit() {
    this.nuevoClienteForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      apellido: ['', [Validators.required, Validators.minLength(3)]],
      documento: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(8)]],
      fechaNacimiento: ['', [Validators.required]],
      calle: ['', [Validators.required, Validators.maxLength(20)]],
      alturaCalle: ['', [Validators.required]],
      selectProvincias: ['', [Validators.required]],
      selectCiudades: ['', [Validators.required]],
      telefono: ['', [Validators.required, Validators.pattern("(\\+)?([0-9]){6,13}")]],
      correoElectronico: ['', [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]]
    });
  }

  get form() {
    return this.nuevoClienteForm.controls;
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
      if (result.value){
        var nuevoCliente: any = {};
        var nuevaDireccion: any = {};
        var nuevoEstado: any = {};
        nuevoEstado = {
          "id": 1,
          "nombre": "Activo",
          "fechaCreacion": "2020-12-31",
          "fechaModificacion": null,
          "descripcion": "El cliente ha sido dado de alta y puede operar con regularidad"
        }
        nuevaDireccion.calle = this.form.calle.value;
        nuevaDireccion.altura = this.form.alturaCalle.value;
        nuevaDireccion.localidad = this.form.selectCiudades.value + ", " + this.form.selectProvincias.value;
        nuevoCliente.nombre = this.form.nombre.value;
        nuevoCliente.apellido = this.form.apellido.value;
        nuevoCliente.nroDNI = this.form.documento.value;
        nuevoCliente.fechaNacimiento = this.form.fechaNacimiento.value;
        nuevoCliente.telefono = this.form.telefono.value;
        nuevoCliente.correoElectronico = this.form.correoElectronico.value;
        nuevoCliente.direccion = nuevaDireccion;
        nuevoCliente.estado = nuevoEstado;
        console.log(nuevoCliente);
        this.servicioCliente.guardar(nuevoCliente).subscribe((rta) => {
          Swal.fire({
            icon: 'success',
            title: 'Cliente guardado',
            text: 'El cliente ha sido guardado en la BD exitosamente',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#0D6EFD',
          })
          this.router.navigate(["clientes"]);
        }, (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error al guardar',
            text: 'Se produjo un error al intentar guardar el cliente',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#0D6EFD',
          })
        });
      }
    })
  }

}
