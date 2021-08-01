import { Routes, RouterModule } from '@angular/router';
import { ClienteNuevoComponent } from '../clientes/cliente-nuevo/cliente-nuevo.component';
import { InicioComponent } from '../inicio/inicio.component';
import { LoginComponent } from '../login/login.component';
import { ReparacionDetalleComponent } from '../reparacion/reparacion-detalle/reparacion-detalle.component';
import { ReparacionNuevaComponent } from '../reparacion/reparacion-nueva/reparacion-nueva.component';
import { ReparacionComponent } from '../reparacion/reparacion.component';
import { Authguard } from '../services/authguard.service';

const routes: Routes = [
	{ path: 'login', component: LoginComponent },
	{ path: 'inicio', component: InicioComponent, canActivate: [Authguard] },
	{ path: 'reparaciones', component: ReparacionComponent, canActivate: [Authguard] },
	{ path: 'reparaciones/nueva', component: ReparacionNuevaComponent, canActivate: [Authguard] },
	{ path: 'reparaciones/:id', component: ReparacionDetalleComponent, canActivate: [Authguard] },
	{ path: 'clientes/nuevo', component: ClienteNuevoComponent, canActivate: [Authguard] },
	{ path: '**', redirectTo: 'reparaciones' },
];

export const appRoutingModule = RouterModule.forRoot(routes);
