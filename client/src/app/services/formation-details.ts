export interface Formateur {
  _id: string;
  nom_et_prenom: string;
  nom_et_prenom_arab: string;
  email: string;
  phoneNumber: string;
  specialite: string;
  experience: number;
  formateur_disponible: boolean;
  status: string;
}

export interface FormationDetails {
  _id: string;
  n_action: string;
  theme_formation: string;
  loi_des_finances: string;
  lieu_de_deroulement: string;
  date_debut: Date;  // Changed from periode
  date_fin: Date;    // Added
  credit_impot: boolean;
  mode_formation: string;
  droits_de_tirage_individuel: boolean;
  droits_de_tirage_collectif: boolean;
  num_salle: string;
  etat: string;
  pause: string;
  horaire_debut: string;  // Changed from horaire
  horaire_fin: string;    // Added
  formateur?: Formateur;  // Optional, as you have it
  image?: string;        // Optional, as you have it
  video?: string;
  isRegistered?: boolean; // Optional, as you have it
}