// Test rapide du service statistiques
import { statisticsService } from './src/services/statisticsService.js';

async function testStatistics() {
  try {
    console.log('Test du service statistiques...');
    const data = await statisticsService.getOverviewStats();
    console.log('Données reçues:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Erreur:', error.message);
  }
}

testStatistics();