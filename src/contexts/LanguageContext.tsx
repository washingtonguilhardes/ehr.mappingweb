'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export interface Translations {
  [key: string]: string;
}

interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (language: string) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  availableLanguages: Language[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

const availableLanguages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
];

const translations: Record<string, Translations> = {
  en: {
    // Navigation
    'nav.ehr_mappings': 'EHR Mappings',
    'nav.patients': 'Patients',
    'nav.questions': 'Questions',
    'nav.data_mapper': 'Data Mapper',
    'nav.settings': 'Settings',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.create': 'Create',
    'common.update': 'Update',
    'common.close': 'Close',
    'common.active': 'Active',
    'common.inactive': 'Inactive',
    'common.required': 'Required',
    'common.optional': 'Optional',

    // Authentication
    'auth.login': 'Sign In',
    'auth.register': 'Sign Up',
    'auth.logout': 'Logout',
    'auth.email': 'Email Address',
    'auth.password': 'Password',
    'auth.first_name': 'First Name',
    'auth.last_name': 'Last Name',
    'auth.role': 'Role',
    'auth.confirm_password': 'Confirm Password',
    'auth.sign_in_title': 'Sign in to your account',
    'auth.create_account_title': 'Create your account',
    'auth.access_denied': 'Access Denied',
    'auth.no_permission': "You don't have permission to access this page.",

    // EHR Mappings
    'mappings.title': 'EHR Mappings',
    'mappings.subtitle': 'Manage field mappings for different EHR systems',
    'mappings.new_mapping': 'New Mapping',
    'mappings.ehr_system': 'EHR System',
    'mappings.field_type': 'Field Type',
    'mappings.ehr_field': 'EHR Field',
    'mappings.data_type': 'Data Type',
    'mappings.language': 'Language',
    'mappings.status': 'Status',
    'mappings.actions': 'Actions',
    'mappings.description': 'Description',
    'mappings.no_mappings': 'No mappings found',
    'mappings.create_first': 'Get started by creating a new mapping.',
    'mappings.edit_mapping': 'Edit Mapping',
    'mappings.create_mapping': 'Create New Mapping',
    'mappings.delete_confirm': 'Are you sure you want to delete this mapping?',
    'mappings.mapping_created': 'Mapping created successfully',
    'mappings.mapping_updated': 'Mapping updated successfully',
    'mappings.mapping_deleted': 'Mapping deleted successfully',
    'mappings.mapping_activated': 'Mapping activated',
    'mappings.mapping_deactivated': 'Mapping deactivated',

    // Patient Data Mapper
    'mapper.title': 'Patient Data Mapper',
    'mapper.subtitle': 'Test how patient data gets mapped to different EHR systems',
    'mapper.patient_data_input': 'Patient Data Input',
    'mapper.target_ehr_system': 'Target EHR System',
    'mapper.patient_name': 'Patient Name',
    'mapper.gender': 'Gender',
    'mapper.age': 'Age',
    'mapper.allergies': 'Allergies',
    'mapper.symptoms': 'Symptoms',
    'mapper.medications': 'Current Medications',
    'mapper.family_history': 'Family History',
    'mapper.map_to_ehr': 'Map to EHR System',
    'mapper.mapped_ehr_data': 'Mapped EHR Data',
    'mapper.successfully_mapped': 'Successfully mapped to {system}',
    'mapper.no_result': 'No mapping result',
    'mapper.enter_data_instruction': 'Enter patient data and click "Map to EHR System" to see the result.',

    // Settings
    'settings.title': 'Settings',
    'settings.subtitle': 'Configure system settings and preferences',
    'settings.general': 'General',
    'settings.language': 'Language',
    'settings.security': 'Security',
    'settings.database': 'Database',
    'settings.notifications': 'Notifications',
    'settings.users': 'Users',
    'settings.system_name': 'System Name',
    'settings.timezone': 'Timezone',
    'settings.default_language': 'Default Language',
    'settings.supported_languages': 'Supported Languages',

    // Notifications
    'notification.failed_to_load': 'Failed to load data',
    'notification.failed_to_save': 'Failed to save data',
    'notification.failed_to_delete': 'Failed to delete item',
    'notification.failed_to_update': 'Failed to update item',
    'notification.operation_successful': 'Operation completed successfully',
  },

  es: {
    // Navigation
    'nav.ehr_mappings': 'Mapeos EHR',
    'nav.patients': 'Pacientes',
    'nav.questions': 'Preguntas',
    'nav.data_mapper': 'Mapeador de Datos',
    'nav.settings': 'Configuración',

    // Common
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.success': 'Éxito',
    'common.cancel': 'Cancelar',
    'common.save': 'Guardar',
    'common.edit': 'Editar',
    'common.delete': 'Eliminar',
    'common.create': 'Crear',
    'common.update': 'Actualizar',
    'common.close': 'Cerrar',
    'common.active': 'Activo',
    'common.inactive': 'Inactivo',
    'common.required': 'Requerido',
    'common.optional': 'Opcional',

    // Authentication
    'auth.login': 'Iniciar Sesión',
    'auth.register': 'Registrarse',
    'auth.logout': 'Cerrar Sesión',
    'auth.email': 'Dirección de Correo',
    'auth.password': 'Contraseña',
    'auth.first_name': 'Nombre',
    'auth.last_name': 'Apellido',
    'auth.role': 'Rol',
    'auth.confirm_password': 'Confirmar Contraseña',
    'auth.sign_in_title': 'Inicia sesión en tu cuenta',
    'auth.create_account_title': 'Crea tu cuenta',
    'auth.access_denied': 'Acceso Denegado',
    'auth.no_permission': 'No tienes permisos para acceder a esta página.',

    // EHR Mappings
    'mappings.title': 'Mapeos EHR',
    'mappings.subtitle': 'Gestiona mapeos de campos para diferentes sistemas EHR',
    'mappings.new_mapping': 'Nuevo Mapeo',
    'mappings.ehr_system': 'Sistema EHR',
    'mappings.field_type': 'Tipo de Campo',
    'mappings.ehr_field': 'Campo EHR',
    'mappings.data_type': 'Tipo de Dato',
    'mappings.language': 'Idioma',
    'mappings.status': 'Estado',
    'mappings.actions': 'Acciones',
    'mappings.description': 'Descripción',
    'mappings.no_mappings': 'No se encontraron mapeos',
    'mappings.create_first': 'Comienza creando un nuevo mapeo.',
    'mappings.edit_mapping': 'Editar Mapeo',
    'mappings.create_mapping': 'Crear Nuevo Mapeo',
    'mappings.delete_confirm': '¿Estás seguro de que quieres eliminar este mapeo?',
    'mappings.mapping_created': 'Mapeo creado exitosamente',
    'mappings.mapping_updated': 'Mapeo actualizado exitosamente',
    'mappings.mapping_deleted': 'Mapeo eliminado exitosamente',
    'mappings.mapping_activated': 'Mapeo activado',
    'mappings.mapping_deactivated': 'Mapeo desactivado',

    // Patient Data Mapper
    'mapper.title': 'Mapeador de Datos de Pacientes',
    'mapper.subtitle': 'Prueba cómo se mapean los datos de pacientes a diferentes sistemas EHR',
    'mapper.patient_data_input': 'Entrada de Datos del Paciente',
    'mapper.target_ehr_system': 'Sistema EHR Objetivo',
    'mapper.patient_name': 'Nombre del Paciente',
    'mapper.gender': 'Género',
    'mapper.age': 'Edad',
    'mapper.allergies': 'Alergias',
    'mapper.symptoms': 'Síntomas',
    'mapper.medications': 'Medicamentos Actuales',
    'mapper.family_history': 'Historial Familiar',
    'mapper.map_to_ehr': 'Mapear al Sistema EHR',
    'mapper.mapped_ehr_data': 'Datos EHR Mapeados',
    'mapper.successfully_mapped': 'Mapeado exitosamente a {system}',
    'mapper.no_result': 'Sin resultado de mapeo',
    'mapper.enter_data_instruction': 'Ingresa datos del paciente y haz clic en "Mapear al Sistema EHR" para ver el resultado.',

    // Settings
    'settings.title': 'Configuración',
    'settings.subtitle': 'Configura las preferencias del sistema',
    'settings.general': 'General',
    'settings.language': 'Idioma',
    'settings.security': 'Seguridad',
    'settings.database': 'Base de Datos',
    'settings.notifications': 'Notificaciones',
    'settings.users': 'Usuarios',
    'settings.system_name': 'Nombre del Sistema',
    'settings.timezone': 'Zona Horaria',
    'settings.default_language': 'Idioma Predeterminado',
    'settings.supported_languages': 'Idiomas Soportados',

    // Notifications
    'notification.failed_to_load': 'Error al cargar datos',
    'notification.failed_to_save': 'Error al guardar datos',
    'notification.failed_to_delete': 'Error al eliminar elemento',
    'notification.failed_to_update': 'Error al actualizar elemento',
    'notification.operation_successful': 'Operación completada exitosamente',
  },

  fr: {
    // Navigation
    'nav.ehr_mappings': 'Mappages EHR',
    'nav.patients': 'Patients',
    'nav.questions': 'Questions',
    'nav.data_mapper': 'Mappeur de Données',
    'nav.settings': 'Paramètres',

    // Common
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    'common.cancel': 'Annuler',
    'common.save': 'Enregistrer',
    'common.edit': 'Modifier',
    'common.delete': 'Supprimer',
    'common.create': 'Créer',
    'common.update': 'Mettre à jour',
    'common.close': 'Fermer',
    'common.active': 'Actif',
    'common.inactive': 'Inactif',
    'common.required': 'Requis',
    'common.optional': 'Optionnel',

    // Authentication
    'auth.login': 'Se connecter',
    'auth.register': "S'inscrire",
    'auth.logout': 'Se déconnecter',
    'auth.email': 'Adresse e-mail',
    'auth.password': 'Mot de passe',
    'auth.first_name': 'Prénom',
    'auth.last_name': 'Nom de famille',
    'auth.role': 'Rôle',
    'auth.confirm_password': 'Confirmer le mot de passe',
    'auth.sign_in_title': 'Connectez-vous à votre compte',
    'auth.create_account_title': 'Créez votre compte',
    'auth.access_denied': 'Accès refusé',
    'auth.no_permission': "Vous n'avez pas l'autorisation d'accéder à cette page.",

    // EHR Mappings
    'mappings.title': 'Mappages EHR',
    'mappings.subtitle': 'Gérer les mappages de champs pour différents systèmes EHR',
    'mappings.new_mapping': 'Nouveau mappage',
    'mappings.ehr_system': 'Système EHR',
    'mappings.field_type': 'Type de champ',
    'mappings.ehr_field': 'Champ EHR',
    'mappings.data_type': 'Type de données',
    'mappings.language': 'Langue',
    'mappings.status': 'Statut',
    'mappings.actions': 'Actions',
    'mappings.description': 'Description',
    'mappings.no_mappings': 'Aucun mappage trouvé',
    'mappings.create_first': 'Commencez par créer un nouveau mappage.',
    'mappings.edit_mapping': 'Modifier le mappage',
    'mappings.create_mapping': 'Créer un nouveau mappage',
    'mappings.delete_confirm': 'Êtes-vous sûr de vouloir supprimer ce mappage ?',
    'mappings.mapping_created': 'Mappage créé avec succès',
    'mappings.mapping_updated': 'Mappage mis à jour avec succès',
    'mappings.mapping_deleted': 'Mappage supprimé avec succès',
    'mappings.mapping_activated': 'Mappage activé',
    'mappings.mapping_deactivated': 'Mappage désactivé',

    // Patient Data Mapper
    'mapper.title': 'Mappeur de Données Patients',
    'mapper.subtitle': 'Testez comment les données patients sont mappées vers différents systèmes EHR',
    'mapper.patient_data_input': 'Saisie des Données Patient',
    'mapper.target_ehr_system': 'Système EHR Cible',
    'mapper.patient_name': 'Nom du Patient',
    'mapper.gender': 'Genre',
    'mapper.age': 'Âge',
    'mapper.allergies': 'Allergies',
    'mapper.symptoms': 'Symptômes',
    'mapper.medications': 'Médicaments Actuels',
    'mapper.family_history': 'Antécédents Familiaux',
    'mapper.map_to_ehr': 'Mapper vers le Système EHR',
    'mapper.mapped_ehr_data': 'Données EHR Mappées',
    'mapper.successfully_mapped': 'Mappé avec succès vers {system}',
    'mapper.no_result': 'Aucun résultat de mappage',
    'mapper.enter_data_instruction': 'Saisissez les données du patient et cliquez sur "Mapper vers le Système EHR" pour voir le résultat.',

    // Settings
    'settings.title': 'Paramètres',
    'settings.subtitle': 'Configurer les paramètres et préférences du système',
    'settings.general': 'Général',
    'settings.language': 'Langue',
    'settings.security': 'Sécurité',
    'settings.database': 'Base de Données',
    'settings.notifications': 'Notifications',
    'settings.users': 'Utilisateurs',
    'settings.system_name': 'Nom du Système',
    'settings.timezone': 'Fuseau Horaire',
    'settings.default_language': 'Langue par Défaut',
    'settings.supported_languages': 'Langues Supportées',

    // Notifications
    'notification.failed_to_load': 'Échec du chargement des données',
    'notification.failed_to_save': 'Échec de la sauvegarde des données',
    'notification.failed_to_delete': 'Échec de la suppression de l\'élément',
    'notification.failed_to_update': 'Échec de la mise à jour de l\'élément',
    'notification.operation_successful': 'Opération terminée avec succès',
  },

  de: {
    // Navigation
    'nav.ehr_mappings': 'EHR-Zuordnungen',
    'nav.patients': 'Patienten',
    'nav.questions': 'Fragen',
    'nav.data_mapper': 'Daten-Mapper',
    'nav.settings': 'Einstellungen',

    // Common
    'common.loading': 'Laden...',
    'common.error': 'Fehler',
    'common.success': 'Erfolg',
    'common.cancel': 'Abbrechen',
    'common.save': 'Speichern',
    'common.edit': 'Bearbeiten',
    'common.delete': 'Löschen',
    'common.create': 'Erstellen',
    'common.update': 'Aktualisieren',
    'common.close': 'Schließen',
    'common.active': 'Aktiv',
    'common.inactive': 'Inaktiv',
    'common.required': 'Erforderlich',
    'common.optional': 'Optional',

    // Authentication
    'auth.login': 'Anmelden',
    'auth.register': 'Registrieren',
    'auth.logout': 'Abmelden',
    'auth.email': 'E-Mail-Adresse',
    'auth.password': 'Passwort',
    'auth.first_name': 'Vorname',
    'auth.last_name': 'Nachname',
    'auth.role': 'Rolle',
    'auth.confirm_password': 'Passwort bestätigen',
    'auth.sign_in_title': 'Melden Sie sich in Ihrem Konto an',
    'auth.create_account_title': 'Erstellen Sie Ihr Konto',
    'auth.access_denied': 'Zugriff verweigert',
    'auth.no_permission': 'Sie haben keine Berechtigung, auf diese Seite zuzugreifen.',

    // EHR Mappings
    'mappings.title': 'EHR-Zuordnungen',
    'mappings.subtitle': 'Verwalten Sie Feldzuordnungen für verschiedene EHR-Systeme',
    'mappings.new_mapping': 'Neue Zuordnung',
    'mappings.ehr_system': 'EHR-System',
    'mappings.field_type': 'Feldtyp',
    'mappings.ehr_field': 'EHR-Feld',
    'mappings.data_type': 'Datentyp',
    'mappings.language': 'Sprache',
    'mappings.status': 'Status',
    'mappings.actions': 'Aktionen',
    'mappings.description': 'Beschreibung',
    'mappings.no_mappings': 'Keine Zuordnungen gefunden',
    'mappings.create_first': 'Beginnen Sie mit der Erstellung einer neuen Zuordnung.',
    'mappings.edit_mapping': 'Zuordnung bearbeiten',
    'mappings.create_mapping': 'Neue Zuordnung erstellen',
    'mappings.delete_confirm': 'Sind Sie sicher, dass Sie diese Zuordnung löschen möchten?',
    'mappings.mapping_created': 'Zuordnung erfolgreich erstellt',
    'mappings.mapping_updated': 'Zuordnung erfolgreich aktualisiert',
    'mappings.mapping_deleted': 'Zuordnung erfolgreich gelöscht',
    'mappings.mapping_activated': 'Zuordnung aktiviert',
    'mappings.mapping_deactivated': 'Zuordnung deaktiviert',

    // Patient Data Mapper
    'mapper.title': 'Patientendaten-Mapper',
    'mapper.subtitle': 'Testen Sie, wie Patientendaten verschiedenen EHR-Systemen zugeordnet werden',
    'mapper.patient_data_input': 'Patientendaten-Eingabe',
    'mapper.target_ehr_system': 'Ziel-EHR-System',
    'mapper.patient_name': 'Patientenname',
    'mapper.gender': 'Geschlecht',
    'mapper.age': 'Alter',
    'mapper.allergies': 'Allergien',
    'mapper.symptoms': 'Symptome',
    'mapper.medications': 'Aktuelle Medikamente',
    'mapper.family_history': 'Familienanamnese',
    'mapper.map_to_ehr': 'Zu EHR-System zuordnen',
    'mapper.mapped_ehr_data': 'Zugeordnete EHR-Daten',
    'mapper.successfully_mapped': 'Erfolgreich zu {system} zugeordnet',
    'mapper.no_result': 'Kein Zuordnungsergebnis',
    'mapper.enter_data_instruction': 'Geben Sie Patientendaten ein und klicken Sie auf "Zu EHR-System zuordnen", um das Ergebnis zu sehen.',

    // Settings
    'settings.title': 'Einstellungen',
    'settings.subtitle': 'Systemeinstellungen und -präferenzen konfigurieren',
    'settings.general': 'Allgemein',
    'settings.language': 'Sprache',
    'settings.security': 'Sicherheit',
    'settings.database': 'Datenbank',
    'settings.notifications': 'Benachrichtigungen',
    'settings.users': 'Benutzer',
    'settings.system_name': 'Systemname',
    'settings.timezone': 'Zeitzone',
    'settings.default_language': 'Standardsprache',
    'settings.supported_languages': 'Unterstützte Sprachen',

    // Notifications
    'notification.failed_to_load': 'Fehler beim Laden der Daten',
    'notification.failed_to_save': 'Fehler beim Speichern der Daten',
    'notification.failed_to_delete': 'Fehler beim Löschen des Elements',
    'notification.failed_to_update': 'Fehler beim Aktualisieren des Elements',
    'notification.operation_successful': 'Vorgang erfolgreich abgeschlossen',
  },
};

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');

  useEffect(() => {
    // Load language from localStorage or user preference
    const savedLanguage = localStorage.getItem('preferred-language');
    if (savedLanguage && availableLanguages.some(lang => lang.code === savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const setLanguage = (language: string) => {
    setCurrentLanguage(language);
    localStorage.setItem('preferred-language', language);
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    const translation = translations[currentLanguage]?.[key] || translations['en']?.[key] || key;

    if (params) {
      return translation.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey]?.toString() || match;
      });
    }

    return translation;
  };

  const value: LanguageContextType = {
    currentLanguage,
    setLanguage,
    t,
    availableLanguages,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}


