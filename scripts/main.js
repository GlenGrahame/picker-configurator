// scripts/main.js
import { initNavigation } from './navigation.js';
import { initInteractions } from './interaction.js';

window.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initInteractions();
});
import { selectPlatform, handleIntegrationNext, handleSourceAutoNext, handleSourceDestAuto, showNextFromIntegrationType, handlePositionNext } from './interaction.js';
import { showPage } from './navigation.js';

// Expose to global window for HTML to access
window.selectPlatform = selectPlatform;
window.handleIntegrationNext = handleIntegrationNext;
window.handleSourceAutoNext = handleSourceAutoNext;
window.handleSourceDestAuto = handleSourceDestAuto;
window.showNextFromIntegrationType = showNextFromIntegrationType;
window.handlePositionNext = handlePositionNext;
window.showPage = showPage;

