// scripts/main.js
import { initNavigation } from './navigation.js';
import {
  initInteractions,
  selectPlatform,
  handlePlatformNext,
  handleIntegrationNext,
  handleSourceAutoNext,
  handleSourceDestAuto,
  showNextFromIntegrationType,
  handlePositionNext,
  handleSourcePlateTypeNext,
  handleSourceTreyNext,
} from './interaction.js';
import { showPage } from './navigation.js';

window.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initInteractions();
});

// Expose to window for HTML onclicks
window.selectPlatform = selectPlatform;
window.handlePlatformNext = handlePlatformNext;
window.handleIntegrationNext = handleIntegrationNext;
window.handleSourceAutoNext = handleSourceAutoNext;
window.handleSourceDestAuto = handleSourceDestAuto;
window.showNextFromIntegrationType = showNextFromIntegrationType;
window.handlePositionNext = handlePositionNext;
window.handleSourcePlateTypeNext = handleSourcePlateTypeNext;
window.handleSourceTreyNext = handleSourceTreyNext;
window.showPage = showPage;
