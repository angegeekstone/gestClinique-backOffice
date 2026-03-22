# 👤 Patients Reception - Gestion simplifiée

## 🎯 Objectif
Créer une interface patients adaptée au rôle RECEPTION avec des fonctionnalités d'accueil.

## 📝 Fonctionnalités requises

### ✅ Consultation
- **Liste patients** avec recherche rapide
- **Informations essentielles** : nom, téléphone, dernière visite
- **Statut** : actif, inactif, nouveau
- **Alertes** : patients en retard, suivis spéciaux

### ✏️ Modification limitée
- **Coordonnées** : adresse, téléphone, email
- **Informations administratives** : mutuelle, carte vitale
- **Contacts d'urgence**
- **Notes d'accueil** (allergies visibles, préférences)

### 🆕 Nouveau patient
- **Formulaire simplifié** d'inscription
- **Vérification** doublon automatique
- **Affectation** médecin traitant
- **Génération** numéro patient

### 🔍 Recherche avancée
- **Par nom** (recherche partielle)
- **Par téléphone**
- **Par date de naissance**
- **Par numéro sécurité sociale**

## 🚫 Restrictions
- **Pas d'accès** aux données médicales
- **Pas de modification** des dossiers médicaux
- **Lecture seule** sur les consultations
- **Pas de suppression** de patients

## 🎨 Interface
- **Vue liste** compacte avec filtres
- **Fiche patient** avec onglets (Admin/Contact/RDV)
- **Boutons d'action** contextuels
- **Indicateurs visuels** (nouveau, urgent, etc.)

## 🔧 Implémentation
- Créer `/pages/reception/PatientsManager.jsx`
- Adapter les permissions dans `AuthContext`
- Modifier `Sidebar.jsx` pour accès RECEPTION
- Créer services API spécifiques RECEPTION