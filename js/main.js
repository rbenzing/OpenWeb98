// js/main.js

// If WinOS is not defined, create it.
if (!window.WinOS) {
    window.WinOS = {};
}

/**
 * Welcome Dialog functionality
 */
WinOS.welcomeDialog = {
    init: function() {
        const welcomeDialog = document.getElementById('welcome-dialog');
        const closeBtn = document.getElementById('welcome-close-btn');
        const closeFooterBtn = document.getElementById('welcome-close-footer');
        const showWelcomeCheckbox = document.getElementById('show-welcome');

        // Show the welcome dialog after a short delay
        setTimeout(() => {
            welcomeDialog.style.display = 'flex';
        }, 1000);

        // Close dialog functionality
        const closeDialog = () => {
            welcomeDialog.style.display = 'none';
        };

        closeBtn.addEventListener('click', closeDialog);
        closeFooterBtn.addEventListener('click', closeDialog);

        // Close dialog when clicking outside
        welcomeDialog.addEventListener('click', (e) => {
            if (e.target === welcomeDialog) {
                closeDialog();
            }
        });

        // Handle sidebar item clicks
        const sidebarItems = document.querySelectorAll('.welcome-sidebar-item');
        sidebarItems.forEach(item => {
            item.addEventListener('click', () => {
                // Placeholder for sidebar item actions
                console.log('Clicked:', item.textContent);
            });
        });
    }
};

/**
 * Initialization method for the Windows 98 Desktop Environment.
 * It calls initialization functions for all core components.
 */
WinOS.init = function() {
    // Initialize the Desktop module
    if (WinOS.components.desktop && typeof WinOS.components.desktop.init === 'function') {
        WinOS.components.desktop.init();
    }

    // Initialize the Taskbar module
    if (WinOS.components.taskbar && typeof WinOS.components.taskbar.init === 'function') {
        WinOS.components.taskbar.init();
    }

    // Initialize the Welcome Dialog
    WinOS.welcomeDialog.init();

    // Additional component initializations can go here if needed.
    // For example: Initialize menus, windows, etc., if they have their own init() functions.

    console.log("WinOS.init() complete.");
};

// Wait until the DOM is fully loaded before initializing the desktop environment.
document.addEventListener('DOMContentLoaded', () => {
    try {
        WinOS.init();
        console.log("Win98 Desktop initialized successfully.");
    } catch (error) {
        console.error("Error initializing Win98 Desktop:", error);
    }
});
