// js/components/menus.js

/**
 * Menus Module
 * Handles the display and positioning of context menus (desktop and icon-specific) and manages Start menu interactions.
 */
const Menus = {
    // Show the desktop context menu at position (x, y)
    showDesktopContextMenu: function(x, y) {
        const desktopContextMenu = document.getElementById('desktop-context-menu');
        desktopContextMenu.style.display = 'block';
        desktopContextMenu.style.left = `${x}px`;
        desktopContextMenu.style.top = `${y}px`;

        // Ensure the menu doesn't overflow the viewport.
        const menuRect = desktopContextMenu.getBoundingClientRect();
        if (menuRect.right > window.innerWidth) {
            desktopContextMenu.style.left = `${window.innerWidth - menuRect.width}px`;
        }
        if (menuRect.bottom > window.innerHeight) {
            desktopContextMenu.style.top = `${window.innerHeight - menuRect.height}px`;
        }

        State.contextMenuOpen = true;

        // Close the context menu when clicking outside.
        setTimeout(() => {
            const closeContextMenu = function (e) {
                if (!desktopContextMenu.contains(e.target)) {
                    desktopContextMenu.style.display = 'none';
                    State.contextMenuOpen = false;
                    document.removeEventListener('click', closeContextMenu);
                }
            };
            document.addEventListener('click', closeContextMenu);
        }, 0);
    },

    // Hide any open context menus.
    hideContextMenus: function() {
        const desktopContextMenu = document.getElementById('desktop-context-menu');
        if (desktopContextMenu) {
            desktopContextMenu.style.display = 'none';
        }
        const iconContextMenu = document.getElementById('icon-context-menu');
        if (iconContextMenu) {
            iconContextMenu.style.display = 'none';
        }
        State.contextMenuOpen = false;
    },

    // Show the icon context menu at position (x, y) with options specific to the passed icon data.
    showIconContextMenu: function(x, y, iconData) {
        // Remove an existing icon context menu if present.
        const existingMenu = document.getElementById('icon-context-menu');
        if (existingMenu) {
            existingMenu.parentElement.removeChild(existingMenu);
        }

        // Create a new context menu element.
        const menu = document.createElement('div');
        menu.id = 'icon-context-menu';
        menu.className = 'context-menu';

        // Build menu items based on the type of icon.
        if (iconData.name === 'Recycle Bin') {
            menu.innerHTML = `
                <div class="context-menu-item" data-action="open">
                    <img src="icons/directory_open-0.png" alt="Open">
                    <span>Open</span>
                </div>
                <div class="context-menu-separator"></div>
                <div class="context-menu-item" data-action="empty">
                    <img src="icons/recycle_bin_empty-0.png" alt="Empty">
                    <span>Empty Recycle Bin</span>
                </div>
                <div class="context-menu-separator"></div>
                <div class="context-menu-item" data-action="rename">
                    <img src="icons/textfield_rename-0.png" alt="Rename">
                    <span>Rename</span>
                </div>
                <div class="context-menu-separator"></div>
                <div class="context-menu-item" data-action="properties">
                    <img src="icons/properties-0.png" alt="Properties">
                    <span>Properties</span>
                </div>
            `;
        } else {
            menu.innerHTML = `
                <div class="context-menu-item" data-action="open">
                    <img src="icons/directory_open-0.png" alt="Open">
                    <span>Open</span>
                </div>
                <div class="context-menu-separator"></div>
                <div class="context-menu-item" data-action="cut">
                    <img src="icons/cut-0.png" alt="Cut">
                    <span>Cut</span>
                </div>
                <div class="context-menu-item" data-action="copy">
                    <img src="icons/copy-0.png" alt="Copy">
                    <span>Copy</span>
                </div>
                <div class="context-menu-separator"></div>
                <div class="context-menu-item" data-action="delete">
                    <img src="icons/delete_file-0.png" alt="Delete">
                    <span>Delete</span>
                </div>
                <div class="context-menu-separator"></div>
                <div class="context-menu-item" data-action="rename">
                    <img src="icons/textfield_rename-0.png" alt="Rename">
                    <span>Rename</span>
                </div>
                <div class="context-menu-item" data-action="properties">
                    <img src="icons/properties-0.png" alt="Properties">
                    <span>Properties</span>
                </div>
            `;
        }

        // Append and position the context menu.
        document.body.appendChild(menu);
        menu.style.display = 'block';
        menu.style.left = `${x}px`;
        menu.style.top = `${y}px`;

        // Adjust position if the menu goes offscreen.
        const menuRect = menu.getBoundingClientRect();
        if (menuRect.right > window.innerWidth) {
            menu.style.left = `${window.innerWidth - menuRect.width}px`;
        }
        if (menuRect.bottom > window.innerHeight) {
            menu.style.top = `${window.innerHeight - menuRect.height}px`;
        }

        State.contextMenuOpen = true;

        // Attach event listeners on menu items.
        menu.querySelectorAll('.context-menu-item').forEach(item => {
            item.addEventListener('click', function() {
                const action = this.getAttribute('data-action');
                if (action === 'open' && iconData.action) {
                    iconData.action();
                } else if (action === 'empty' && iconData.name === 'Recycle Bin') {
                    if (WinOS && WinOS.components.recycleBin) {
                        WinOS.components.recycleBin.emptyRecycleBin();
                    }
                } else if (action === 'delete') {
                    // Send the file to the recycle bin.
                    if (WinOS && WinOS.components.recycleBin) {
                        WinOS.components.recycleBin.addToRecycleBin({
                            name: iconData.name,
                            icon: iconData.icon
                        });
                    }
                    // Remove non-standard icons from the desktop.
                    const standardIcons = ['My Computer', 'Recycle Bin', 'My Documents', 'Internet Explorer', 'Network Neighborhood', 'Control Panel'];
                    if (!standardIcons.includes(iconData.name) && State.selectedIcon) {
                        State.selectedIcon.parentElement.removeChild(State.selectedIcon);
                        State.selectedIcon = null;
                    }
                }
                // Hide the menu after an action.
                menu.style.display = 'none';
                State.contextMenuOpen = false;
            });
        });

        // Close the menu if clicking outside.
        setTimeout(() => {
            const closeMenu = (e) => {
                if (!menu.contains(e.target)) {
                    menu.style.display = 'none';
                    State.contextMenuOpen = false;
                    document.removeEventListener('click', closeMenu);
                }
            };
            document.addEventListener('click', closeMenu);
        }, 0);
    }
};

// Attach the Menus module to the global WinOS components.
if (!window.WinOS) window.WinOS = {};
if (!window.WinOS.components) window.WinOS.components = {};
window.WinOS.components.menus = Menus;
