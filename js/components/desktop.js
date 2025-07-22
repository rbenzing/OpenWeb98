// js/components/desktop.js

/**
 * Desktop Module
 * Manages the creation of desktop icons and handles related interactions.
 */
const Desktop = {
    // Initialize the desktop module.
    init: function() {
        this.cacheElements();
        this.createDesktopIcons();
        this.attachEventListeners();
    },

    // Cache the desktop container element.
    cacheElements: function() {
        this.desktopEl = document.getElementById('desktop');
    },

    // Create the initial set of desktop icons.
    createDesktopIcons: function() {
        const icons = [
            { 
                name: 'My Computer', 
                icon: 'icons/computer-3.png', 
                action: () => { 
                    if (WinOS && WinOS.components.windows) {
                        WinOS.components.windows.openMyComputer();
                    }
                } 
            },
            { 
                name: 'Recycle Bin', 
                icon: 'icons/recycle_bin_empty-0.png', 
                action: () => { 
                    if (WinOS && WinOS.components.windows) {
                        WinOS.components.windows.openRecycleBin();
                    }
                } 
            },
            {
                name: 'My Documents',
                icon: 'icons/directory_open_file_mydocs-0.png',
                action: () => {
                    if (WinOS && WinOS.components.windows) {
                        WinOS.components.windows.openMyDocuments();
                    }
                }
            },
            {
                name: 'Internet Explorer',
                icon: 'icons/msie1-0.png',
                action: () => {
                    if (WinOS && WinOS.components.windows) {
                        WinOS.components.windows.openInternetExplorer();
                    }
                }
            },
            { name: 'Network Neighborhood', icon: 'icons/network_cool_two_pcs-0.png', action: null },
            {
                name: 'Control Panel',
                icon: 'icons/directory_control_panel-0.png',
                action: () => {
                    if (WinOS && WinOS.components.windows) {
                        WinOS.components.windows.openControlPanel();
                    }
                }
            }
        ];

        icons.forEach((iconData, index) => {
            const iconElement = document.createElement('div');
            iconElement.className = 'desktop-icon';
            iconElement.innerHTML = `
                <img src="${iconData.icon}" alt="${iconData.name}">
                <span>${iconData.name}</span>
            `;

            // Position the icon in a vertical grid.
            iconElement.style.left = `${Config.DESKTOP_PADDING}px`;
            iconElement.style.top = `${Config.DESKTOP_PADDING + index * Config.ICON_HEIGHT}px`;

            // Click event: select the icon.
            iconElement.addEventListener('click', (e) => {
                if (State.selectedIcon) {
                    State.selectedIcon.classList.remove('selected');
                }
                iconElement.classList.add('selected');
                State.selectedIcon = iconElement;
                e.stopPropagation();
            });

            // Double-click event: perform the assigned action.
            iconElement.addEventListener('dblclick', () => {
                if (iconData.action) {
                    iconData.action();
                }
            });

            // Right-click (context menu) event: select the icon and show the context menu.
            iconElement.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                if (State.selectedIcon) {
                    State.selectedIcon.classList.remove('selected');
                }
                iconElement.classList.add('selected');
                State.selectedIcon = iconElement;

                if (WinOS && WinOS.components.menus) {
                    WinOS.components.menus.showIconContextMenu(e.clientX, e.clientY, iconData);
                }
            });

            this.desktopEl.appendChild(iconElement);
        });
    },

    // Attach any additional desktop-level event listeners.
    attachEventListeners: function() {
        // Clicking on the desktop background deselects icons and hides context menus.
        this.desktopEl.addEventListener('click', () => {
            if (State.selectedIcon) {
                State.selectedIcon.classList.remove('selected');
                State.selectedIcon = null;
            }
            if (WinOS && WinOS.components.menus && typeof WinOS.components.menus.hideContextMenus === 'function') {
                WinOS.components.menus.hideContextMenus();
            }
        });
    }
};

// Attach the Desktop module to the global WinOS components.
if (!window.WinOS) window.WinOS = {};
if (!window.WinOS.components) window.WinOS.components = {};
window.WinOS.components.desktop = Desktop;