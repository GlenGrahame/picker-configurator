// scripts/navigation.js

export function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

export function initNavigation() {
    // Navigation hooks can be added here if needed in future.
}
