import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NosFormationComponent } from './nos-formation/nos-formation.component';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { UserprofileComponent } from './userprofile/userprofile.component';
import { UserHistoriqueComponent } from './user-historique/user-historique.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { SidebarDashboardadminComponent } from './sidebar-dashboardadmin/sidebar-dashboardadmin.component';
import { DashboardadminComponent } from './dashboardadmin/dashboardadmin.component';
import { GestionformaionComponent } from './gestionformaion/gestionformaion.component';
import { AjouterformationComponent } from './ajouterformation/ajouterformation.component';
import { ModifierFormationComponent } from './modifierformation/modifierformation.component';
import { GestionformateurComponent } from './gestionformateur/gestionformateur.component';
import { ModifierformateurComponent } from './modifierformateur/modifierformateur.component';
import { AjouterformateurComponent } from './ajouterformateur/ajouterformateur.component';
import { GestionuserComponent } from './gestionuser/gestionuser.component';
import { FormationEnLigneComponent } from './formation-en-ligne/formation-en-ligne.component';
import { GestionvideoComponent } from './gestionvideo/gestionvideo.component';

const routes: Routes = [
  { path:'nosformation',component:NosFormationComponent, canActivate: [AuthGuard]},
  { path:'formation/:id' ,component:FormationEnLigneComponent ,canActivate: [AuthGuard]},
  { path:'accueil',component:HomeComponent, canActivate: [AuthGuard]},
  { path:'',redirectTo:'login',pathMatch:'full'},
  { path:'login',component:LoginComponent},
  { path:'signup',component:SignupComponent},
  { path: 'profile', component: UserprofileComponent, canActivate: [AuthGuard] },
  { path: 'historique', component: UserHistoriqueComponent, canActivate: [AuthGuard] },


  { path: 'dashboard', component: DashboardadminComponent, canActivate: [AuthGuard] },


  { path: 'gestionformation/afficherformation', component: GestionformaionComponent, canActivate: [AuthGuard] },
  { path:'gestionformation',redirectTo:'gestionformation/afficherformation',pathMatch:'full'},
  { path: 'gestionformation/ajouterformation', component: AjouterformationComponent, canActivate: [AuthGuard] },
  { path: 'gestionformation/modifierformation/:id', component: ModifierFormationComponent, canActivate: [AuthGuard] },
  {
    path: 'gestionformation/videos/:id',
    component: GestionvideoComponent
  },

  { path: 'gestionformateur/afficherformateur', component: GestionformateurComponent, canActivate: [AuthGuard] },
  { path:'gestionformateur',redirectTo:'gestionformateur/afficherformateur',pathMatch:'full'},
  { path: 'gestionformateur/ajouterformateur', component: AjouterformateurComponent, canActivate: [AuthGuard] },
  { path: 'gestionformateur/modifierformateur/:id', component: ModifierformateurComponent, canActivate: [AuthGuard] },

  { path: 'gestionuser', component: GestionuserComponent, canActivate: [AuthGuard] },






];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
