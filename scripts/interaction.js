// scripts/interaction.js

import { selections, selectedPositions, selectedIntegrationType, setIntegrationType, resetPositions } from './state.js';
import { showPage } from './navigation.js';

export function selectPlatform(type) {
    selections['platform'] = type;
    document.getElementById("platformNext").disabled = false;

    // Remove "selected" class from all options
    document.querySelectorAll('.image-option').forEach(opt => {
        opt.classList.remove('selected');
    });

    // Add "selected" class to the clicked one
    document.getElementById(`${type.toLowerCase()}-option`).classList.add('selected');
}

export function initInteractions() {
    document.querySelectorAll('[data-group="integrate"] .option-box').forEach(box => {
        box.addEventListener('click', () => {
            selectOption(box.textContent.trim().toLowerCase(), 'integrate');
        });
    });

    document.querySelectorAll('#integrationTypePage .image-option').forEach(opt => {
        opt.addEventListener('click', () => {
            selectIntegration(opt.dataset.type);
        });
    });

    document.getElementById("integrationDecisionNext")?.addEventListener('click', handleIntegrationNext);
    document.getElementById("integrationTypeNext")?.addEventListener('click', showNextFromIntegrationType);
    document.getElementById("positionNext")?.addEventListener('click', handlePositionNext);
    document.querySelectorAll('[data-group="sourceAuto"] .option-box').forEach((box, idx) => {
        box.addEventListener('click', () => selectSourceAutoOption(idx === 0 ? 'yes' : 'no'));
    });
    document.getElementById("sourceAutoNext")?.addEventListener('click', handleSourceAutoNext);
    document.getElementById("sourceDestAutoNext")?.addEventListener('click', handleSourceDestAuto);
    document.getElementById("dualDestToggle")?.addEventListener('change', handleDualDestinationToggle);

    document.querySelectorAll('[data-group="sourceDestAuto"] .option-box').forEach((box, idx) => {
        box.addEventListener('click', () => selectDestinationAutomation(idx === 0 ? 'yes' : 'no'));
    });

    document.querySelectorAll('#sourcePlateTypePage .multi-select').forEach(el => {
        el.addEventListener('click', () => el.classList.toggle('selected'));
    });
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
}

export function handleIntegrationNext() {
    if (selections['integrate'] === 'yes') {
        showPage('integrationTypePage');
    } else {
        showPage('sourceAutomationPage');
    }
}

export function selectIntegration(type) {
    setIntegrationType(type);
    document.querySelectorAll('#integrationTypePage .image-option').forEach(opt => {
        opt.classList.remove('selected');
        if (opt.dataset.type === type) {
            opt.classList.add('selected');
        }
    });
    document.getElementById("integrationTypeNext").disabled = false;
}

export function showNextFromIntegrationType() {
    if (["source", "destination", "both"].includes(selectedIntegrationType)) {
        showPositionSelectionPage();
    } else {
        showPage("optionsPage");
    }
}

export function showPositionSelectionPage() {
    showPage("positionSelectionPage");
    resetPositions();
    document.querySelectorAll(".position-box").forEach(box => box.classList.remove("selected"));
    document.getElementById("positionNext").disabled = true;

    const show = id => document.getElementById(id).style.display = 'block';
    const hide = id => document.getElementById(id).style.display = 'none';

    if (selectedIntegrationType === 'source') {
        show('left'); show('rear-left'); hide('right'); hide('rear-right');
    } else if (selectedIntegrationType === 'destination') {
        show('right'); show('rear-right'); hide('left'); hide('rear-left');
    } else if (selectedIntegrationType === 'both') {
        show('left'); show('rear-left'); show('right'); show('rear-right');
    } else {
        hide('left'); hide('rear-left'); hide('right'); hide('rear-right');
    }

    document.querySelectorAll(".position-box").forEach(box => {
        box.onclick = () => handlePositionSelect(box.id);
    });
}

export function handlePositionSelect(id) {
    const isSource = (id === 'left' || id === 'rear-left');
    const isDestination = (id === 'right' || id === 'rear-right');
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
}

export function handlePositionNext() {
    if (selectedIntegrationType === 'destination') {
        showPage('sourceAutomationPage');
    } else if (selectedIntegrationType === 'source') {
        showPage('sourceDestAutomationPage');
    } else {
        showPage('optionsPage');
    }
}

export function selectSourceAutoOption(value) {
    selections['sourceAuto'] = value;
    const boxes = document.querySelectorAll('[data-group="sourceAuto"] .option-box');
    boxes.forEach(box => box.classList.remove('selected'));
    document.querySelector(`[data-group="sourceAuto"] .option-box:nth-child(${value === 'yes' ? 1 : 2})`).classList.add('selected');
    document.getElementById('sourceAutoNext').disabled = false;
    document.getElementById('sourceImage').src = value === 'yes' ? 'Images/K6-Trey.png' : 'Images/K6-only.png';
}

export function handleSourceAutoNext() {
    const choice = selections['sourceAuto'];

    if (choice === 'yes') {
        showPage('sourcePlateTypePage');
    } else {
        if (selectedIntegrationType === 'destination') {
            showPage('optionsPage');
        } else {
            showPage('sourceDestAutomationPage');
        }
    }
}

export function selectDestinationAutomation(value) {
    selections['sourceDestAuto'] = value;
    const boxes = document.querySelectorAll('[data-group="sourceDestAuto"] .option-box');
    boxes.forEach(box => box.classList.remove('selected'));
    document.querySelector(`[data-group="sourceDestAuto"] .option-box:nth-child(${value === 'yes' ? 1 : 2})`).classList.add('selected');
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
}

export function handleSourceDestAuto() {
    showPage('optionsPage');
}

export function handleDualDestinationToggle() {
    const checkbox = document.getElementById('dualDestToggle');
    const image = document.getElementById('destinationImage');
    image.src = checkbox.checked ? 'Images/Hive2.png' : 'Images/Hive1.png';
}






