export interface Company {
    _id?: string;
    siren?: string;
    siret?: string;
    date_creation?: string;
    denomination?: string;
    categorie_entreprise?: string;
    activitite_principale_legale?: string | 'NAF' | 'APE';
    adresse_etablissement?: {
        typeVoieEtablissement?: string;
        libelleVoieEtablissement?: string;
        codePostalEtablissement?: string;
        libelleCommuneEtablissement?: string;
    };
    etat?: string | 'refusé' | 'en attente' | 'validé';
    created_at?: Date;
    updated_at?: Date;
}