# 🔒 Permissions & Accès - Rôle RECEPTION

## 🎯 Objectif
Définir et implémenter les permissions spécifiques au rôle RECEPTION dans l'application.

## 📋 Permissions actuelles à modifier

### ✅ Accès autorisés RECEPTION
```javascript
RECEPTION_PERMISSIONS = {
  // Patients
  'manage_patients': true,        // ✅ Déjà accordé
  'create_patients': true,        // ➕ À ajouter
  'update_patient_info': true,    // ➕ À ajouter (limité)
  'view_patient_list': true,      // ➕ À ajouter

  // Planning & RDV
  'view_schedule': true,          // ✅ Déjà accordé
  'manage_appointments': true,    // ➕ À ajouter
  'create_appointments': true,    // ➕ À ajouter
  'cancel_appointments': true,    // ➕ À ajouter

  // Paiements
  'manage_payments': true,        // ✅ Déjà accordé
  'process_payments': true,       // ➕ À ajouter
  'generate_receipts': true,      // ➕ À ajouter
  'view_payment_history': true,   // ➕ À ajouter

  // Documents (lecture seule)
  'view_documents': true,         // ➕ À ajouter
  'print_documents': true,        // ➕ À ajouter

  // File d'attente
  'manage_queue': true,           // ➕ À ajouter
  'call_patients': true,          // ➕ À ajouter
}
```

### ❌ Accès interdits RECEPTION
```javascript
RECEPTION_RESTRICTIONS = {
  // Données médicales
  'view_medical_records': false,
  'edit_medical_records': false,
  'create_prescriptions': false,
  'view_medical_notes': false,

  // Administration
  'manage_users': false,
  'view_reports': false,
  'manage_clinic_settings': false,
  'manage_finances_advanced': false,

  // Documents médicaux
  'create_medical_documents': false,
  'edit_medical_documents': false,
  'delete_documents': false,
}
```

## 🔧 Modifications AuthContext

### 📝 Mise à jour PERMISSIONS
```javascript
// Ajouter dans AuthContext.jsx
export const PERMISSIONS = {
  // ... permissions existantes

  // Nouvelles permissions RECEPTION
  CREATE_PATIENTS: 'create_patients',
  UPDATE_PATIENT_INFO: 'update_patient_info',
  VIEW_PATIENT_LIST: 'view_patient_list',
  MANAGE_APPOINTMENTS: 'manage_appointments',
  CREATE_APPOINTMENTS: 'create_appointments',
  CANCEL_APPOINTMENTS: 'cancel_appointments',
  PROCESS_PAYMENTS: 'process_payments',
  GENERATE_RECEIPTS: 'generate_receipts',
  VIEW_PAYMENT_HISTORY: 'view_payment_history',
  VIEW_DOCUMENTS: 'view_documents',
  PRINT_DOCUMENTS: 'print_documents',
  MANAGE_QUEUE: 'manage_queue',
  CALL_PATIENTS: 'call_patients'
};
```

### 🎭 Mise à jour rolePermissions
```javascript
[ROLES.RECEPTION]: [
  // Permissions existantes
  PERMISSIONS.MANAGE_PATIENTS,
  PERMISSIONS.MANAGE_PAYMENTS,
  PERMISSIONS.VIEW_SCHEDULE,

  // Nouvelles permissions
  PERMISSIONS.CREATE_PATIENTS,
  PERMISSIONS.UPDATE_PATIENT_INFO,
  PERMISSIONS.VIEW_PATIENT_LIST,
  PERMISSIONS.MANAGE_APPOINTMENTS,
  PERMISSIONS.CREATE_APPOINTMENTS,
  PERMISSIONS.CANCEL_APPOINTMENTS,
  PERMISSIONS.PROCESS_PAYMENTS,
  PERMISSIONS.GENERATE_RECEIPTS,
  PERMISSIONS.VIEW_PAYMENT_HISTORY,
  PERMISSIONS.VIEW_DOCUMENTS,
  PERMISSIONS.PRINT_DOCUMENTS,
  PERMISSIONS.MANAGE_QUEUE,
  PERMISSIONS.CALL_PATIENTS
]
```

## 🎨 Mise à jour Sidebar

### 📱 Modules accessibles RECEPTION
```javascript
// Dans Sidebar.jsx - section commune
{
  title: 'Patients',
  icon: Users,
  href: '/patients',
  roles: ['ADMIN_CLINIQUE', 'MEDECIN', 'RECEPTION'], // ➕ Ajouter RECEPTION
},
{
  title: 'Documents',
  icon: FileText,
  href: '/documents',
  roles: ['ADMIN_CLINIQUE', 'MEDECIN', 'RECEPTION'], // ➕ Ajouter RECEPTION (lecture seule)
}
```

## 🛡️ Composants de protection

### 🔒 ProtectedComponent
```javascript
// Créer un composant pour gérer les permissions granulaires
function ProtectedAction({ permission, children, fallback = null }) {
  const { hasPermission } = useAuth();

  if (!hasPermission(permission)) {
    return fallback;
  }

  return children;
}

// Usage
<ProtectedAction permission="update_patient_info">
  <button onClick={editPatient}>Modifier</button>
</ProtectedAction>
```

### 🎯 Hooks personnalisés
```javascript
// Hook pour vérifications multiples
function useReceptionPermissions() {
  const { hasPermission } = useAuth();

  return {
    canManagePatients: hasPermission('manage_patients'),
    canCreateAppointments: hasPermission('create_appointments'),
    canProcessPayments: hasPermission('process_payments'),
    canViewDocuments: hasPermission('view_documents'),
    canManageQueue: hasPermission('manage_queue')
  };
}
```

## 🚦 Contrôles d'accès par page

### 📄 Pages RECEPTION avec restrictions
```javascript
// Documents.jsx - Vue limitée pour RECEPTION
if (hasRole('RECEPTION')) {
  // Masquer boutons création/édition
  // Afficher seulement consultation/impression
  // Filtrer types de documents visibles
}

// Patients.jsx - Accès étendu pour RECEPTION
if (hasRole('RECEPTION')) {
  // Autoriser création/modification infos contact
  // Masquer données médicales sensibles
  // Afficher historique RDV/paiements
}
```

## ⚙️ Implémentation backend

### 🔒 Annotations sécurité
```java
// Dans les controllers Java
@PreAuthorize("hasRole('RECEPTION') or hasRole('ADMIN_CLINIQUE')")
public ResponseEntity<Patient> createPatient(@RequestBody Patient patient)

@PreAuthorize("hasRole('RECEPTION') and hasPermission('manage_appointments')")
public ResponseEntity<Appointment> createAppointment(@RequestBody Appointment appointment)
```

## 📝 Tests permissions
- [ ] Vérifier accès pages autorisées
- [ ] Vérifier blocage pages interdites
- [ ] Tester actions granulaires
- [ ] Valider messages d'erreur appropriés