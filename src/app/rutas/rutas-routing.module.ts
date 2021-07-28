import { Routes, RouterModule } from '@angular/router';
import { DominioNuevoComponent } from '../dominio/dominio-nuevo/dominio-nuevo.component';
import { DominioComponent } from '../dominio/dominio.component';

import { InicioComponent } from '../inicio/inicio.component';
import { LoginComponent } from '../login/login.component';
import { ReparacionNuevaComponent } from '../reparacion/reparacion-nueva/reparacion-nueva.component';
import { ReparacionComponent } from '../reparacion/reparacion.component';
import { Authguard } from '../services/authguard.service';

const routes: Routes = [
	{ path: 'login', component: LoginComponent },
	{ path: 'inicio', component: InicioComponent, canActivate: [Authguard] },
	{ path: 'dominios', component: DominioComponent, canActivate: [Authguard] },
	{ path: 'reparaciones', component: ReparacionComponent, canActivate: [Authguard] },
	{ path: 'dominios/:id', component: DominioNuevoComponent, canActivate: [Authguard] },
	{ path: 'reparacionnueva', component: ReparacionNuevaComponent, canActivate: [Authguard] },
	{ path: '**', redirectTo: 'inicio' },
];

export const appRoutingModule = RouterModule.forRoot(routes);
