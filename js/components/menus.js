// js/components/menus.js

/**
 * Menus Module
 * Handles the display and positioning of context menus (desktop and icon-specific) and manages Start menu interactions.
 */
const Menus = {
    submenuTimer: null,
    currentSubmenu: null,
    clickOutsideHandler: null,

    // Initialize the menus module
    init: function() {
        this.setupDesktopContextMenu();
        this.setupStartMenu();
    },

    // Setup Start Menu event handlers
    setupStartMenu: function() {
        const startMenuItems = document.querySelectorAll('.start-menu-item');

        startMenuItems.forEach(item => {
            const action = item.getAttribute('data-action');

            // Click handler
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleStartMenuAction(action);
            });

            // Hover handler for items with submenus
            if (['programs', 'documents', 'settings', 'find'].includes(action)) {
                item.addEventListener('mouseenter', () => {
                    this.hideCurrentSubmenu();
                    this.submenuTimer = setTimeout(() => {
                        this.showStartSubmenu(action, item);
                    }, Config.SUBMENU_HOVER_DELAY);
                });

                item.addEventListener('mouseleave', () => {
                    if (this.submenuTimer) {
                        clearTimeout(this.submenuTimer);
                        this.submenuTimer = null;
                    }
                });
            }
        });
    },

    // Handle Start Menu item actions
    handleStartMenuAction: function(action) {
        switch(action) {
            case 'windows-update':
                this.openWindowsUpdate();
                this.hideStartMenu();
                break;
            case 'programs':
                // Submenu handled by hover
                break;
            case 'documents':
                // Submenu handled by hover
                break;
            case 'settings':
                // Submenu handled by hover
                break;
            case 'find':
                // Submenu handled by hover
                break;
            case 'help':
                this.openHelp();
                this.hideStartMenu();
                break;
            case 'run':
                if (WinOS && WinOS.components.windows) {
                    WinOS.components.windows.createRunDialog();
                }
                this.hideStartMenu();
                break;
            case 'shutdown':
                if (WinOS && WinOS.components.windows) {
                    WinOS.components.windows.createShutdownDialog();
                }
                this.hideStartMenu();
                break;
        }
    },

    // Show submenu for Start Menu items
    showStartSubmenu: function(menuType, parentItem) {
        // Remove existing submenu if any
        this.hideCurrentSubmenu();

        const submenu = document.createElement('div');
        submenu.className = 'start-menu context-menu';
        submenu.id = 'start-submenu';

        let menuData = [];

        switch(menuType) {
            case 'programs':
                menuData = window.ProgramsData ? window.ProgramsData.items : [];
                break;
            case 'settings':
                menuData = window.SettingsData ? window.SettingsData.items : [];
                break;
            case 'find':
                menuData = window.FindData ? window.FindData.items : [];
                break;
            case 'documents':
                menuData = window.DocumentsData ? window.DocumentsData.items : [];
                break;
        }

        submenu.innerHTML = this.buildSubmenuHTML(menuData);
        document.body.appendChild(submenu);

        // Position submenu to the right of Start Menu
        const startMenu = document.getElementById('start-menu');
        const rect = parentItem.getBoundingClientRect();
        const startMenuRect = startMenu.getBoundingClientRect();

        submenu.style.display = 'block';
        submenu.style.left = `${startMenuRect.right + Config.SUBMENU_OFFSET_X}px`;
        submenu.style.top = `${rect.top + Config.SUBMENU_OFFSET_Y}px`;

        // Adjust if offscreen
        const submenuRect = submenu.getBoundingClientRect();
        if (submenuRect.bottom > window.innerHeight) {
            submenu.style.top = `${window.innerHeight - submenuRect.height - 5}px`;
        }

        this.currentSubmenu = submenu;
        this.attachSubmenuListeners(submenu, menuType);
        this.setupClickOutsideHandler();
    },

    // Build HTML for submenu items
    buildSubmenuHTML: function(items) {
        let html = '<div class="start-menu-items">';

        items.forEach(item => {
            if (item.type === 'separator') {
                html += '<div class="start-menu-separator"></div>';
            } else if (item.type === 'folder') {
                html += `
                    <div class="start-menu-item submenu-item" data-action="${item.action || ''}" data-has-submenu="true">
                        <img src="${item.icon}" alt="${item.name}">
                        <span>${item.name}</span>
                        <span class="submenu-arrow">▶</span>
                    </div>
                `;
            } else {
                html += `
                    <div class="start-menu-item submenu-item" data-action="${item.action || ''}" data-path="${item.path || ''}">
                        <img src="${item.icon}" alt="${item.name}">
                        <span>${item.name}</span>
                    </div>
                `;
            }
        });

        html += '</div>';
        return html;
    },

    // Attach event listeners to submenu items
    attachSubmenuListeners: function(submenu, parentMenuType) {
        const items = submenu.querySelectorAll('.submenu-item');

        items.forEach(item => {
            const action = item.getAttribute('data-action');
            const hasSubmenu = item.getAttribute('data-has-submenu') === 'true';
            const path = item.getAttribute('data-path');

            // Click handler
            item.addEventListener('click', (e) => {
                e.stopPropagation();

                if (!hasSubmenu) {
                    this.handleSubmenuAction(action, path);
                    this.hideStartMenu();
                    this.hideCurrentSubmenu();
                }
            });

            // Hover for nested submenus
            if (hasSubmenu) {
                item.addEventListener('mouseenter', () => {
                    const folderData = this.findFolderData(parentMenuType, item.textContent.trim().replace('▶', '').trim());
                    if (folderData && folderData.items) {
                        this.showNestedSubmenu(folderData.items, item);
                    }
                });
            }
        });

        // Keep submenu open when hovering over it
        submenu.addEventListener('mouseenter', () => {
            if (this.submenuTimer) {
                clearTimeout(this.submenuTimer);
                this.submenuTimer = null;
            }
        });
    },

    // Find folder data by name
    findFolderData: function(parentMenuType, folderName) {
        let items = [];

        switch(parentMenuType) {
            case 'programs':
                items = window.ProgramsData ? window.ProgramsData.items : [];
                break;
            case 'settings':
                items = window.SettingsData ? window.SettingsData.items : [];
                break;
        }

        for (let item of items) {
            if (item.name === folderName && item.type === 'folder') {
                return item;
            }
            // Recursively search in nested items
            if (item.items) {
                const found = this.searchInItems(item.items, folderName);
                if (found) return found;
            }
        }

        return null;
    },

    // Recursively search for folder in items
    searchInItems: function(items, folderName) {
        for (let item of items) {
            if (item.name === folderName && item.type === 'folder') {
                return item;
            }
            if (item.items) {
                const found = this.searchInItems(item.items, folderName);
                if (found) return found;
            }
        }
        return null;
    },

    // Show nested submenu
    showNestedSubmenu: function(items, parentItem) {
        // Remove any existing nested submenu
        const existingNested = document.getElementById('nested-submenu');
        if (existingNested) {
            existingNested.remove();
        }

        const submenu = document.createElement('div');
        submenu.className = 'start-menu context-menu';
        submenu.id = 'nested-submenu';
        submenu.innerHTML = this.buildSubmenuHTML(items);
        document.body.appendChild(submenu);

        // Position to the right of parent item
        const rect = parentItem.getBoundingClientRect();
        submenu.style.display = 'block';
        submenu.style.left = `${rect.right + Config.SUBMENU_OFFSET_X}px`;
        submenu.style.top = `${rect.top + Config.SUBMENU_OFFSET_Y}px`;

        // Adjust if offscreen
        const submenuRect = submenu.getBoundingClientRect();
        if (submenuRect.right > window.innerWidth) {
            submenu.style.left = `${rect.left - submenuRect.width - Config.SUBMENU_OFFSET_X}px`;
        }
        if (submenuRect.bottom > window.innerHeight) {
            submenu.style.top = `${window.innerHeight - submenuRect.height - 5}px`;
        }

        this.attachNestedSubmenuListeners(submenu);
        this.setupClickOutsideHandler();
    },

    // Attach listeners to nested submenu
    attachNestedSubmenuListeners: function(submenu) {
        const items = submenu.querySelectorAll('.submenu-item');

        items.forEach(item => {
            const action = item.getAttribute('data-action');

            item.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleSubmenuAction(action);
                this.hideStartMenu();
                this.hideCurrentSubmenu();
            });
        });
    },

    // Handle submenu item actions
    handleSubmenuAction: function(action, path) {
        if (!action) return;

        // Application launchers
        const appLaunchers = {
            openCalculator: () => this.launchApp('Calculator'),
            openNotepad: () => this.launchApp('Notepad'),
            openPaint: () => this.launchApp('Paint'),
            openWordPad: () => this.launchApp('WordPad'),
            openMinesweeper: () => this.launchApp('Minesweeper'),
            openSolitaire: () => this.launchApp('Solitaire'),
            openFreeCell: () => this.launchApp('FreeCell'),
            openHearts: () => this.launchApp('Hearts'),
            openInternetExplorer: () => {
                if (WinOS && WinOS.components.windows) {
                    WinOS.components.windows.openInternetExplorer();
                }
            },
            openControlPanel: () => {
                if (WinOS && WinOS.components.windows) {
                    WinOS.components.windows.openControlPanel();
                }
            },
            openMyComputer: () => {
                if (WinOS && WinOS.components.windows) {
                    WinOS.components.windows.openMyComputer();
                }
            },
            openWindowsExplorer: () => {
                if (WinOS && WinOS.components.windows) {
                    WinOS.components.windows.openDriveC();
                }
            },
            openRecentDocument: () => {
                if (path && WinOS && WinOS.components.windows) {
                    const fileName = path.split('\\').pop();
                    WinOS.components.windows.openDocument(fileName);
                }
            },
            openFindFiles: () => this.openFindFiles(),
            openWindowsUpdate: () => this.openWindowsUpdate()
        };

        if (appLaunchers[action]) {
            appLaunchers[action]();
        } else {
            console.log(`Action not implemented: ${action}`);
        }
    },

    // Launch application
    launchApp: function(appName) {
        console.log(`Launching ${appName}...`);
        // Implementation handled by integration.js
    },

    // Open Windows Update
    openWindowsUpdate: function() {
        console.log('Opening Windows Update...');
        // Placeholder for future implementation
    },

    // Open Help
    openHelp: function() {
        console.log('Opening Help...');
        // Placeholder for future implementation
    },

    // Open Find Files dialog
    openFindFiles: function() {
        console.log('Opening Find Files...');
        // Placeholder for future implementation
    },

    // Hide current submenu
    hideCurrentSubmenu: function() {
        if (this.currentSubmenu) {
            this.currentSubmenu.remove();
            this.currentSubmenu = null;
        }
        const nested = document.getElementById('nested-submenu');
        if (nested) {
            nested.remove();
        }
    },

    // Hide Start Menu and all submenus
    hideStartMenu: function() {
        const startMenu = document.getElementById('start-menu');
        if (startMenu) {
            startMenu.style.display = 'none';
        }
        this.hideCurrentSubmenu();
        this.removeClickOutsideHandler();
    },

    // Setup click outside handler for Start Menu and submenus
    setupClickOutsideHandler: function() {
        // Remove old handler if exists
        this.removeClickOutsideHandler();

        // Create new handler with slight delay to avoid immediate closure
        setTimeout(() => {
            this.clickOutsideHandler = (e) => {
                const startMenu = document.getElementById('start-menu');
                const startButton = document.getElementById('start-button');
                const submenu = document.getElementById('start-submenu');
                const nestedSubmenu = document.getElementById('nested-submenu');

                // Check if click is outside all menus
                const clickedOutside =
                    !startMenu?.contains(e.target) &&
                    !startButton?.contains(e.target) &&
                    !submenu?.contains(e.target) &&
                    !nestedSubmenu?.contains(e.target);

                if (clickedOutside) {
                    this.hideStartMenu();
                }
            };

            document.addEventListener('click', this.clickOutsideHandler);
        }, 0);
    },

    // Remove click outside handler
    removeClickOutsideHandler: function() {
        if (this.clickOutsideHandler) {
            document.removeEventListener('click', this.clickOutsideHandler);
            this.clickOutsideHandler = null;
        }
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
                // Open Display Properties dialog
                if (window.DisplayProperties) {
                    DisplayProperties.open();
                }
                this.hideContextMenus();
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
                    <img src="icons/directory_open_cool-0.png" alt="Open">
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
                    <img src="icons/display_properties-0.png" alt="Properties">
                    <span>Properties</span>
                </div>
            `;
        } else {
            menu.innerHTML = `
                <div class="context-menu-item" data-action="open">
                    <img src="icons/directory_open_cool-0.png" alt="Open">
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
                    <img src="icons/display_properties-0.png" alt="Properties">
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
                    <img src="icons/directory_open_cool-0.png" alt="Open">
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
                    <img src="icons/display_properties-0.png" alt="Properties">
                    <span>Properties</span>
                </div>
            `;
        } else if (fileType === 'folder') {
            // Context menu for folders
            menu.innerHTML = `
                <div class="context-menu-item" data-action="open">
                    <img src="icons/directory_open_cool-0.png" alt="Open">
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
                    <img src="icons/display_properties-0.png" alt="Properties">
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
                    <img src="icons/display_properties-0.png" alt="Properties">
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
                    <img src="icons/display_properties-0.png" alt="Properties">
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
                    <img src="icons/document-0.png" alt="Paste">
                    <span>Paste</span>
                </div>
                <div class="context-menu-separator"></div>
                <div class="context-menu-item" data-action="emptyRecycleBin">
                    <img src="icons/recycle_bin_empty-0.png" alt="Empty Recycle Bin">
                    <span>Empty Recycle Bin</span>
                </div>
                <div class="context-menu-separator"></div>
                <div class="context-menu-item" data-action="properties">
                    <img src="icons/display_properties-0.png" alt="Properties">
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
                    <img src="icons/document-0.png" alt="Paste">
                    <span>Paste</span>
                </div>
                <div class="context-menu-item" data-action="pasteShortcut">
                    <img src="icons/document-0.png" alt="Paste Shortcut">
                    <span>Paste Shortcut</span>
                </div>
                <div class="context-menu-separator"></div>
                <div class="context-menu-item" data-action="new">
                    <img src="icons/directory_closed-0.png" alt="New">
                    <span>New ▶</span>
                </div>
                <div class="context-menu-separator"></div>
                <div class="context-menu-item" data-action="properties">
                    <img src="icons/display_properties-0.png" alt="Properties">
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
