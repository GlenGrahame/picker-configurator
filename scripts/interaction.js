// scripts/interaction.js
import {
  selections,
  selectedPositions,
  selectedIntegrationType,
  setIntegrationType,
  resetPositions
} from './state.js';
import { showPage } from './navigation.js';

/* ---------------- Route code helpers ---------------- */

function getRouteState() {
  return {
    platform: selections.platform || null,
    integrate: selections.integrate || null,
    integrationType:
      (typeof selectedIntegrationType === 'string' && selectedIntegrationType) || null,
    sourceAuto: selections.sourceAuto || null,
    destAuto: selections.sourceDestAuto || null,
    posSource: selectedPositions?.source || null,
    posDest: selectedPositions?.destination || null,
  };
}

function computeRouteCode() {
  const s = getRouteState();
  const key = [
    `P:${s.platform || '-'}`,
    `I:${s.integrate || '-'}`,
    `T:${s.integrationType || '-'}`,
    `SA:${s.sourceAuto || '-'}`,
    `DA:${s.destAuto || '-'}`,
    `S:${s.posSource || '-'}`,
    `D:${s.posDest || '-'}`,
  ].join('|');

  let h = 2166136261 >>> 0;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h.toString(36).slice(-6).toUpperCase();
}

function ensureRouteBadge() {
  if (document.getElementById('routeCodeBadge')) return;
  const el = document.createElement('button');
  el.id = 'routeCodeBadge';
  el.style.position = 'fixed';
  el.style.right = '12px';
  el.style.bottom = '12px';
  el.style.padding = '6px 10px';
  el.style.border = '1px solid #ccc';
  el.style.background = '#fff';
  el.style.borderRadius = '8px';
  el.style.fontSize = '12px';
  el.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
  el.style.cursor = 'pointer';
  el.title = 'Click to copy code';
  el.onclick = async () => {
    await navigator.clipboard.writeText(el.textContent.replace('Code: ', '').trim());
    el.textContent = el.textContent + ' ✓';
    setTimeout(updateRouteBadge, 800);
  };
  document.body.appendChild(el);
}

function updateRouteBadge() {
  ensureRouteBadge();
  const code = computeRouteCode();
  window.__routeCode = code;
  const el = document.getElementById('routeCodeBadge');
  if (el) el.textContent = `Code: ${code}`;
}

/* ---------------- Route overrides ---------------- */

// Map: routeCode -> { currentPageId: targetPageId, '*' : fallbackTarget }
const routeOverrides = {
  'L82O9R': {
    '*': 'sourcePlateTypePage',
    'sourcePlateTypePage': 'optionsPage',
  },
};

export function nextWithOverrides(defaultNext) {
  const code = window.__routeCode;
  const current = document.querySelector('.page.active')?.id;
  const map = routeOverrides[code];
  const target = map?.[current] || map?.['*'] || defaultNext;
  showPage(target);
}

/* ---------------- Interactions ---------------- */

export function selectPlatform(type) {
  selections['platform'] = type;

  const nextBtn = document.getElementById('platformNext');
  if (nextBtn) nextBtn.disabled = false;

  document.querySelectorAll('.image-option').forEach(opt => opt.classList.remove('selected'));
  document.getElementById(`${type.toLowerCase()}-option`)?.classList.add('selected');

  updateRouteBadge();
}

export function handlePlatformNext() {
  nextWithOverrides('integrationPage');
  updateRouteBadge();
}

export function initInteractions() {
  // “Integrate?” yes/no
  document.querySelectorAll('[data-group="integrate"] .option-box').forEach(box => {
    box.addEventListener('click', () => {
      selectOption(box.textContent.trim().toLowerCase(), 'integrate');
    });
  });

  // Integration type images
  document.querySelectorAll('#integrationTypePage .image-option').forEach(opt => {
    opt.addEventListener('click', () => {
      selectIntegration(opt.dataset.type);
    });
  });

  // Nav
  document.getElementById('platformNext')?.addEventListener('click', handlePlatformNext);
  document.getElementById('integrationDecisionNext')?.addEventListener('click', handleIntegrationNext);
  document.getElementById('integrationTypeNext')?.addEventListener('click', showNextFromIntegrationType);
  document.getElementById('positionNext')?.addEventListener('click', handlePositionNext);
  document.getElementById('sourceAutoNext')?.addEventListener('click', handleSourceAutoNext);
  document.getElementById('sourcePlateTypeNext')?.addEventListener('click', handleSourcePlateTypeNext);
  document.getElementById('sourceDestAutoNext')?.addEventListener('click', handleSourceDestAuto);

  // Source automation yes/no
  document.querySelectorAll('[data-group="sourceAuto"] .option-box').forEach((box, idx) => {
    box.addEventListener('click', () => selectSourceAutoOption(idx === 0 ? 'yes' : 'no'));
  });

  // Destination automation yes/no
  document.querySelectorAll('[data-group="sourceDestAuto"] .option-box').forEach((box, idx) => {
    box.addEventListener('click', () => selectDestinationAutomation(idx === 0 ? 'yes' : 'no'));
  });

  document.getElementById('dualDestToggle')?.addEventListener('change', handleDualDestinationToggle);

  // Multi-select source plate types
  document.querySelectorAll('#sourcePlateTypePage .multi-select').forEach(el => {
    el.addEventListener('click', () => el.classList.toggle('selected'));
  });

  // Options page buttons
  document.getElementById('optionsBack')?.addEventListener('click', () => showPage('platformPage'));
  document.getElementById('optionsFinish')?.addEventListener('click', () => alert('Finished (placeholder)'));

  updateRouteBadge();
}

export function selectOption(value, group) {
  selections[group] = value;

  const boxes = document.querySelectorAll(`.option-boxes[data-group="${group}"] .option-box`);
  boxes.forEach(box => {
    box.classList.remove('selected');
    if (box.textContent.trim().toLowerCase() === value) {
      box.classList.add('selected');
    }
  });

  if (group === 'integrate') {
    document.getElementById('integrationDecisionNext').disabled = false;
  }

  updateRouteBadge();
}

export function handleIntegrationNext() {
  if (selections['integrate'] === 'yes') {
    nextWithOverrides('integrationTypePage');
  } else {
    nextWithOverrides('sourceAutomationPage');
  }
  updateRouteBadge();
}

export function selectIntegration(type) {
  setIntegrationType(type);

  document.querySelectorAll('#integrationTypePage .image-option').forEach(opt => {
    opt.classList.remove('selected');
    if (opt.dataset.type === type) opt.classList.add('selected');
  });

  document.getElementById('integrationTypeNext').disabled = false;
  updateRouteBadge();
}

export function showNextFromIntegrationType() {
  if (['source', 'destination', 'both'].includes(selectedIntegrationType)) {
    showPositionSelectionPage();
  } else {
    nextWithOverrides('optionsPage');
  }
  updateRouteBadge();
}

export function showPositionSelectionPage() {
  showPage('positionSelectionPage');
  resetPositions();
  document.querySelectorAll('.position-box').forEach(box => box.classList.remove('selected'));
  document.getElementById('positionNext').disabled = true;

  const show = id => (document.getElementById(id).style.display = 'block');
  const hide = id => (document.getElementById(id).style.display = 'none');

  if (selectedIntegrationType === 'source') {
    show('left'); show('rear-left'); hide('right'); hide('rear-right');
  } else if (selectedIntegrationType === 'destination') {
    show('right'); show('rear-right'); hide('left'); hide('rear-left');
  } else if (selectedIntegrationType === 'both') {
    show('left'); show('rear-left'); show('right'); show('rear-right');
  } else {
    hide('left'); hide('rear-left'); hide('right'); hide('rear-right');
  }

  document.querySelectorAll('.position-box').forEach(box => {
    box.onclick = () => handlePositionSelect(box.id);
  });

  updateRouteBadge();
}

export function handlePositionSelect(id) {
  const isSource = id === 'left' || id === 'rear-left';
  const group = isSource ? 'source' : 'destination';

  if (selectedPositions[group]) {
    document.getElementById(selectedPositions[group]).classList.remove('selected');
  }

  selectedPositions[group] = id;
  document.getElementById(id).classList.add('selected');

  const valid =
    (selectedIntegrationType === 'source' && selectedPositions.source) ||
    (selectedIntegrationType === 'destination' && selectedPositions.destination) ||
    (selectedIntegrationType === 'both' && selectedPositions.source && selectedPositions.destination);

  document.getElementById('positionNext').disabled = !valid;

  updateRouteBadge();
}

export function handlePositionNext() {
  if (selectedIntegrationType === 'destination') {
    nextWithOverrides('sourceAutomationPage');
  } else if (selectedIntegrationType === 'source') {
    nextWithOverrides('sourceDestAutomationPage');
  } else {
    nextWithOverrides('optionsPage');
  }
  updateRouteBadge();
}

export function selectSourceAutoOption(value) {
  selections['sourceAuto'] = value;

  const boxes = document.querySelectorAll('[data-group="sourceAuto"] .option-box');
  boxes.forEach(box => box.classList.remove('selected'));
  document
    .querySelector(`[data-group="sourceAuto"] .option-box:nth-child(${value === 'yes' ? 1 : 2})`)
    .classList.add('selected');

  document.getElementById('sourceAutoNext').disabled = false;
  document.getElementById('sourceImage').src =
    value === 'yes' ? 'Images/K6-Trey.png' : 'Images/K6-only.png';

  updateRouteBadge();
}

export function handleSourceAutoNext() {
  const choice = selections['sourceAuto'];

  if (choice === 'yes') {
    nextWithOverrides('sourcePlateTypePage');
  } else {
    if (selectedIntegrationType === 'destination') {
      nextWithOverrides('optionsPage');
    } else {
      nextWithOverrides('sourceDestAutomationPage');
    }
  }

  updateRouteBadge();
}

export function handleSourcePlateTypeNext() {
  nextWithOverrides('sourceDestAutomationPage');
  updateRouteBadge();
}

export function handleSourceTreyNext() {
  nextWithOverrides('optionsPage');
  updateRouteBadge();
}

export function selectDestinationAutomation(value) {
  selections['sourceDestAuto'] = value;

  const boxes = document.querySelectorAll('[data-group="sourceDestAuto"] .option-box');
  boxes.forEach(box => box.classList.remove('selected'));
  document
    .querySelector(`[data-group="sourceDestAuto"] .option-box:nth-child(${value === 'yes' ? 1 : 2})`)
    .classList.add('selected');

  document.getElementById('sourceDestAutoNext').disabled = false;

  const container = document.getElementById('dualDestContainer');
  const image = document.getElementById('destinationImage');

  if (value === 'yes') {
    container.style.display = 'block';
    image.src = 'Images/Hive1.png';
  } else {
    container.style.display = 'none';
    image.src = 'Images/K6-only.png';
  }

  updateRouteBadge();
}

export function handleSourceDestAuto() {
  nextWithOverrides('optionsPage');
  updateRouteBadge();
}

export function handleDualDestinationToggle() {
  const checkbox = document.getElementById('dualDestToggle');
  const image = document.getElementById('destinationImage');
  image.src = checkbox.checked ? 'Images/Hive2.png' : 'Images/Hive1.png';
  updateRouteBadge();
}
