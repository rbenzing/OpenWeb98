// js/components/menus.js

/**
 * Menus Module
 * Handles the display and positioning of context menus (desktop and icon-specific) and manages Start menu interactions.
 */
const Menus = {
    // Initialize the menus module
    init: function() {
        this.setupDesktopContextMenu();
    },

    // Setup event listeners for desktop context menu
    setupDesktopContextMenu: function() {
        const desktopContextMenu = document.getElementById('desktop-context-menu');
        if (!desktopContextMenu) return;

        // Add event listeners to desktop context menu items
        desktopContextMenu.querySelectorAll('.context-menu-item').forEach(item => {
            item.addEventListener('click', () => {
                const action = item.getAttribute('data-action');
                this.handleDesktopContextAction(action);
                this.hideContextMenus();
            });
        });
    },

    // Handle desktop context menu actions
    handleDesktopContextAction: function(action) {
        switch(action) {
            case 'view':
                console.log('View options clicked');
                // Could open a view options dialog
                break;
            case 'arrange':
                console.log('Arrange icons clicked');
                // Could implement icon arrangement
                break;
            case 'lineUp':
                console.log('Line up icons clicked');
                // Could implement icon alignment
                break;
            case 'paste':
                console.log('Paste clicked');
                // Could implement paste functionality
                break;
            case 'pasteShortcut':
                console.log('Paste shortcut clicked');
                // Could implement paste shortcut functionality
                break;
            case 'newFolder':
                console.log('New folder clicked');
                // Could create a new folder on desktop
                break;
            case 'properties':
                console.log('Properties clicked');
                // Could open desktop properties dialog
                break;
        }
    },

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
    },

    // Show file context menu for Explorer windows
    showFileContextMenu: function(x, y, fileName, fileType, windowType) {
        // Remove existing file context menu if present
        const existingMenu = document.getElementById('file-context-menu');
        if (existingMenu) {
            existingMenu.parentElement.removeChild(existingMenu);
        }

        // Create new context menu element
        const menu = document.createElement('div');
        menu.id = 'file-context-menu';
        menu.className = 'context-menu';

        // Build menu items based on file type and context
        if (fileType === 'drive') {
            // Context menu for drives (C:, A:, D:)
            menu.innerHTML = `
                <div class="context-menu-item" data-action="open">
                    <img src="icons/directory_open-0.png" alt="Open">
                    <span>Open</span>
                </div>
                <div class="context-menu-item" data-action="explore">
                    <img src="icons/directory_open-0.png" alt="Explore">
                    <span>Explore</span>
                </div>
                <div class="context-menu-separator"></div>
                <div class="context-menu-item" data-action="find">
                    <img src="icons/search_file-0.png" alt="Find">
                    <span>Find...</span>
                </div>
                <div class="context-menu-separator"></div>
                <div class="context-menu-item" data-action="sharing">
                    <img src="icons/network-0.png" alt="Sharing">
                    <span>Sharing...</span>
                </div>
                <div class="context-menu-separator"></div>
                <div class="context-menu-item" data-action="properties">
                    <img src="icons/properties-0.png" alt="Properties">
                    <span>Properties</span>
                </div>
            `;
        } else if (fileType === 'folder') {
            // Context menu for folders
            menu.innerHTML = `
                <div class="context-menu-item" data-action="open">
                    <img src="icons/directory_open-0.png" alt="Open">
                    <span>Open</span>
                </div>
                <div class="context-menu-item" data-action="explore">
                    <img src="icons/directory_open-0.png" alt="Explore">
                    <span>Explore</span>
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
        } else if (windowType === 'recycle-bin') {
            // Context menu for files in Recycle Bin
            menu.innerHTML = `
                <div class="context-menu-item" data-action="restore">
                    <img src="icons/undo-0.png" alt="Restore">
                    <span>Restore</span>
                </div>
                <div class="context-menu-separator"></div>
                <div class="context-menu-item" data-action="delete">
                    <img src="icons/delete_file-0.png" alt="Delete">
                    <span>Delete</span>
                </div>
                <div class="context-menu-separator"></div>
                <div class="context-menu-item" data-action="properties">
                    <img src="icons/properties-0.png" alt="Properties">
                    <span>Properties</span>
                </div>
            `;
        } else {
            // Context menu for regular files
            menu.innerHTML = `
                <div class="context-menu-item" data-action="open">
                    <img src="icons/notepad_file-0.png" alt="Open">
                    <span>Open</span>
                </div>
                <div class="context-menu-item" data-action="openWith">
                    <img src="icons/application_hourglass-0.png" alt="Open With">
                    <span>Open With...</span>
                </div>
                <div class="context-menu-separator"></div>
                <div class="context-menu-item" data-action="sendTo">
                    <img src="icons/mail_send-0.png" alt="Send To">
                    <span>Send To ▶</span>
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
        }

        // Append and position the context menu
        document.body.appendChild(menu);
        menu.style.display = 'block';
        menu.style.left = `${x}px`;
        menu.style.top = `${y}px`;

        // Adjust position if menu goes offscreen
        const menuRect = menu.getBoundingClientRect();
        if (menuRect.right > window.innerWidth) {
            menu.style.left = `${window.innerWidth - menuRect.width}px`;
        }
        if (menuRect.bottom > window.innerHeight) {
            menu.style.top = `${window.innerHeight - menuRect.height}px`;
        }

        State.contextMenuOpen = true;

        // Attach event listeners to menu items
        menu.querySelectorAll('.context-menu-item').forEach(item => {
            item.addEventListener('click', () => {
                const action = item.getAttribute('data-action');
                this.handleFileContextAction(action, fileName, fileType);
                menu.style.display = 'none';
                State.contextMenuOpen = false;
            });
        });

        // Close menu if clicking outside
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
    },

    // Show Explorer window context menu (for empty space in Explorer windows)
    showExplorerContextMenu: function(x, y, windowType) {
        // Remove existing context menu if present
        const existingMenu = document.getElementById('explorer-context-menu');
        if (existingMenu) {
            existingMenu.parentElement.removeChild(existingMenu);
        }

        // Create new context menu element
        const menu = document.createElement('div');
        menu.id = 'explorer-context-menu';
        menu.className = 'context-menu';

        // Build menu items based on window type
        if (windowType === 'recycle-bin') {
            menu.innerHTML = `
                <div class="context-menu-item" data-action="selectAll">
                    <span>Select All</span>
                </div>
                <div class="context-menu-separator"></div>
                <div class="context-menu-item" data-action="paste">
                    <img src="icons/paste-0.png" alt="Paste">
                    <span>Paste</span>
                </div>
                <div class="context-menu-separator"></div>
                <div class="context-menu-item" data-action="emptyRecycleBin">
                    <img src="icons/recycle_bin_empty-0.png" alt="Empty Recycle Bin">
                    <span>Empty Recycle Bin</span>
                </div>
                <div class="context-menu-separator"></div>
                <div class="context-menu-item" data-action="properties">
                    <img src="icons/properties-0.png" alt="Properties">
                    <span>Properties</span>
                </div>
            `;
        } else {
            menu.innerHTML = `
                <div class="context-menu-item" data-action="view">
                    <span>View ▶</span>
                </div>
                <div class="context-menu-item" data-action="arrange">
                    <span>Arrange Icons ▶</span>
                </div>
                <div class="context-menu-item" data-action="lineUp">
                    <span>Line up Icons</span>
                </div>
                <div class="context-menu-separator"></div>
                <div class="context-menu-item" data-action="selectAll">
                    <span>Select All</span>
                </div>
                <div class="context-menu-separator"></div>
                <div class="context-menu-item" data-action="paste">
                    <img src="icons/paste-0.png" alt="Paste">
                    <span>Paste</span>
                </div>
                <div class="context-menu-item" data-action="pasteShortcut">
                    <img src="icons/paste_shortcut-0.png" alt="Paste Shortcut">
                    <span>Paste Shortcut</span>
                </div>
                <div class="context-menu-separator"></div>
                <div class="context-menu-item" data-action="new">
                    <img src="icons/directory_closed-0.png" alt="New">
                    <span>New ▶</span>
                </div>
                <div class="context-menu-separator"></div>
                <div class="context-menu-item" data-action="properties">
                    <img src="icons/properties-0.png" alt="Properties">
                    <span>Properties</span>
                </div>
            `;
        }

        // Append and position the context menu
        document.body.appendChild(menu);
        menu.style.display = 'block';
        menu.style.left = `${x}px`;
        menu.style.top = `${y}px`;

        // Adjust position if menu goes offscreen
        const menuRect = menu.getBoundingClientRect();
        if (menuRect.right > window.innerWidth) {
            menu.style.left = `${window.innerWidth - menuRect.width}px`;
        }
        if (menuRect.bottom > window.innerHeight) {
            menu.style.top = `${window.innerHeight - menuRect.height}px`;
        }

        State.contextMenuOpen = true;

        // Attach event listeners to menu items
        menu.querySelectorAll('.context-menu-item').forEach(item => {
            item.addEventListener('click', () => {
                const action = item.getAttribute('data-action');
                this.handleExplorerContextAction(action, windowType);
                menu.style.display = 'none';
                State.contextMenuOpen = false;
            });
        });

        // Close menu if clicking outside
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
    },

    // Handle Explorer context menu actions
    handleExplorerContextAction: function(action, windowType) {
        switch(action) {
            case 'view':
                console.log('View options clicked');
                break;
            case 'arrange':
                console.log('Arrange icons clicked');
                break;
            case 'lineUp':
                console.log('Line up icons clicked');
                break;
            case 'selectAll':
                console.log('Select all clicked');
                break;
            case 'paste':
                console.log('Paste clicked');
                break;
            case 'pasteShortcut':
                console.log('Paste shortcut clicked');
                break;
            case 'new':
                console.log('New clicked');
                break;
            case 'emptyRecycleBin':
                console.log('Empty Recycle Bin clicked');
                if (WinOS && WinOS.components.recycleBin) {
                    WinOS.components.recycleBin.emptyRecycleBin();
                }
                break;
            case 'properties':
                console.log(`Properties clicked for ${windowType}`);
                break;
        }
    },

    // Handle file context menu actions
    handleFileContextAction: function(action, fileName, fileType) {
        switch(action) {
            case 'open':
                console.log(`Opening ${fileType}: ${fileName}`);
                // Could trigger file opening logic
                break;
            case 'explore':
                console.log(`Exploring ${fileType}: ${fileName}`);
                // Could open in new Explorer window
                break;
            case 'openWith':
                console.log(`Open ${fileType} ${fileName} with...`);
                // Could show "Open With" dialog
                break;
            case 'sendTo':
                console.log(`Send ${fileName} to...`);
                // Could show "Send To" submenu
                break;
            case 'find':
                console.log(`Find in ${fileName}`);
                // Could open Find dialog
                break;
            case 'sharing':
                console.log(`Sharing options for ${fileName}`);
                // Could open sharing dialog
                break;
            case 'cut':
                console.log(`Cut ${fileType}: ${fileName}`);
                // Could implement cut functionality
                break;
            case 'copy':
                console.log(`Copy ${fileType}: ${fileName}`);
                // Could implement copy functionality
                break;
            case 'delete':
                console.log(`Delete ${fileType}: ${fileName}`);
                // Could move file to recycle bin
                break;
            case 'restore':
                console.log(`Restore ${fileName} from Recycle Bin`);
                // Could restore file from recycle bin
                break;
            case 'rename':
                console.log(`Rename ${fileType}: ${fileName}`);
                // Could enable inline renaming
                break;
            case 'properties':
                console.log(`Properties of ${fileType}: ${fileName}`);
                // Could show file properties dialog
                break;
        }
    }
};

// Attach the Menus module to the global WinOS components.
if (!window.WinOS) window.WinOS = {};
if (!window.WinOS.components) window.WinOS.components = {};
window.WinOS.components.menus = Menus;
