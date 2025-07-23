// js/components/windows.js

/**
 * Windows Module
 * Manages creation, activation, minimization, maximization, restoration, and closing of windows.
 */
const Windows = {
    // Create a new window with given parameters.
    createWindow: function(title, content, width, height, x, y, showMenuBar = true) {
        const windowEl = document.createElement('div');
        windowEl.className = 'window';
        windowEl.style.width = `${width}px`;
        windowEl.style.height = `${height}px`;
        windowEl.style.left = x !== undefined ? `${x}px` : `${Math.max(0, Math.random() * (window.innerWidth - width))}px`;
        windowEl.style.top = y !== undefined ? `${y}px` : `${Math.max(0, Math.random() * (window.innerHeight - height - 40))}px`;
        windowEl.style.zIndex = State.zIndexCounter++;

        // Create the window header (titlebar) and controls.
        let windowHTML = `
            <div class="window-titlebar active">
                <img src="icons/windows-0.png" alt="Icon" style="width: 16px; height: 16px;">
                <div class="window-title">${title}</div>
                <div class="window-controls">
                    <div class="window-control window-minimize">
                        <img src="icons/minimize.svg" alt="Minimize">
                    </div>
                    <div class="window-control window-maximize">
                        <img src="icons/maximize.svg" alt="Maximize">
                    </div>
                    <div class="window-control window-close">
                        <img src="icons/close-icon.png" alt="Close">
                    </div>
                </div>
            </div>
        `;

        // Optionally add a menu bar.
        if (showMenuBar) {
            windowHTML += `
                <div class="window-menubar">
                    <div class="window-menu-item">File</div>
                    <div class="window-menu-item">Edit</div>
                    <div class="window-menu-item">View</div>
                    <div class="window-menu-item">Help</div>
                </div>
            `;
        }
        windowHTML += `<div class="window-content">${content}</div>`;

        // Add resize handles.
        windowHTML += `
            <div class="resize-handle resize-handle-n"></div>
            <div class="resize-handle resize-handle-e"></div>
            <div class="resize-handle resize-handle-s"></div>
            <div class="resize-handle resize-handle-w"></div>
            <div class="resize-handle resize-handle-ne"></div>
            <div class="resize-handle resize-handle-se"></div>
            <div class="resize-handle resize-handle-sw"></div>
            <div class="resize-handle resize-handle-nw"></div>
        `;

        windowEl.innerHTML = windowHTML;
        document.body.appendChild(windowEl);

        // Create window data for state management.
        const windowData = {
            element: windowEl,
            title: title,
            taskButton: null,
            minimized: false,
            maximized: false,
            prevDimensions: {
                width: width,
                height: height,
                x: windowEl.offsetLeft,
                y: windowEl.offsetTop
            }
        };

        // Save the window in our global state.
        State.openWindows.push(windowData);

        // Add a taskbar button for the window.
        if (WinOS && WinOS.components.taskbar) {
            WinOS.components.taskbar.addTaskButton(windowData);
        }

        // Activate window on mouse down.
        windowEl.addEventListener('mousedown', () => {
            Windows.activateWindow(windowData);
        });

        // Attach control button event handlers.
        windowEl.querySelector('.window-close').addEventListener('click', () => {
            Windows.closeWindow(windowData);
        });
        windowEl.querySelector('.window-minimize').addEventListener('click', () => {
            Windows.minimizeWindow(windowData);
        });
        windowEl.querySelector('.window-maximize').addEventListener('click', () => {
            if (windowData.maximized) {
                Windows.restoreWindowSize(windowData);
            } else {
                Windows.maximizeWindow(windowData);
            }
        });

        // Enable dragging and resizing via utility functions.
        const titlebar = windowEl.querySelector('.window-titlebar');
        if (typeof makeDraggable === 'function' && titlebar) {
            makeDraggable(windowEl, titlebar);
        }
        if (typeof makeResizable === 'function') {
            makeResizable(windowEl);
        }

        // Make this newly created window active.
        Windows.activateWindow(windowData);
        return windowData;
    },

    // Activate a window: bring it to the front and set it as active.
    activateWindow: function(windowData) {
        if (State.activeWindow && State.activeWindow.element) {
            State.activeWindow.element.querySelector('.window-titlebar').classList.remove('active');
            if (State.activeWindow.taskButton) {
                State.activeWindow.taskButton.classList.remove('active');
            }
        }
        State.activeWindow = windowData;
        windowData.element.style.zIndex = State.zIndexCounter++;
        windowData.element.querySelector('.window-titlebar').classList.add('active');
        if (windowData.taskButton) {
            windowData.taskButton.classList.add('active');
        }
        if (windowData.minimized) {
            Windows.restoreWindow(windowData);
        }
    },

    // Minimize a window.
    minimizeWindow: function(windowData) {
        windowData.element.style.display = 'none';
        windowData.minimized = true;
        if (windowData.taskButton) {
            windowData.taskButton.classList.remove('active');
        }
        if (State.activeWindow === windowData) {
            State.activeWindow = null;
        }
    },

    // Restore a minimized window.
    restoreWindow: function(windowData) {
        windowData.element.style.display = 'block';
        windowData.minimized = false;
        Windows.activateWindow(windowData);
    },

    // Maximize a window.
    maximizeWindow: function(windowData) {
        // Save current dimensions for later restoration.
        windowData.prevDimensions = {
            width: windowData.element.offsetWidth,
            height: windowData.element.offsetHeight,
            x: windowData.element.offsetLeft,
            y: windowData.element.offsetTop
        };
        windowData.element.style.width = '100%';
        windowData.element.style.height = `${window.innerHeight - 28}px`;
        windowData.element.style.left = '0';
        windowData.element.style.top = '0';
        windowData.maximized = true;
        const maximizeButton = windowData.element.querySelector('.window-maximize img');
        maximizeButton.src = 'icons/restore-0.png';
    },

    // Restore a maximized window to its previous dimensions.
    restoreWindowSize: function(windowData) {
        windowData.element.style.width = `${windowData.prevDimensions.width}px`;
        windowData.element.style.height = `${windowData.prevDimensions.height}px`;
        windowData.element.style.left = `${windowData.prevDimensions.x}px`;
        windowData.element.style.top = `${windowData.prevDimensions.y}px`;
        windowData.maximized = false;
        const maximizeButton = windowData.element.querySelector('.window-maximize img');
        maximizeButton.src = 'icons/maximize-0.png';
    },

    // Close a window and remove its related elements.
    closeWindow: function(windowData) {
        document.body.removeChild(windowData.element);
        if (windowData.taskButton) {
            WinOS.components.taskbar.taskButtonsContainer.removeChild(windowData.taskButton);
        }
        const index = State.openWindows.indexOf(windowData);
        if (index > -1) {
            State.openWindows.splice(index, 1);
        }
        if (State.activeWindow === windowData) {
            State.activeWindow = null;
        }
    },

    // Open the "My Computer" window with file explorer content.
    openMyComputer: function() {
        const content = `
            <div class="explorer-toolbar">
                <div class="explorer-toolbar-section">
                    <button class="explorer-toolbar-button" disabled title="Back">
                        <span class="sprite-icon-grey sprite-back button-icon"></span>
                        <span class="button-text">Back</span>
                    </button>
                    <button class="explorer-toolbar-button" disabled title="Forward">
                        <span class="sprite-icon-grey sprite-forward button-icon"></span>
                        <span class="button-text">Forward</span>
                    </button>
                    <button class="explorer-toolbar-button" title="Up">
                        <span class="sprite-icon-grey sprite-up button-icon"></span>
                        <span class="button-text">Up</span>
                    </button>
                </div>
                <div class="explorer-toolbar-separator"></div>
                <div class="explorer-toolbar-section">
                    <button class="explorer-toolbar-button" title="Cut">
                        <span class="sprite-icon-grey sprite-cut button-icon"></span>
                        <span class="button-text">Cut</span>
                    </button>
                    <button class="explorer-toolbar-button" title="Copy">
                        <span class="sprite-icon-grey sprite-copy button-icon"></span>
                        <span class="button-text">Copy</span>
                    </button>
                    <button class="explorer-toolbar-button" title="Paste">
                        <span class="sprite-icon-grey sprite-paste button-icon"></span>
                        <span class="button-text">Paste</span>
                    </button>
                </div>
                <div class="explorer-toolbar-separator"></div>
                <div class="explorer-toolbar-section">
                    <button class="explorer-toolbar-button" title="Undo">
                        <span class="sprite-icon-grey sprite-undo button-icon"></span>
                        <span class="button-text">Undo</span>
                    </button>
                </div>
                <div class="explorer-toolbar-separator"></div>
                <div class="explorer-toolbar-section">
                    <button class="explorer-toolbar-button" title="Delete">
                        <span class="sprite-icon-grey sprite-delete button-icon"></span>
                        <span class="button-text">Delete</span>
                    </button>
                    <button class="explorer-toolbar-button" title="Properties">
                        <span class="sprite-icon-grey sprite-properties button-icon"></span>
                        <span class="button-text">Properties</span>
                    </button>
                </div>
                <div class="explorer-toolbar-separator"></div>
                <div class="explorer-toolbar-section">
                    <button class="explorer-toolbar-button" title="Views">
                        <span class="sprite-icon-grey sprite-views button-icon"></span>
                        <span class="button-text">Views</span>
                    </button>
                </div>
            </div>
            <div class="explorer-address-bar-container">
                <label>Address</label>
                <div class="explorer-address-bar">
                    <img src="icons/computer-0.png" alt="My Computer">
                    <span>My Computer</span>
                </div>
            </div>
            <div class="explorer-content">
                <div class="file-icon" data-action="openDriveC">
                    <img src="icons/hard_disk_drive-2.png" alt="C:">
                    <span>Local Disk (C:)</span>
                </div>
                <div class="file-icon" data-action="openDriveA">
                    <img src="icons/floppy_drive_3_5-0.png" alt="A:">
                    <span>3½ Floppy (A:)</span>
                </div>
                <div class="file-icon" data-action="openDriveD">
                    <img src="icons/cd_drive-0.png" alt="D:">
                    <span>CD-ROM Drive (D:)</span>
                </div>
                <div class="file-icon" data-action="openControlPanel">
                    <img src="icons/directory_control_panel-3.png" alt="Control Panel">
                    <span>Control Panel</span>
                </div>
                <div class="file-icon" data-action="openPrinters">
                    <img src="icons/printer-0.png" alt="Printers">
                    <span>Printers</span>
                </div>
                <div class="file-icon" data-action="openDialUp">
                    <img src="icons/directory_dial_up_networking-3.png" alt="Dial-Up">
                    <span>Dial-Up Networking</span>
                </div>
            </div>
            <div class="explorer-status-bar">
                <span>6 object(s)</span>
            </div>
        `;

        // Create window with proper menu bar
        const windowEl = Windows.createWindow('My Computer', content, 600, 450, undefined, undefined, true);

        // Update menu bar to match Explorer
        const menuBar = windowEl.querySelector('.window-menubar');
        if (menuBar) {
            menuBar.innerHTML = `
                <div class="window-menu-item" data-menu="file">File</div>
                <div class="window-menu-item" data-menu="edit">Edit</div>
                <div class="window-menu-item" data-menu="view">View</div>
                <div class="window-menu-item" data-menu="tools">Tools</div>
                <div class="window-menu-item" data-menu="help">Help</div>
            `;

            // Add menu functionality
            Windows.setupMenuBar(menuBar);
        }

        // Setup event listeners for the icons within the "My Computer" window.
        setTimeout(() => {
            const explorerContent = windowEl.querySelector('.explorer-content');
            const fileIcons = windowEl.querySelectorAll('.window-content .file-icon');

            // Handle clicking on empty space to deselect all
            explorerContent.addEventListener('click', function(e) {
                if (e.target === explorerContent) {
                    fileIcons.forEach(icon => icon.classList.remove('selected'));
                }
            });

            // Handle right-click on empty space
            explorerContent.addEventListener('contextmenu', function(e) {
                if (e.target === explorerContent) {
                    e.preventDefault();
                    fileIcons.forEach(icon => icon.classList.remove('selected'));

                    if (WinOS && WinOS.components.menus) {
                        WinOS.components.menus.showExplorerContextMenu(e.clientX, e.clientY, 'my-computer');
                    }
                }
            });

            fileIcons.forEach(icon => {
                icon.addEventListener('click', function(e) {
                    e.stopPropagation();

                    // Handle Ctrl+click for multiple selection
                    if (!e.ctrlKey) {
                        // Deselect all file icons if not holding Ctrl
                        fileIcons.forEach(i => i.classList.remove('selected'));
                    }

                    // Toggle selection of clicked icon
                    this.classList.toggle('selected');
                });

                icon.addEventListener('dblclick', function(e) {
                    e.stopPropagation();
                    const action = this.getAttribute('data-action');
                    if (action === 'openDriveC') {
                        Windows.openDriveC();
                    } else if (action === 'openDriveA') {
                        Windows.openDriveA();
                    } else if (action === 'openDriveD') {
                        Windows.openDriveD();
                    } else if (action === 'openControlPanel') {
                        Windows.openControlPanel();
                    }
                });

                // Add right-click context menu
                icon.addEventListener('contextmenu', function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    // Select the icon if not already selected
                    if (!this.classList.contains('selected')) {
                        fileIcons.forEach(i => i.classList.remove('selected'));
                        this.classList.add('selected');
                    }

                    const fileName = this.querySelector('span').textContent;
                    const action = this.getAttribute('data-action');

                    // Determine file type based on action
                    let fileType = 'folder';
                    if (action && (action.includes('Drive') || fileName.includes(':'))) {
                        fileType = 'drive';
                    }

                    if (WinOS && WinOS.components.menus) {
                        WinOS.components.menus.showFileContextMenu(e.clientX, e.clientY, fileName, fileType, 'my-computer');
                    }
                });
            });
        }, 0);

        return windowEl;
    },

    // Setup menu bar functionality
    setupMenuBar: function(menuBar) {
        const menuItems = menuBar.querySelectorAll('.window-menu-item');

        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();

                // Close any existing dropdown
                const existingDropdown = menuBar.querySelector('.window-dropdown-menu');
                if (existingDropdown) {
                    existingDropdown.remove();
                }

                // Remove active state from all items
                menuItems.forEach(mi => mi.classList.remove('active'));

                // Add active state to clicked item
                item.classList.add('active');

                // Create dropdown menu
                const dropdown = document.createElement('div');
                dropdown.className = 'window-dropdown-menu';
                dropdown.style.display = 'block';

                const menuType = item.getAttribute('data-menu');
                dropdown.innerHTML = Windows.getMenuContent(menuType);

                // Add click handlers for dropdown items
                dropdown.querySelectorAll('.window-dropdown-item').forEach(dropdownItem => {
                    dropdownItem.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const itemText = dropdownItem.textContent;
                        const windowEl = menuBar.closest('.window');

                        // Handle view mode changes
                        if (menuType === 'view') {
                            switch(itemText) {
                                case 'Large Icons':
                                    Windows.changeViewMode(windowEl, 'large-icons');
                                    break;
                                case 'Small Icons':
                                    Windows.changeViewMode(windowEl, 'small-icons');
                                    break;
                                case 'List':
                                    Windows.changeViewMode(windowEl, 'list');
                                    break;
                                case 'Details':
                                    Windows.changeViewMode(windowEl, 'details');
                                    break;
                            }
                        }

                        // Close dropdown
                        dropdown.remove();
                        item.classList.remove('active');
                    });
                });

                // Position dropdown
                item.style.position = 'relative';
                item.appendChild(dropdown);

                // Close dropdown when clicking outside
                setTimeout(() => {
                    const closeDropdown = (e) => {
                        if (!dropdown.contains(e.target) && !item.contains(e.target)) {
                            dropdown.remove();
                            item.classList.remove('active');
                            document.removeEventListener('click', closeDropdown);
                        }
                    };
                    document.addEventListener('click', closeDropdown);
                }, 0);
            });
        });
    },

    // Get menu content based on menu type
    getMenuContent: function(menuType) {
        const menus = {
            file: `
                <div class="window-dropdown-item">New</div>
                <div class="window-dropdown-separator"></div>
                <div class="window-dropdown-item">Create Shortcut</div>
                <div class="window-dropdown-item">Delete</div>
                <div class="window-dropdown-item">Rename</div>
                <div class="window-dropdown-item">Properties</div>
                <div class="window-dropdown-separator"></div>
                <div class="window-dropdown-item">Close</div>
            `,
            edit: `
                <div class="window-dropdown-item">Undo</div>
                <div class="window-dropdown-separator"></div>
                <div class="window-dropdown-item">Cut</div>
                <div class="window-dropdown-item">Copy</div>
                <div class="window-dropdown-item">Paste</div>
                <div class="window-dropdown-separator"></div>
                <div class="window-dropdown-item">Select All</div>
                <div class="window-dropdown-item">Invert Selection</div>
            `,
            view: `
                <div class="window-dropdown-item">Toolbar</div>
                <div class="window-dropdown-item">Status Bar</div>
                <div class="window-dropdown-separator"></div>
                <div class="window-dropdown-item">Large Icons</div>
                <div class="window-dropdown-item">Small Icons</div>
                <div class="window-dropdown-item">List</div>
                <div class="window-dropdown-item">Details</div>
                <div class="window-dropdown-separator"></div>
                <div class="window-dropdown-item">Arrange Icons</div>
                <div class="window-dropdown-item">Refresh</div>
            `,
            tools: `
                <div class="window-dropdown-item">Find</div>
                <div class="window-dropdown-item">Map Network Drive</div>
                <div class="window-dropdown-item">Disconnect Network Drive</div>
                <div class="window-dropdown-separator"></div>
                <div class="window-dropdown-item">Folder Options</div>
            `,
            help: `
                <div class="window-dropdown-item">Help Topics</div>
                <div class="window-dropdown-separator"></div>
                <div class="window-dropdown-item">About Windows</div>
            `
        };

        return menus[menuType] || '';
    },

    // Change view mode for explorer windows
    changeViewMode: function(windowEl, mode) {
        const explorerContent = windowEl.querySelector('.explorer-content');
        if (!explorerContent) return;

        // Remove existing view classes
        explorerContent.classList.remove('large-icons', 'small-icons', 'list', 'details');

        // Add new view class
        if (mode !== 'large-icons') {
            explorerContent.classList.add(mode);
        }

        // Update status bar if needed
        const statusBar = windowEl.querySelector('.explorer-status-bar');
        if (statusBar) {
            const fileCount = explorerContent.querySelectorAll('.file-icon').length;
            statusBar.innerHTML = `<span>${fileCount} object(s)</span>`;
        }
    },

    // Open the "Local Disk (C:)" window.
    openDriveC: function() {
        const content = `
            <div class="explorer-toolbar">
                <div class="explorer-toolbar-section">
                    <button class="explorer-toolbar-button">
                        ◀
                    </button>
                    <button class="explorer-toolbar-button" disabled>
                        ▶
                    </button>
                    <button class="explorer-toolbar-button">
                        ▲
                    </button>
                </div>
                <div class="explorer-toolbar-separator"></div>
                <div class="explorer-toolbar-section">
                    <button class="explorer-toolbar-button">
                        ✂
                    </button>
                    <button class="explorer-toolbar-button">
                        📋
                    </button>
                    <button class="explorer-toolbar-button">
                        📄
                    </button>
                </div>
            </div>
            <div class="explorer-address-bar-container">
                <label>Address</label>
                <div class="explorer-address-bar">
                    <img src="icons/hard_disk_drive-0.png" alt="C:">
                    <span>C:\\</span>
                </div>
            </div>
            <div class="explorer-content">
                <div class="file-icon">
                    <img src="icons/directory_closed-0.png" alt="Program Files">
                    <span>Program Files</span>
                </div>
                <div class="file-icon">
                    <img src="icons/directory_closed-0.png" alt="Windows">
                    <span>Windows</span>
                </div>
                <div class="file-icon">
                    <img src="icons/directory_open_file_mydocs-0.png" alt="My Documents">
                    <span>My Documents</span>
                </div>
                <div class="file-icon">
                    <img src="icons/notepad_file-0.png" alt="autoexec.bat">
                    <span>autoexec.bat</span>
                </div>
                <div class="file-icon">
                    <img src="icons/notepad_file-0.png" alt="config.sys">
                    <span>config.sys</span>
                </div>
                <div class="file-icon">
                    <img src="icons/notepad_file-0.png" alt="msdos.sys">
                    <span>msdos.sys</span>
                </div>
            </div>
            <div class="explorer-status-bar">
                <span>6 object(s)</span>
            </div>
        `;

        const windowEl = Windows.createWindow('Local Disk (C:)', content, 600, 450, undefined, undefined, true);

        // Update menu bar to match Explorer
        const menuBar = windowEl.querySelector('.window-menubar');
        if (menuBar) {
            menuBar.innerHTML = `
                <div class="window-menu-item" data-menu="file">File</div>
                <div class="window-menu-item" data-menu="edit">Edit</div>
                <div class="window-menu-item" data-menu="view">View</div>
                <div class="window-menu-item" data-menu="tools">Tools</div>
                <div class="window-menu-item" data-menu="help">Help</div>
            `;

            // Add menu functionality
            Windows.setupMenuBar(menuBar);
        }

        return windowEl;
    },

    // Open the "3½ Floppy (A:)" window.
    openDriveA: function() {
        const content = `
            <div class="explorer-toolbar">
                <div class="explorer-toolbar-section">
                    <button class="explorer-toolbar-button">
                        ◀
                    </button>
                    <button class="explorer-toolbar-button" disabled>
                        ▶
                    </button>
                    <button class="explorer-toolbar-button">
                        ▲
                    </button>
                </div>
            </div>
            <div class="explorer-address-bar-container">
                <label>Address</label>
                <div class="explorer-address-bar">
                    <img src="icons/floppy_drive_3_5-0.png" alt="A:">
                    <span>A:\\</span>
                </div>
            </div>
            <div class="explorer-content" style="display: flex; justify-content: center; align-items: center; height: 100%;">
                <div style="text-align: center;">
                    <img src="icons/msg_error-0.png" alt="Error" style="width: 32px; height: 32px; margin-bottom: 10px;">
                    <p>Please insert a disk in drive A:</p>
                </div>
            </div>
            <div class="explorer-status-bar">
                <span>0 object(s)</span>
            </div>
        `;
        Windows.createWindow('3½ Floppy (A:)', content, 500, 350, undefined, undefined, true);
    },

    // Open the "CD-ROM Drive (D:)" window.
    openDriveD: function() {
        const content = `
            <div class="explorer-toolbar">
                <div class="explorer-toolbar-button">Back</div>
                <div class="explorer-toolbar-button">Forward</div>
                <div class="explorer-toolbar-button">Up</div>
            </div>
            <div class="explorer-address-bar">D:\\</div>
            <div class="explorer-content">
                <div class="file-icon">
                    <img src="icons/directory_closed-0.png" alt="Install">
                    <span>Install</span>
                </div>
                <div class="file-icon">
                    <img src="icons/directory_closed-0.png" alt="Drivers">
                    <span>Drivers</span>
                </div>
                <div class="file-icon">
                    <img src="icons/application_executable-0.png" alt="Setup.exe">
                    <span>Setup.exe</span>
                </div>
                <div class="file-icon">
                    <img src="icons/file_text-0.png" alt="Readme.txt">
                    <span>Readme.txt</span>
                </div>
            </div>
        `;
        Windows.createWindow('CD-ROM Drive (D:)', content, 600, 400);
    },

    // Open the "Control Panel" window.
    openControlPanel: function() {
        const content = `
            <div class="explorer-toolbar">
                <div class="explorer-toolbar-section">
                    <button class="explorer-toolbar-button" disabled title="Back">
                        <span class="sprite-icon-grey sprite-back button-icon"></span>
                        <span class="button-text">Back</span>
                    </button>
                    <button class="explorer-toolbar-button" disabled title="Forward">
                        <span class="sprite-icon-grey sprite-forward button-icon"></span>
                        <span class="button-text">Forward</span>
                    </button>
                    <button class="explorer-toolbar-button" title="Up">
                        <span class="sprite-icon-grey sprite-up button-icon"></span>
                        <span class="button-text">Up</span>
                    </button>
                </div>
                <div class="explorer-toolbar-separator"></div>
                <div class="explorer-toolbar-section">
                    <button class="explorer-toolbar-button" title="Cut">
                        <span class="sprite-icon-grey sprite-cut button-icon"></span>
                        <span class="button-text">Cut</span>
                    </button>
                    <button class="explorer-toolbar-button" title="Copy">
                        <span class="sprite-icon-grey sprite-copy button-icon"></span>
                        <span class="button-text">Copy</span>
                    </button>
                    <button class="explorer-toolbar-button" title="Paste">
                        <span class="sprite-icon-grey sprite-paste button-icon"></span>
                        <span class="button-text">Paste</span>
                    </button>
                </div>
                <div class="explorer-toolbar-separator"></div>
                <div class="explorer-toolbar-section">
                    <button class="explorer-toolbar-button" title="Views">
                        <span class="sprite-icon-grey sprite-views button-icon"></span>
                        <span class="button-text">Views</span>
                    </button>
                </div>
            </div>
            <div class="explorer-address-bar-container">
                <label>Address</label>
                <div class="explorer-address-bar">
                    <img src="icons/directory_control_panel-0.png" alt="Control Panel">
                    <span>Control Panel</span>
                </div>
            </div>
            <div class="explorer-content">
                <div class="file-icon">
                    <img src="icons/accessibility-0.png" alt="Accessibility Options">
                    <span>Accessibility Options</span>
                </div>
                <div class="file-icon">
                    <img src="icons/display_properties-1.png" alt="Display">
                    <span>Display</span>
                </div>
                <div class="file-icon">
                    <img src="icons/keyboard-0.png" alt="Keyboard">
                    <span>Keyboard</span>
                </div>
                <div class="file-icon">
                    <img src="icons/mouse-2.png" alt="Mouse">
                    <span>Mouse</span>
                </div>
                <div class="file-icon">
                    <img src="icons/network-0.png" alt="Network">
                    <span>Network</span>
                </div>
                <div class="file-icon">
                    <img src="icons/printer-0.png" alt="Printers">
                    <span>Printers</span>
                </div>
                <div class="file-icon">
                    <img src="icons/loudspeaker_rays-0.png" alt="Sounds">
                    <span>Sounds</span>
                </div>
                <div class="file-icon">
                    <img src="icons/time_and_date-0.png" alt="Date/Time">
                    <span>Date/Time</span>
                </div>
                <div class="file-icon">
                    <img src="icons/hardware-0.png" alt="Add New Hardware">
                    <span>Add New Hardware</span>
                </div>
                <div class="file-icon">
                    <img src="icons/appwizard-0.png" alt="Add/Remove Programs">
                    <span>Add/Remove Programs</span>
                </div>
                <div class="file-icon">
                    <img src="icons/font_tt-0.png" alt="Fonts">
                    <span>Fonts</span>
                </div>
                <div class="file-icon">
                    <img src="icons/world-0.png" alt="Regional Settings">
                    <span>Regional Settings</span>
                </div>
                <div class="file-icon">
                    <img src="icons/key_win-0.png" alt="Passwords">
                    <span>Passwords</span>
                </div>
                <div class="file-icon">
                    <img src="icons/internet_options-0.png" alt="Internet Options">
                    <span>Internet Options</span>
                </div>
                <div class="file-icon">
                    <img src="icons/computer-0.png" alt="System">
                    <span>System</span>
                </div>
            </div>
            <div class="explorer-status-bar">
                <span>15 object(s)</span>
            </div>
        `;

        const windowEl = Windows.createWindow('Control Panel', content, 650, 480, undefined, undefined, true);

        // Update menu bar to match Explorer
        const menuBar = windowEl.querySelector('.window-menubar');
        if (menuBar) {
            menuBar.innerHTML = `
                <div class="window-menu-item" data-menu="file">File</div>
                <div class="window-menu-item" data-menu="edit">Edit</div>
                <div class="window-menu-item" data-menu="view">View</div>
                <div class="window-menu-item" data-menu="tools">Tools</div>
                <div class="window-menu-item" data-menu="help">Help</div>
            `;

            // Add menu functionality
            Windows.setupMenuBar(menuBar);
        }

        // Setup event listeners for the icons
        setTimeout(() => {
            const explorerContent = windowEl.querySelector('.explorer-content');
            const fileIcons = windowEl.querySelectorAll('.window-content .file-icon');

            // Handle clicking on empty space to deselect all
            explorerContent.addEventListener('click', function(e) {
                if (e.target === explorerContent) {
                    fileIcons.forEach(icon => icon.classList.remove('selected'));
                }
            });

            fileIcons.forEach(icon => {
                icon.addEventListener('click', function(e) {
                    e.stopPropagation();

                    // Handle Ctrl+click for multiple selection
                    if (!e.ctrlKey) {
                        fileIcons.forEach(i => i.classList.remove('selected'));
                    }

                    this.classList.toggle('selected');
                });

                icon.addEventListener('dblclick', function(e) {
                    e.stopPropagation();
                    const itemName = this.querySelector('span').textContent;
                    console.log('Opening Control Panel item:', itemName);
                    // Placeholder for opening specific control panel items
                });
            });
        }, 0);

        return windowEl;
    },

    // Open the "Recycle Bin" window.
    openRecycleBin: function() {
        let content = `
            <div class="explorer-toolbar">
                <div class="explorer-toolbar-section">
                    <button class="explorer-toolbar-button" disabled title="Back">
                        <span class="sprite-icon-grey sprite-back button-icon"></span>
                        <span class="button-text">Back</span>
                    </button>
                    <button class="explorer-toolbar-button" disabled title="Forward">
                        <span class="sprite-icon-grey sprite-forward button-icon"></span>
                        <span class="button-text">Forward</span>
                    </button>
                    <button class="explorer-toolbar-button" title="Up">
                        <span class="sprite-icon-grey sprite-up button-icon"></span>
                        <span class="button-text">Up</span>
                    </button>
                </div>
                <div class="explorer-toolbar-separator"></div>
                <div class="explorer-toolbar-section">
                    <button class="explorer-toolbar-button" title="Cut">
                        <span class="sprite-icon-grey sprite-cut button-icon"></span>
                        <span class="button-text">Cut</span>
                    </button>
                    <button class="explorer-toolbar-button" title="Copy">
                        <span class="sprite-icon-grey sprite-copy button-icon"></span>
                        <span class="button-text">Copy</span>
                    </button>
                    <button class="explorer-toolbar-button" title="Paste">
                        <span class="sprite-icon-grey sprite-paste button-icon"></span>
                        <span class="button-text">Paste</span>
                    </button>
                </div>
                <div class="explorer-toolbar-separator"></div>
                <div class="explorer-toolbar-section">
                    <button class="explorer-toolbar-button" title="Delete">
                        <span class="sprite-icon-grey sprite-delete button-icon"></span>
                        <span class="button-text">Delete</span>
                    </button>
                    <button class="explorer-toolbar-button" title="Restore">
                        <span class="sprite-icon-grey sprite-undo button-icon"></span>
                        <span class="button-text">Restore</span>
                    </button>
                </div>
                <div class="explorer-toolbar-separator"></div>
                <div class="explorer-toolbar-section">
                    <button class="explorer-toolbar-button" title="Views">
                        <span class="sprite-icon-grey sprite-views button-icon"></span>
                        <span class="button-text">Views</span>
                    </button>
                </div>
            </div>
            <div class="explorer-address-bar-container">
                <label>Address</label>
                <div class="explorer-address-bar">
                    <img src="icons/recycle_bin_empty-0.png" alt="Recycle Bin">
                    <span>Recycle Bin</span>
                </div>
            </div>
            <div class="explorer-content" id="recycle-bin-content">
        `;

        if (State.recycleBinFiles.length > 0) {
            State.recycleBinFiles.forEach(file => {
                content += `
                    <div class="file-icon" data-filename="${file.name}">
                        <img src="${file.icon}" alt="${file.name}">
                        <span>${file.name}</span>
                    </div>
                `;
            });
        } else {
            content += `
                <div style="display: flex; justify-content: center; align-items: center; height: 100%; width: 100%;">
                    <p>The Recycle Bin is empty</p>
                </div>
            `;
        }

        content += `
            </div>
            <div class="explorer-status-bar">
                <span>${State.recycleBinFiles.length} object(s)</span>
            </div>
        `;

        const windowEl = Windows.createWindow('Recycle Bin', content, 600, 450, undefined, undefined, true);

        // Update menu bar to match Explorer
        const menuBar = windowEl.querySelector('.window-menubar');
        if (menuBar) {
            menuBar.innerHTML = `
                <div class="window-menu-item" data-menu="file">File</div>
                <div class="window-menu-item" data-menu="edit">Edit</div>
                <div class="window-menu-item" data-menu="view">View</div>
                <div class="window-menu-item" data-menu="tools">Tools</div>
                <div class="window-menu-item" data-menu="help">Help</div>
            `;

            // Add menu functionality
            Windows.setupMenuBar(menuBar);
        }

        // Setup event listeners for the icons
        setTimeout(() => {
            const explorerContent = windowEl.querySelector('.explorer-content');
            const fileIcons = windowEl.querySelectorAll('.window-content .file-icon');

            // Handle clicking on empty space to deselect all
            explorerContent.addEventListener('click', function(e) {
                if (e.target === explorerContent) {
                    fileIcons.forEach(icon => icon.classList.remove('selected'));
                }
            });

            // Handle right-click on empty space
            explorerContent.addEventListener('contextmenu', function(e) {
                if (e.target === explorerContent) {
                    e.preventDefault();
                    fileIcons.forEach(icon => icon.classList.remove('selected'));

                    if (WinOS && WinOS.components.menus) {
                        WinOS.components.menus.showExplorerContextMenu(e.clientX, e.clientY, 'recycle-bin');
                    }
                }
            });

            fileIcons.forEach(icon => {
                icon.addEventListener('click', function(e) {
                    e.stopPropagation();

                    // Handle Ctrl+click for multiple selection
                    if (!e.ctrlKey) {
                        fileIcons.forEach(i => i.classList.remove('selected'));
                    }

                    this.classList.toggle('selected');
                });

                icon.addEventListener('dblclick', function(e) {
                    e.stopPropagation();
                    const fileName = this.getAttribute('data-filename');
                    console.log('Restoring file:', fileName);
                    // Placeholder for restoring files from recycle bin
                });

                // Add right-click context menu for restore/delete permanently
                icon.addEventListener('contextmenu', function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    if (!this.classList.contains('selected')) {
                        fileIcons.forEach(i => i.classList.remove('selected'));
                        this.classList.add('selected');
                    }

                    const fileName = this.getAttribute('data-filename');

                    if (WinOS && WinOS.components.menus) {
                        WinOS.components.menus.showFileContextMenu(e.clientX, e.clientY, fileName, 'file', 'recycle-bin');
                    }
                });
            });
        }, 0);

        return windowEl;
    },

    // Open the "My Documents" window.
    openMyDocuments: function() {
        const content = `
            <div class="explorer-toolbar">
                <div class="explorer-toolbar-section">
                    <button class="explorer-toolbar-button" disabled title="Back">
                        <span class="sprite-icon-grey sprite-back button-icon"></span>
                        <span class="button-text">Back</span>
                    </button>
                    <button class="explorer-toolbar-button" disabled title="Forward">
                        <span class="sprite-icon-grey sprite-forward button-icon"></span>
                        <span class="button-text">Forward</span>
                    </button>
                    <button class="explorer-toolbar-button" title="Up">
                        <span class="sprite-icon-grey sprite-up button-icon"></span>
                        <span class="button-text">Up</span>
                    </button>
                </div>
                <div class="explorer-toolbar-separator"></div>
                <div class="explorer-toolbar-section">
                    <button class="explorer-toolbar-button" title="Cut">
                        <span class="sprite-icon-grey sprite-cut button-icon"></span>
                        <span class="button-text">Cut</span>
                    </button>
                    <button class="explorer-toolbar-button" title="Copy">
                        <span class="sprite-icon-grey sprite-copy button-icon"></span>
                        <span class="button-text">Copy</span>
                    </button>
                    <button class="explorer-toolbar-button" title="Paste">
                        <span class="sprite-icon-grey sprite-paste button-icon"></span>
                        <span class="button-text">Paste</span>
                    </button>
                </div>
                <div class="explorer-toolbar-separator"></div>
                <div class="explorer-toolbar-section">
                    <button class="explorer-toolbar-button" title="Delete">
                        <span class="sprite-icon-grey sprite-delete button-icon"></span>
                        <span class="button-text">Delete</span>
                    </button>
                    <button class="explorer-toolbar-button" title="Properties">
                        <span class="sprite-icon-grey sprite-properties button-icon"></span>
                        <span class="button-text">Properties</span>
                    </button>
                </div>
                <div class="explorer-toolbar-separator"></div>
                <div class="explorer-toolbar-section">
                    <button class="explorer-toolbar-button" title="Views">
                        <span class="sprite-icon-grey sprite-views button-icon"></span>
                        <span class="button-text">Views</span>
                    </button>
                </div>
            </div>
            <div class="explorer-address-bar-container">
                <label>Address</label>
                <div class="explorer-address-bar">
                    <img src="icons/directory_open_file_mydocs-0.png" alt="My Documents">
                    <span>C:\\My Documents</span>
                </div>
            </div>
            <div class="explorer-content">
                <div class="file-icon" data-action="openDocument">
                    <img src="icons/notepad_file-0.png" alt="Letter to Mom.txt">
                    <span>Letter to Mom.txt</span>
                </div>
                <div class="file-icon" data-action="openDocument">
                    <img src="icons/wordpad_file-0.png" alt="Resume.doc">
                    <span>Resume.doc</span>
                </div>
                <div class="file-icon" data-action="openDocument">
                    <img src="icons/notepad_file-0.png" alt="Shopping List.txt">
                    <span>Shopping List.txt</span>
                </div>
                <div class="file-icon" data-action="openDocument">
                    <img src="icons/wordpad_file-0.png" alt="Meeting Notes.doc">
                    <span>Meeting Notes.doc</span>
                </div>
                <div class="file-icon" data-action="openDocument">
                    <img src="icons/file_text-0.png" alt="Budget.txt">
                    <span>Budget.txt</span>
                </div>
                <div class="file-icon" data-action="openDocument">
                    <img src="icons/wordpad_file-0.png" alt="Project Proposal.doc">
                    <span>Project Proposal.doc</span>
                </div>
                <div class="file-icon" data-action="openDocument">
                    <img src="icons/notepad_file-0.png" alt="Ideas.txt">
                    <span>Ideas.txt</span>
                </div>
                <div class="file-icon" data-action="openDocument">
                    <img src="icons/file_text-0.png" alt="Phone Numbers.txt">
                    <span>Phone Numbers.txt</span>
                </div>
                <div class="file-icon" data-action="openFolder">
                    <img src="icons/directory_closed-0.png" alt="Personal">
                    <span>Personal</span>
                </div>
                <div class="file-icon" data-action="openFolder">
                    <img src="icons/directory_closed-0.png" alt="Work">
                    <span>Work</span>
                </div>
                <div class="file-icon" data-action="openFolder">
                    <img src="icons/directory_closed-0.png" alt="Photos">
                    <span>Photos</span>
                </div>
            </div>
            <div class="explorer-status-bar">
                <span>11 object(s)</span>
            </div>
        `;

        const windowEl = Windows.createWindow('My Documents', content, 650, 480, undefined, undefined, true);

        // Update menu bar to match Explorer
        const menuBar = windowEl.querySelector('.window-menubar');
        if (menuBar) {
            menuBar.innerHTML = `
                <div class="window-menu-item" data-menu="file">File</div>
                <div class="window-menu-item" data-menu="edit">Edit</div>
                <div class="window-menu-item" data-menu="view">View</div>
                <div class="window-menu-item" data-menu="tools">Tools</div>
                <div class="window-menu-item" data-menu="help">Help</div>
            `;

            // Add menu functionality
            Windows.setupMenuBar(menuBar);
        }

        // Setup event listeners for the icons
        setTimeout(() => {
            const explorerContent = windowEl.querySelector('.explorer-content');
            const fileIcons = windowEl.querySelectorAll('.window-content .file-icon');

            // Handle clicking on empty space to deselect all
            explorerContent.addEventListener('click', function(e) {
                if (e.target === explorerContent) {
                    fileIcons.forEach(icon => icon.classList.remove('selected'));
                }
            });

            // Handle right-click on empty space
            explorerContent.addEventListener('contextmenu', function(e) {
                if (e.target === explorerContent) {
                    e.preventDefault();
                    fileIcons.forEach(icon => icon.classList.remove('selected'));

                    if (WinOS && WinOS.components.menus) {
                        WinOS.components.menus.showExplorerContextMenu(e.clientX, e.clientY, 'my-documents');
                    }
                }
            });

            fileIcons.forEach(icon => {
                icon.addEventListener('click', function(e) {
                    e.stopPropagation();

                    // Handle Ctrl+click for multiple selection
                    if (!e.ctrlKey) {
                        fileIcons.forEach(i => i.classList.remove('selected'));
                    }

                    this.classList.toggle('selected');
                });

                icon.addEventListener('dblclick', function(e) {
                    e.stopPropagation();
                    const action = this.getAttribute('data-action');
                    const fileName = this.querySelector('span').textContent;

                    if (action === 'openDocument') {
                        Windows.openDocument(fileName);
                    } else if (action === 'openFolder') {
                        console.log('Opening folder:', fileName);
                        // Placeholder for opening folders
                    }
                });

                // Add right-click context menu
                icon.addEventListener('contextmenu', function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    if (!this.classList.contains('selected')) {
                        fileIcons.forEach(i => i.classList.remove('selected'));
                        this.classList.add('selected');
                    }

                    const fileName = this.querySelector('span').textContent;
                    const action = this.getAttribute('data-action');
                    const fileType = action === 'openFolder' ? 'folder' : 'file';

                    if (WinOS && WinOS.components.menus) {
                        WinOS.components.menus.showFileContextMenu(e.clientX, e.clientY, fileName, fileType, 'my-documents');
                    }
                });
            });
        }, 0);

        return windowEl;
    },

    // Open a document in Notepad or WordPad
    openDocument: function(fileName) {
        const isWordDoc = fileName.endsWith('.doc');
        const appName = isWordDoc ? 'WordPad' : 'Notepad';

        // Mock document content based on filename
        let content = '';
        switch(fileName) {
            case 'Letter to Mom.txt':
                content = 'Dear Mom,\n\nI hope you are doing well. I wanted to let you know that everything is going great here. The new job is challenging but rewarding.\n\nLove,\nYour child';
                break;
            case 'Resume.doc':
                content = 'JOHN DOE\n123 Main Street, Anytown, USA\nPhone: (555) 123-4567\n\nOBJECTIVE:\nSeeking a challenging position in software development.\n\nEXPERIENCE:\n- Software Developer at Tech Corp (1995-1998)\n- Junior Developer at StartUp Inc (1993-1995)';
                break;
            case 'Shopping List.txt':
                content = 'Shopping List:\n\n- Milk\n- Bread\n- Eggs\n- Butter\n- Apples\n- Chicken\n- Rice\n- Pasta\n- Cheese\n- Orange juice';
                break;
            case 'Meeting Notes.doc':
                content = 'MEETING NOTES - Project Planning\nDate: March 15, 1998\n\nAttendees: John, Sarah, Mike, Lisa\n\nAgenda:\n1. Project timeline review\n2. Budget allocation\n3. Resource planning\n\nAction Items:\n- John: Finalize requirements by Friday\n- Sarah: Prepare budget proposal';
                break;
            case 'Budget.txt':
                content = 'Monthly Budget - March 1998\n\nIncome: $3,500\n\nExpenses:\n- Rent: $800\n- Utilities: $150\n- Food: $400\n- Transportation: $200\n- Entertainment: $100\n- Savings: $500\n\nRemaining: $1,350';
                break;
            case 'Project Proposal.doc':
                content = 'PROJECT PROPOSAL\nTitle: Website Redesign Initiative\n\nOverview:\nThis proposal outlines the plan to redesign our company website to improve user experience and modernize the design.\n\nObjectives:\n- Improve navigation\n- Update visual design\n- Optimize for performance';
                break;
            case 'Ideas.txt':
                content = 'Random Ideas:\n\n- Learn a new programming language\n- Start a side project\n- Organize the garage\n- Plan a vacation\n- Read more books\n- Exercise regularly\n- Learn to cook new recipes';
                break;
            case 'Phone Numbers.txt':
                content = 'Important Phone Numbers:\n\nWork: (555) 123-4567\nDoctor: (555) 234-5678\nDentist: (555) 345-6789\nPlumber: (555) 456-7890\nElectrician: (555) 567-8901\nPizza Place: (555) 678-9012';
                break;
            default:
                content = `This is the content of ${fileName}.\n\nCreated in Windows 98 environment.`;
        }

        const documentContent = `
            <textarea style="width: 100%; height: 100%; resize: none; border: 1px inset #808080; font-family: 'Lucida Console', monospace; font-size: 12px; padding: 4px; background-color: white;">${content}</textarea>
        `;

        Windows.createWindow(`${fileName} - ${appName}`, documentContent, 500, 400);
    },

    // Open Internet Explorer window
    openInternetExplorer: function() {
        const content = `
            <div class="ie-toolbar">
                <div class="ie-toolbar-section">
                    <button class="ie-toolbar-button" disabled title="Back">
                        <span class="sprite-icon sprite-back"></span>
                    </button>
                    <button class="ie-toolbar-button" disabled title="Forward">
                        <span class="sprite-icon sprite-forward"></span>
                    </button>
                    <button class="ie-toolbar-button" title="Stop">
                        <span class="sprite-icon sprite-stop"></span>
                    </button>
                    <button class="ie-toolbar-button" title="Refresh">
                        <span class="sprite-icon sprite-refresh"></span>
                    </button>
                    <button class="ie-toolbar-button" title="Home">
                        <span class="sprite-icon sprite-home"></span>
                    </button>
                </div>
                <div class="ie-toolbar-separator"></div>
                <div class="ie-toolbar-section">
                    <button class="ie-toolbar-button" title="Search">
                        <span class="sprite-icon sprite-search"></span>
                    </button>
                    <button class="ie-toolbar-button" title="Favorites">
                        <span class="sprite-icon sprite-favorites"></span>
                    </button>
                    <button class="ie-toolbar-button" title="History">
                        <span class="sprite-icon sprite-history"></span>
                    </button>
                    <button class="ie-toolbar-button" title="Mail">
                        <span class="sprite-icon sprite-mail"></span>
                    </button>
                    <button class="ie-toolbar-button" title="Print">
                        <span class="sprite-icon sprite-print"></span>
                    </button>
                    <button class="ie-toolbar-button" title="Edit">
                        <span class="sprite-icon sprite-edit"></span>
                    </button>
                </div>
            </div>
            <div class="ie-address-bar-container">
                <label>Address</label>
                <div class="ie-address-bar">
                    <span>http://www.microsoft.com/ie/</span>
                </div>
                <button class="ie-go-button">Go</button>
            </div>
            <div class="ie-content">
                <div class="ie-page">
                    <div class="ie-header">
                        <img src="icons/msie1-0.png" alt="Internet Explorer" style="width: 32px; height: 32px; float: left; margin-right: 10px;">
                        <h1>Welcome to Internet Explorer 4.0</h1>
                        <div style="clear: both;"></div>
                    </div>

                    <div class="ie-section">
                        <h2>The Web the Way You Want It</h2>
                        <p>Internet Explorer 4.0 brings you the best of the Web with enhanced browsing capabilities, improved performance, and seamless integration with Windows 98.</p>
                    </div>

                    <div class="ie-section">
                        <h3>Features:</h3>
                        <ul>
                            <li>Enhanced security and privacy controls</li>
                            <li>Improved JavaScript and CSS support</li>
                            <li>Integrated search capabilities</li>
                            <li>Favorites and history management</li>
                            <li>Offline browsing support</li>
                        </ul>
                    </div>

                    <div class="ie-section">
                        <h3>Quick Links:</h3>
                        <div class="ie-links">
                            <a href="#" onclick="return false;">Microsoft Home</a> |
                            <a href="#" onclick="return false;">Windows Update</a> |
                            <a href="#" onclick="return false;">MSN</a> |
                            <a href="#" onclick="return false;">Hotmail</a> |
                            <a href="#" onclick="return false;">Search</a>
                        </div>
                    </div>

                    <div class="ie-section">
                        <p><em>Experience the Internet like never before with Internet Explorer 4.0 - now with Active Desktop integration!</em></p>
                    </div>
                </div>
            </div>
            <div class="ie-status-bar">
                <span>Done</span>
                <div class="ie-status-right">
                    <span>Internet zone</span>
                </div>
            </div>
        `;

        const windowEl = Windows.createWindow('Microsoft Internet Explorer', content, 700, 550, undefined, undefined, true);

        // Update menu bar for Internet Explorer
        const menuBar = windowEl.querySelector('.window-menubar');
        if (menuBar) {
            menuBar.innerHTML = `
                <div class="window-menu-item" data-menu="file">File</div>
                <div class="window-menu-item" data-menu="edit">Edit</div>
                <div class="window-menu-item" data-menu="view">View</div>
                <div class="window-menu-item" data-menu="go">Go</div>
                <div class="window-menu-item" data-menu="favorites">Favorites</div>
                <div class="window-menu-item" data-menu="help">Help</div>
            `;

            // Add menu functionality
            Windows.setupMenuBar(menuBar);
        }

        return windowEl;
    },

    // Create a "Notepad" window.
    createNotepadWindow: function() {
        const content = `
            <textarea style="width: 100%; height: 100%; resize: none; border: 1px inset #808080; font-family: 'Lucida Console', monospace; font-size: 12px; padding: 2px;"></textarea>
        `;
        Windows.createWindow('Untitled - Notepad', content, 400, 300);
    },

    // Create the "Run" dialog window.
    createRunDialog: function() {
        const content = `
            <div class="dialog-content">
                <div style="margin-bottom: 15px; display: flex; align-items: center;">
                    <img src="icons/application_hourglass-0.png" alt="Run" style="width: 32px; height: 32px; margin-right: 10px;">
                    <span>Type the name of a program, folder, document, or Internet resource, and Windows will open it for you.</span>
                </div>
                <div style="margin-bottom: 15px;">
                    <label for="run-input" style="display: block; margin-bottom: 5px;">Open:</label>
                    <div style="display: flex;">
                        <input type="text" id="run-input" class="win98-input" style="flex: 1;">
                        <button class="win98-button" style="width: 24px; height: 24px; min-width: auto; margin-left: 5px; display: flex; align-items: center; justify-content: center;">
                            <span style="font-size: 14px;">...</span>
                        </button>
                    </div>
                </div>
                <div class="dialog-footer">
                    <button class="win98-button">OK</button>
                    <button class="win98-button">Cancel</button>
                    <button class="win98-button">Browse...</button>
                </div>
            </div>
        `;
        Windows.createWindow('Run', content, 400, 200, undefined, undefined, false);
    },

    // Create the "Shutdown" dialog window.
    createShutdownDialog: function() {
        const content = `
            <div class="dialog-content">
                <div style="margin-bottom: 15px; display: flex; align-items: center;">
                    <img src="icons/shut_down-0.png" alt="Shutdown" style="width: 32px; height: 32px; margin-right: 10px;">
                    <span>What do you want the computer to do?</span>
                </div>
                <div style="margin-bottom: 15px;">
                    <select class="win98-select" style="width: 100%;">
                        <option>Shut down</option>
                        <option>Restart</option>
                        <option>Restart in MS-DOS mode</option>
                        <option>Stand by</option>
                    </select>
                </div>
                <div class="dialog-footer">
                    <button class="win98-button">OK</button>
                    <button class="win98-button">Cancel</button>
                    <button class="win98-button">Help</button>
                </div>
            </div>
        `;
        Windows.createWindow('Shut Down Windows', content, 350, 180, undefined, undefined, false);
    }
};

// Attach the Windows module to the global WinOS components.
if (!window.WinOS) window.WinOS = {};
if (!window.WinOS.components) window.WinOS.components = {};
window.WinOS.components.windows = Windows;
