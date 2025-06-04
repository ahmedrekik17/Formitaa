export interface Userinfo {
    _id: string;
    cin?:string;
    email: string;
    nom_et_prenom_arab: string;
    nom_et_prenom: string;
    phoneNumber:string;
    role: string;
}

export interface Userinfos {
    id: string;
    email: string;
    cin?:string;
    nom_et_prenom_arab: string;
    nom_et_prenom: string;
    phoneNumber:string;
    ville:string;
    date_naissance:Date;
    role: string;
    createdAt: string; // Add this property

}