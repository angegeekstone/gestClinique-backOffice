# 📅 Planning & Rendez-vous - Vue Reception

## 🎯 Objectif
Interface planning optimisée pour la prise et gestion des rendez-vous côté accueil.

## 📋 Fonctionnalités principales

### 📞 Prise de RDV
- **Recherche patient** rapide (nom/téléphone)
- **Créneaux disponibles** par médecin
- **Durée** consultation personnalisable
- **Motif** consultation (liste prédéfinie)
- **Rappel SMS/email** automatique

### 📊 Vue planning
- **Calendrier hebdomadaire** par médecin
- **Vue journalière** détaillée
- **Codes couleur** par type de consultation
- **Indicateurs** : confirmé, en attente, urgent
- **Glisser-déposer** pour reprogrammer

### ✅ Gestion des confirmations
- **Liste** RDV à confirmer (J-1)
- **Appels** téléphoniques avec script
- **SMS** de rappel automatique
- **Statuts** : confirmé, reporté, annulé

### ⏰ File d'attente temps réel
- **Patients présents** en attente
- **Temps d'attente** estimé
- **Notifications** médecin/patient
- **Gestion urgences** et priorités

## 🔄 Gestions spéciales

### 📋 Liste d'attente
- **Patients** sans RDV disponible
- **Notification** créneaux libérés
- **Priorité** par ancienneté demande
- **Contact** automatique si place libre

### 🚨 Urgences
- **Créneaux** d'urgence réservés
- **Escalade** vers médecin de garde
- **Protocole** d'évaluation urgence
- **Redirection** vers urgences hospitalières

### 📱 Rappels & Notifications
- **SMS** J-1 et H-2
- **Email** de confirmation
- **Appels** téléphoniques si besoin
- **Personnalisation** messages par médecin

## 🎨 Interface reception

### 📺 Écran principal
- **Vue d'ensemble** du jour
- **Prochains** RDV (30min)
- **Retards** et absents
- **Alertes** importantes

### 🖱️ Actions rapides
- **F1** : Nouveau RDV
- **F2** : Recherche patient
- **F3** : Planning médecin
- **F4** : Liste d'attente
- **F5** : Urgences

### 📊 Statistiques temps réel
- **Taux occupation** médecins
- **Temps attente** moyen
- **Annulations** du jour
- **RDV** restants

## 🔗 Intégrations

### 📞 Téléphonie
- **Click-to-call** depuis planning
- **Historique** appels patient
- **Messages** vocaux
- **Transfert** vers médecin

### 💬 SMS/Email
- **Templates** personnalisables
- **Envoi** automatique ou manuel
- **Accusés** de réception
- **Opt-out** patients

## ⚙️ Configuration

### 🕒 Créneaux
- **Durée** par type consultation
- **Pauses** automatiques médecin
- **Créneaux** d'urgence
- **Indisponibilités** médecin

### 📝 Motifs consultation
- **Liste** prédéfinie modifiable
- **Durée** associée
- **Médecin** spécialisé
- **Priorité** (normal/urgent)

## 🛠️ Implémentation technique
- Page `/pages/reception/PlanningManager.jsx`
- Components : Calendar, TimeSlot, PatientQueue
- Services : planningService, smsService, notificationService
- WebSocket pour temps réel