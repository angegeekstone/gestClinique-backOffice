# Dashboard - Optimisation des Performances

## Description
Optimiser les performances du dashboard en implémentant la mise en cache, la pagination et le chargement paresseux des composants.

## Problème identifié
Le dashboard charge toutes les données simultanément, ce qui peut causer des ralentissements avec de gros volumes de données.

## Solution proposée
1. Implémenter un système de cache intelligent
2. Ajouter le chargement paresseux (lazy loading) pour les composants
3. Optimiser les requêtes API avec de la pagination
4. Ajouter des métriques de performance

## Impact Backend (gestclinique-api)
### Modifications requises :
- **Cache Redis** : Mise en cache des statistiques fréquemment consultées
- **Pagination** : Ajouter la pagination aux endpoints de listes
- **Optimisation BDD** : Index sur les colonnes de date fréquemment utilisées

### Nouveaux endpoints :
```java
@GetMapping("/reports/dashboard/metrics")
// Endpoint optimisé pour les métriques principales seulement

@GetMapping("/reports/performance/stats")
// Statistiques sur les performances du système
```

### Cache Strategy :
- Cache des statistiques globales : 5 minutes
- Cache des données patients : 2 minutes
- Cache des revenus : 10 minutes

## Impact Frontend (gestClinique-backOffice)
### Fichiers à modifier :
- `src/pages/Dashboard.jsx` : Chargement progressif des composants
- `src/services/dashboardService.js` : Gestion du cache côté client
- Tous les composants : Optimisation du rendu

### Nouvelles fonctionnalités :
1. **Cache côté client** :
   - Cache en mémoire avec TTL
   - Invalidation intelligente
   - Refresh en arrière-plan

2. **Lazy Loading** :
   - Composants chargés à la demande
   - Skeletons pendant le chargement
   - Priorité des composants visibles

3. **Optimisations React** :
   - React.memo pour les composants coûteux
   - useMemo pour les calculs complexes
   - useCallback pour les fonctions

### Composants à créer :
- `CacheProvider.jsx` : Contexte de gestion du cache
- `LazyDashboardComponent.jsx` : Wrapper pour lazy loading
- `PerformanceMonitor.jsx` : Monitoring des performances

### Hooks personnalisés :
```javascript
// useCache.js
const useCache = (key, fetcher, ttl) => {
  // Logique de cache avec TTL
}

// useLazyLoad.js
const useLazyLoad = (component) => {
  // Chargement paresseux des composants
}
```

## Tests à effectuer
- Mesurer les temps de chargement avant/après
- Tester avec de gros volumes de données
- Vérifier le comportement du cache
- Tester le lazy loading sur connexion lente
- Monitoring des performances en production

## Métriques de performance à suivre
- Temps de premier chargement (FCP)
- Temps de chargement complet
- Nombre de requêtes API simultanées
- Utilisation mémoire du cache
- Taux de cache hit/miss

## Priorité
🟢 Faible - Optimisation, mais important pour l'expérience utilisateur