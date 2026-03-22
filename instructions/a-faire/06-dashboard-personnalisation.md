# Dashboard - Personnalisation par Rôle

## Description
Permettre aux utilisateurs de personnaliser leur dashboard en choisissant quels widgets afficher et dans quel ordre selon leur rôle.

## Problème identifié
Le dashboard est identique pour tous les utilisateurs d'un même rôle. Les besoins peuvent varier selon les préférences individuelles.

## Solution proposée
1. Ajouter un mode édition du dashboard
2. Permettre de masquer/afficher des widgets
3. Implémenter le drag & drop pour réorganiser
4. Sauvegarder les préférences utilisateur

## Impact Backend (gestclinique-api)
### Nouvelles entités :
```java
@Entity
public class DashboardPreferences {
    private Long userId;
    private String layout; // JSON configuration
    private List<String> hiddenWidgets;
    private Map<String, Integer> widgetOrder;
}
```

### Nouveaux endpoints :
```java
@GetMapping("/api/user/dashboard/preferences")
@PostMapping("/api/user/dashboard/preferences")
@PutMapping("/api/user/dashboard/preferences")
```

### Modifications requises :
- `UserController.java` : Endpoints de préférences
- `UserService.java` : Gestion des préférences
- `DashboardPreferencesRepository.java` : Nouveau repository

## Impact Frontend (gestClinique-backOffice)
### Fichiers à modifier :
- `src/pages/Dashboard.jsx` : Mode édition et layout dynamique
- `src/services/userService.js` : Gestion des préférences
- `src/components/dashboard/` : Tous les widgets avec possibilité de masquer

### Nouvelles fonctionnalités :
1. **Mode édition** :
   - Bouton "Personnaliser" en haut à droite
   - Interface drag & drop pour réorganiser
   - Toggles pour masquer/afficher les widgets

2. **Widgets configurables** :
   - Taille ajustable (petit, moyen, grand)
   - Position modifiable
   - Paramètres spécifiques par widget

3. **Presets par rôle** :
   - Configuration par défaut pour chaque rôle
   - Possibilité de revenir aux paramètres par défaut
   - Templates recommandés

### Composants à créer :
- `DashboardEditor.jsx` : Interface d'édition
- `WidgetContainer.jsx` : Container drag & drop
- `WidgetSelector.jsx` : Sélecteur de widgets disponibles
- `LayoutPresets.jsx` : Templates prédéfinis

### Librairies nécessaires :
```json
{
  "@dnd-kit/core": "^6.0.0",
  "@dnd-kit/sortable": "^8.0.0",
  "react-grid-layout": "^1.4.0"
}
```

## Widgets disponibles par rôle

### ADMIN_CLINIQUE :
- Statistiques patients
- Revenus et finances
- Performance médecins
- Occupation des salles
- Graphiques analytiques
- Alertes système

### MEDECIN :
- Mes patients du jour
- Mes prochains RDV
- Mes statistiques
- Messages/Notifications
- Planning personnel

### RECEPTION :
- RDV du jour
- Patients en attente
- Encaissements
- Nouvelles inscriptions
- Alertes RDV

## Tests à effectuer
- Tester le drag & drop sur différents écrans
- Vérifier la sauvegarde des préférences
- Tester les presets par rôle
- Vérifier la responsivité avec différents layouts
- Tester la restauration des paramètres par défaut

## Priorité
🟢 Faible - Amélioration de l'expérience utilisateur, mais pas critique