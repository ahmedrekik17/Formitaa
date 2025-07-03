import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from "@angular/common/http";


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NosFormationComponent } from './nos-formation/nos-formation.component';
import { FormationCardComponent } from './formation-card/formation-card.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { UserprofileComponent } from './userprofile/userprofile.component';
import { SidebarProfileComponent } from './sidebar-profile/sidebar-profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SidebarUserhistoriqueComponent } from './sidebar-userhistorique/sidebar-userhistorique.component';
import { UserHistoriqueComponent } from './user-historique/user-historique.component';
import { AlertMessageComponent } from './alert-message/alert-message.component';
import { ModalMessageComponent } from './modal-message/modal-message.component';
import { SidebarDashboardadminComponent } from './sidebar-dashboardadmin/sidebar-dashboardadmin.component';
import { DashboardadminComponent } from './dashboardadmin/dashboardadmin.component';
import { SidebarGestionformaionComponent } from './sidebar-gestionformaion/sidebar-gestionformaion.component';
import { GestionformaionComponent } from './gestionformaion/gestionformaion.component';
import { AjouterformationComponent } from './ajouterformation/ajouterformation.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ModifierFormationComponent } from './modifierformation/modifierformation.component';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { GestionformateurComponent } from './gestionformateur/gestionformateur.component';
import { AjouterformateurComponent } from './ajouterformateur/ajouterformateur.component';
import { ModifierformateurComponent } from './modifierformateur/modifierformateur.component';
import { SidebarGestionformateurComponent } from './sidebar-gestionformateur/sidebar-gestionformateur.component';
import { FormateurDetailsComponent } from './formateur-details/formateur-details.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { SidebarGestionuserComponent } from './sidebar-gestionuser/sidebar-gestionuser.component';
import { GestionuserComponent } from './gestionuser/gestionuser.component';
import { FormationEnLigneComponent } from './formation-en-ligne/formation-en-ligne.component';
import { GestionvideoComponent } from './gestionvideo/gestionvideo.component';
import { CalendrierFormationsComponent } from './calendrier-formations/calendrier-formations.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    FooterComponent,
    NosFormationComponent,
    FormationCardComponent,
    LoginComponent,
    SignupComponent,
    UserprofileComponent,
    SidebarProfileComponent,
    SidebarUserhistoriqueComponent,
    UserHistoriqueComponent,
    AlertMessageComponent,
    ModalMessageComponent,
    SidebarDashboardadminComponent,
    DashboardadminComponent,
    SidebarGestionformaionComponent,
    GestionformaionComponent,
    AjouterformationComponent,
    ModifierFormationComponent,
    ConfirmationModalComponent,
    GestionformateurComponent,
    AjouterformateurComponent,
    ModifierformateurComponent,
    SidebarGestionformateurComponent,
    FormateurDetailsComponent,
    UserDetailsComponent,
    SidebarGestionuserComponent,
    GestionuserComponent,
    FormationEnLigneComponent,
    GestionvideoComponent,
    CalendrierFormationsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxPaginationModule


  ],
  exports: [
    AlertMessageComponent  // ✅ Export it for global use
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
