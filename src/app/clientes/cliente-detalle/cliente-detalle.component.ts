import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientesService } from 'src/app/services/clientes.service';
import { DireccionesService } from 'src/app/services/direcciones.service';
import { EstadosService } from 'src/app/services/estados.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cliente-detalle',
  templateUrl: './cliente-detalle.component.html',
  styleUrls: ['./cliente-detalle.component.css']
})
export class ClienteDetalleComponent implements OnInit {
  clienteForm: FormGroup;
  titulo: string;
  modoEditar: boolean;
  btnModoText: string;
  enviado: boolean;
  cliente: any;
  estados: any;
  estado: any;
  id: number;
  datosDireccion: any;

  constructor(
    private servicioClientes: ClientesService,
    private servicioDirecciones: DireccionesService,
    private servicioEstados: EstadosService,
    private formBuilder: FormBuilder,
    public rutaActiva: ActivatedRoute,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.modoEditar = false;
    if (this.modoEditar) {
      this.btnModoText = "Guardar";
      this.titulo = "Editar Cliente";
    } else {
      this.btnModoText = "Editar";
      this.titulo = "Detalle de Cliente";
    }
    this.clienteForm = this.formBuilder.group({
      idCliente: [''],
      estadoCliente: [''],
      selectEstados: [''],
      provincia: [''],
      localidad: [''],
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
    })

    this.id = this.rutaActiva.snapshot.params.id;

    this.servicioClientes.pedirCliente(this.id).subscribe((rta: any) => {
      console.log("Cliente:", rta);
      if (rta && rta.content) {
        this.cliente = rta.content;
        console.log("Content:", rta.content);
      } else {
        this.cliente = rta;
      }
      this.form.idCliente.setValue(this.cliente.id);
      this.form.estadoCliente.setValue(this.cliente.estado.nombre);
      this.form.nombre.setValue(this.cliente.nombre);
      this.form.apellido.setValue(this.cliente.apellido);
      this.form.documento.setValue(this.cliente.nroDNI);
      this.form.fechaNacimiento.setValue(this.cliente.fechaNacimiento);
      this.form.calle.setValue(this.cliente.direccion.calle);
      this.form.alturaCalle.setValue(this.cliente.direccion.altura);
      this.form.telefono.setValue(this.cliente.telefono);
      this.form.correoElectronico.setValue(this.cliente.correoElectronico);
      this.datosDireccion = this.cliente.direccion.localidad.split(',', 2);
      this.form.localidad.setValue(this.datosDireccion[0]);
      this.form.provincia.setValue(this.datosDireccion[1]);
      this.servicioEstados.pedirEstados().subscribe((rta: any) => {
        this.estados = rta.slice(0, 3);
        console.log("Estados:", rta.slice(0, 3));
      }, (error) => {
        console.log("Error al buscar estado del cliente: ", error);
      });

    }, (error) => {
      console.log(error);
    });

  }

  onSubmit() {
    if (this.modoEditar) {
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

  cambiarModo(modo: boolean) {
    this.modoEditar = !this.modoEditar;
    if (this.modoEditar) {
      this.btnModoText = "Guardar";
      this.titulo = "Editar Cliente";
    } else {
      this.btnModoText = "Editar",
        this.titulo = "Detalle de Cliente";
    }
  }

  actualizar() {
    var clientAct: any = {};
    var direccionAct: any = {};
    clientAct.id = this.form.idCliente.value;
    clientAct.nombre = this.form.nombre.value;
    clientAct.apellido = this.form.apellido.value;
    clientAct.nroDNI = this.form.documento.value;
    clientAct.fechaNacimiento = this.form.fechaNacimiento.value;
    clientAct.telefono = this.form.telefono.value;
    clientAct.correoElectronico = this.form.correoElectronico.value;
    direccionAct.calle = this.form.calle.value;
    direccionAct.altura = this.form.alturaCalle.value;
    direccionAct.localidad = this.form.localidad.value + ", " + this.form.provincia.value;
    this.servicioDirecciones.guardar(direccionAct).subscribe((rta) => {
      this.servicioDirecciones.traerUltima().subscribe((rta: any) => {
        if (rta && rta.content) {
          clientAct.direccion = rta.content[0];
        } else {
          clientAct.direccion = rta[0];
        }
      }, (error) => {
        console.log(error);
      });
      clientAct.estado = this.form.selectEstados.value;
    }, (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error al guardar',
        text: 'Se produjo un error al intentar guardar la direccion',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#0D6EFD',
      })
    });
    console.log(clientAct);
    this.servicioClientes.actualizar(clientAct).subscribe((rta) => {
      Swal.fire({
        icon: 'success',
        title: 'Reparación guardada',
        text: 'La reparación ha sido guardada en la BD exitosamente',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#0D6EFD',
      })
      this.router.navigate(["clientes"]);
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

  get form() {
    return this.clienteForm.controls;
  }

}
