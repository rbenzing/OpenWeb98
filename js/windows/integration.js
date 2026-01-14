// js/windows/integration.js

/**
 * Integration layer that enhances Windows object with new modular functionality
 * This file bridges existing windows.js with new WindowCore and WindowsApps
 */
(function() {
    // Wait for Windows object to be available
    if (typeof Windows === 'undefined') {
        console.error('Windows object not found! Load windows.js first.');
        return;
    }

    // Enhance Windows object with app launchers
    Windows.launchCalculator = function() {
        if (WindowsApps && WindowsApps.openCalculator) {
            return WindowsApps.openCalculator();
        }
    };

    Windows.launchNotepad = function(fileName, filePath) {
        if (WindowsApps && WindowsApps.openNotepad) {
            return WindowsApps.openNotepad(fileName, filePath);
        } else {
            // Fallback to existing method
            return this.createNotepadWindow();
        }
    };

    Windows.launchMinesweeper = function() {
        if (WindowsApps && WindowsApps.openMinesweeper) {
            return WindowsApps.openMinesweeper();
        }
    };

    Windows.launchSolitaire = function() {
        if (WindowsApps && WindowsApps.openSolitaire) {
            return WindowsApps.openSolitaire();
        }
    };

    Windows.launchPaint = function() {
        if (WindowsApps && WindowsApps.openPaint) {
            return WindowsApps.openPaint();
        }
    };

    // Enhanced Explorer
    Windows.launchMyComputer = function() {
        if (WindowsExplorer && WindowsExplorer.openMyComputer) {
            return WindowsExplorer.openMyComputer();
        } else {
            // Fallback to existing method
            return Windows.openMyComputer();
        }
    };

    Windows.launchControlPanel = function() {
        if (WindowsExplorer && WindowsExplorer.openControlPanel) {
            return WindowsExplorer.openControlPanel();
        } else {
            // Fallback to existing method
            return Windows.openControlPanel();
        }
    };

    // Update menus integration to use new app launchers
    if (window.Menus) {
        const originalLaunchApp = window.Menus.launchApp;
        window.Menus.launchApp = function(appName) {
            switch(appName) {
                case 'Calculator':
                    Windows.launchCalculator();
                    break;
                case 'Notepad':
                    Windows.launchNotepad();
                    break;
                case 'Paint':
                    Windows.launchPaint();
                    break;
                case 'Minesweeper':
                    Windows.launchMinesweeper();
                    break;
                case 'Solitaire':
                    Windows.launchSolitaire();
                    break;
                case 'FreeCell':
                case 'Hearts':
                    alert(`${appName} coming soon!`);
                    break;
                case 'WordPad':
                    alert('WordPad coming soon!');
                    break;
                default:
                    if (originalLaunchApp) {
                        originalLaunchApp.call(this, appName);
                    } else {
                        console.log(`App not implemented: ${appName}`);
                    }
            }
        };
    }

    console.log('Windows integration loaded successfully');
})();
