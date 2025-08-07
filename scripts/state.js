// scripts/state.js

export const selections = {};
export let selectedIntegrationType = null;
export let selectedPositions = { source: null, destination: null };

export function setIntegrationType(type) {
    selectedIntegrationType = type;
}

export function resetPositions() {
    selectedPositions = { source: null, destination: null };
}
