// scripts/main.js

import {
    initInteractions,
    selectPlatform,
    handleIntegrationNext,
    handleSourceAutoNext,
    handleSourceDestAuto,
    showNextFromIntegrationType,
    handlePositionNext
} from './interaction.js';

import { initNavigation, showPage } from './navigation.js';

window.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initInteractions();
});

// Expose functions to global window object for HTML inline onclicks
window.selectPlatform = selectPlatform;
window.handleIntegrationNext = handleIntegrationNext;
window.handleSourceAutoNext = handleSourceAutoNext;
window.handleSourceDestAuto = handleSourceDestAuto;
window.showNextFromIntegrationType = showNextFromIntegrationType;
window.handlePositionNext = handlePositionNext;
window.showPage = showPage;
