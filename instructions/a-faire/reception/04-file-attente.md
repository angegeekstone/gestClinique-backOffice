# 🎫 Système de File d'Attente

## 🎯 Objectif
Gestion numérique de la file d'attente avec tickets et affichage temps réel.

## 🎫 Système de tickets

### 📱 Distribution tickets
- **Écran tactile** d'accueil
- **Sélection** type de consultation
- **Médecin** souhaité (optionnel)
- **Impression** ticket numéroté
- **QR Code** pour suivi mobile

### 📺 Affichage principal
- **Numéro** en cours d'appel
- **File d'attente** (5 prochains)
- **Temps d'attente** estimé
- **Messages** d'information
- **Publicité** clinique/santé

## ⏰ Gestion des temps

### ⌚ Calcul temps d'attente
- **Algorithme** basé sur l'historique
- **Ajustement** temps réel
- **Urgences** prioritaires
- **Retards** médecin pris en compte

### 🚦 Codes couleur
- **🟢 Vert** : < 15min
- **🟡 Jaune** : 15-30min
- **🟠 Orange** : 30-45min
- **🔴 Rouge** : > 45min

## 📊 Interface réception

### 🖥️ Tableau de bord
- **Liste** complète des tickets
- **Statuts** : en attente, en cours, terminé
- **Actions** : appeler, passer, annuler
- **Historique** des passages

### ⚡ Actions rapides
- **Appel suivant** (automatique)
- **Rappel patient** (si absent)
- **Passage urgent** (médecin)
- **Annulation** ticket

### 📈 Statistiques live
- **Nombre** de patients en attente
- **Temps moyen** d'attente
- **Taux d'absentéisme**
- **Efficacité** par médecin

## 🔔 Notifications patients

### 📱 Application mobile
- **Position** dans la file
- **Temps estimé** mis à jour
- **Notification** approche du tour
- **Géolocalisation** pour arrivée

### 💬 SMS
- **Position** dans la file
- **Rappel** 15min avant
- **Report** si retard médecin
- **Instructions** spéciales

## 🎛️ Gestion priorités

### 🚨 Urgences
- **Code rouge** immédiat
- **Validation** réception/médecin
- **Passage** sans ticket
- **Traçabilité** décision

### 👶 Patients spéciaux
- **Personnes âgées** (priorité légère)
- **Enfants** (consultation rapide)
- **Handicap** (accessibilité)
- **Rendez-vous** confirmés

## 📱 Intégrations

### 🏥 Système clinique
- **Synchronisation** RDV
- **Mise à jour** dossiers
- **Historique** passages
- **Facturation** automatique

### 📡 Hardware
- **Écrans** d'affichage
- **Imprimantes** tickets
- **Haut-parleurs** pour appels
- **Tablettes** distribution

## ⚙️ Configuration

### 🎯 Paramètres
- **Durée moyenne** consultation
- **Nombre** tickets maximum
- **Seuils** d'alerte attente
- **Messages** personnalisés

### 🕒 Horaires
- **Ouverture/fermeture** distribution
- **Pauses** médecin
- **Créneaux** d'urgence
- **Maintenance** système

## 🛠️ Implémentation technique
- Page `/pages/reception/FileAttente.jsx`
- Components : TicketDisplay, QueueManager, PatientCall
- Services : queueService, ticketService, notificationService
- WebSocket pour temps réel
- Hardware integration APIs