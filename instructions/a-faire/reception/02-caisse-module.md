# 💳 Module Caisse - Gestion des paiements

## 🎯 Objectif
Interface simplifiée pour la gestion des encaissements et de la facturation.

## 💰 Fonctionnalités principales

### 🧾 Encaissement
- **Sélection patient** (recherche rapide)
- **Saisie montant** avec calculatrice intégrée
- **Mode de paiement** : Espèces, CB, Chèque, Virement
- **Génération reçu** automatique
- **Impression** ticket de caisse

### 📊 Suivi journalier
- **Tableau de bord** avec totaux du jour
- **Répartition** par mode de paiement
- **Nombre** de transactions
- **Moyenne** par transaction
- **Objectifs** vs réalisé

### 📈 Rapports
- **Rapport quotidien** (fermeture de caisse)
- **Export Excel/PDF**
- **Historique** des encaissements
- **Statistiques** mensuelles
- **Comparaison** périodes

### 🔄 Gestion avancée
- **Remboursements** avec justification
- **Avoir** client
- **Règlements partiels**
- **Relances** impayés (liste)

## 🏦 Types de paiement

### 💵 Espèces
- **Rendu monnaie** automatique
- **Fond de caisse** initial
- **Contrôle** espèces vs tickets

### 💳 Carte bancaire
- **Terminal CB** virtuel
- **Numéros** de transaction
- **Rapprochement** bancaire

### 📝 Chèque
- **Vérification** validité
- **Scan/Photo** du chèque
- **Suivi** encaissement

## 🎨 Interface utilisateur
- **Écran tactile** optimisé
- **Boutons** larges et clairs
- **Raccourcis** clavier (F1-F12)
- **Mode sombre** disponible
- **Sons** de confirmation

## 📱 Fonctionnalités mobiles
- **Application** tablette
- **Paiement** mobile
- **Synchronisation** temps réel

## 🔒 Sécurité
- **Droits** limités par utilisateur
- **Audit trail** complet
- **Sauvegarde** automatique
- **Validation** supérieur pour gros montants

## 🛠️ Implémentation technique
- Page `/pages/reception/CaisseManager.jsx`
- Service `caisseService.js`
- Modèles de données : Transaction, Payment, Receipt
- Integration avec API comptable