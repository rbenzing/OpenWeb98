// js/windows/explorer.js

/**
 * Enhanced Windows Explorer Module
 * Implements Windows 98-style file explorer with multiple view modes
 */

const WindowsExplorer = {
    currentView: 'large-icons', // 'large-icons', 'small-icons', 'list', 'details'
    currentPath: 'My Computer',
    historyBack: [],
    historyForward: [],

    /**
     * Create an enhanced My Computer window
     */
    openMyComputer: function() {
        const content = this.buildExplorerContent('My Computer', this.getMyComputerItems());

        const windowData = WindowCore.createWindow(
            'My Computer',
            content,
            640,
            480,
            null,
            null,
            true,
            'icons/my_computer-0.png'
        );

        const windowEl = windowData.element;

        // Update menu bar
        const menuBar = windowEl.querySelector('.window-menubar');
        if (menuBar) {
            menuBar.innerHTML = `
                <div class="window-menu-item">File</div>
                <div class="window-menu-item">Edit</div>
                <div class="window-menu-item">View</div>
                <div class="window-menu-item">Tools</div>
                <div class="window-menu-item">Help</div>
            `;
        }

        // Initialize explorer functionality
        this.initializeExplorer(windowEl);

        return windowData;
    },

    /**
     * Build explorer content HTML
     */
    buildExplorerContent: function(title, items) {
        return `
            <div class="explorer-container">
                <!-- Toolbar -->
                <div class="explorer-toolbar">
                    ${this.buildToolbarHTML()}
                </div>

                <!-- Address Bar -->
                <div class="explorer-address-bar-container">
                    <label>Address</label>
                    <div class="explorer-address-bar">
                        <img src="${this.getAddressIcon(title)}" alt="" class="address-icon">
                        <span class="address-path">${title}</span>
                        <button class="address-dropdown-btn">▼</button>
                    </div>
                </div>

                <!-- Content Area -->
                <div class="explorer-content view-${this.currentView}" data-view="${this.currentView}">
                    ${this.buildItemsHTML(items)}
                </div>

                <!-- Status Bar -->
                <div class="explorer-status-bar">
                    <span>${items.length} object(s)</span>
                </div>
            </div>
        `;
    },

    /**
     * Build toolbar HTML with all buttons
     */
    buildToolbarHTML: function() {
        return `
            <div class="toolbar-section">
                <button class="toolbar-btn" data-action="back" disabled title="Back">
                    <img src="data:image/svg+xml,${encodeURIComponent(this.getSVGIcon('back'))}" alt="Back">
                    <span>Back</span>
                </button>
                <button class="toolbar-btn" data-action="forward" disabled title="Forward">
                    <img src="data:image/svg+xml,${encodeURIComponent(this.getSVGIcon('forward'))}" alt="Forward">
                    <span>Forward</span>
                </button>
                <button class="toolbar-btn" data-action="up" title="Up">
                    <img src="data:image/svg+xml,${encodeURIComponent(this.getSVGIcon('up'))}" alt="Up">
                    <span>Up</span>
                </button>
            </div>
            <div class="toolbar-separator"></div>
            <div class="toolbar-section">
                <button class="toolbar-btn" data-action="cut" title="Cut">
                    <img src="data:image/svg+xml,${encodeURIComponent(this.getSVGIcon('cut'))}" alt="Cut">
                    <span>Cut</span>
                </button>
                <button class="toolbar-btn" data-action="copy" title="Copy">
                    <img src="data:image/svg+xml,${encodeURIComponent(this.getSVGIcon('copy'))}" alt="Copy">
                    <span>Copy</span>
                </button>
                <button class="toolbar-btn" data-action="paste" title="Paste">
                    <img src="data:image/svg+xml,${encodeURIComponent(this.getSVGIcon('paste'))}" alt="Paste">
                    <span>Paste</span>
                </button>
            </div>
            <div class="toolbar-separator"></div>
            <div class="toolbar-section">
                <button class="toolbar-btn" data-action="undo" title="Undo">
                    <img src="data:image/svg+xml,${encodeURIComponent(this.getSVGIcon('undo'))}" alt="Undo">
                    <span>Undo</span>
                </button>
            </div>
            <div class="toolbar-separator"></div>
            <div class="toolbar-section">
                <button class="toolbar-btn" data-action="delete" title="Delete">
                    <img src="data:image/svg+xml,${encodeURIComponent(this.getSVGIcon('delete'))}" alt="Delete">
                    <span>Delete</span>
                </button>
                <button class="toolbar-btn" data-action="properties" title="Properties">
                    <img src="data:image/svg+xml,${encodeURIComponent(this.getSVGIcon('properties'))}" alt="Properties">
                    <span>Properties</span>
                </button>
            </div>
            <div class="toolbar-separator"></div>
            <div class="toolbar-section">
                <button class="toolbar-btn" data-action="views" title="Views">
                    <img src="data:image/svg+xml,${encodeURIComponent(this.getSVGIcon('views'))}" alt="Views">
                    <span>Views</span>
                </button>
            </div>
        `;
    },

    /**
     * Build items HTML based on current view mode
     */
    buildItemsHTML: function(items) {
        return items.map(item => this.buildItemHTML(item)).join('');
    },

    /**
     * Build single item HTML
     */
    buildItemHTML: function(item) {
        const viewMode = this.currentView;

        if (viewMode === 'large-icons') {
            return `
                <div class="file-item large-icon" data-name="${item.name}" data-action="${item.action || ''}">
                    <img src="${item.icon}" alt="${item.name}">
                    <span>${item.name}</span>
                </div>
            `;
        } else if (viewMode === 'small-icons') {
            return `
                <div class="file-item small-icon" data-name="${item.name}" data-action="${item.action || ''}">
                    <img src="${item.icon}" alt="${item.name}">
                    <span>${item.name}</span>
                </div>
            `;
        } else if (viewMode === 'list') {
            return `
                <div class="file-item list-item" data-name="${item.name}" data-action="${item.action || ''}">
                    <img src="${item.icon}" alt="${item.name}">
                    <span>${item.name}</span>
                </div>
            `;
        } else { // details
            return `
                <div class="file-item details-item" data-name="${item.name}" data-action="${item.action || ''}">
                    <div class="detail-column detail-name">
                        <img src="${item.icon}" alt="${item.name}">
                        <span>${item.name}</span>
                    </div>
                    <div class="detail-column detail-size">${item.size || ''}</div>
                    <div class="detail-column detail-type">${item.type || ''}</div>
                    <div class="detail-column detail-modified">${item.modified || ''}</div>
                </div>
            `;
        }
    },

    /**
     * Create Control Panel window
     */
    openControlPanel: function() {
        const content = this.buildExplorerContent('Control Panel', this.getControlPanelItems());

        const windowData = WindowCore.createWindow(
            'Control Panel',
            content,
            640,
            480,
            null,
            null,
            true,
            'icons/directory_control_panel-0.png'
        );

        const windowEl = windowData.element;

        // Update menu bar
        const menuBar = windowEl.querySelector('.window-menubar');
        if (menuBar) {
            menuBar.innerHTML = `
                <div class="window-menu-item">File</div>
                <div class="window-menu-item">Edit</div>
                <div class="window-menu-item">View</div>
                <div class="window-menu-item">Tools</div>
                <div class="window-menu-item">Help</div>
            `;
        }

        // Initialize explorer functionality
        this.initializeExplorer(windowEl);

        // Add double-click handler for Display Properties
        setTimeout(() => {
            const displayIcon = Array.from(windowEl.querySelectorAll('.file-item')).find(item =>
                item.dataset.name === 'Display'
            );

            if (displayIcon) {
                displayIcon.addEventListener('dblclick', () => {
                    if (window.DisplayProperties) {
                        DisplayProperties.open();
                    }
                });
            }
        }, 100);

        return windowData;
    },

    /**
     * Get My Computer items
     */
    getMyComputerItems: function() {
        return [
            {
                name: 'Local Disk (C:)',
                icon: 'icons/hard_disk_drive-2.png',
                action: 'openDriveC',
                size: '',
                type: 'Local Disk',
                modified: ''
            },
            {
                name: '3½ Floppy (A:)',
                icon: 'icons/floppy_drive_3_5-0.png',
                action: 'openDriveA',
                size: '',
                type: '3½-Inch Floppy Disk',
                modified: ''
            },
            {
                name: 'CD-ROM Drive (D:)',
                icon: 'icons/cd_drive-0.png',
                action: 'openDriveD',
                size: '',
                type: 'CD Drive',
                modified: ''
            },
            {
                name: 'Control Panel',
                icon: 'icons/directory_control_panel-3.png',
                action: 'openControlPanel',
                size: '',
                type: 'System Folder',
                modified: ''
            },
            {
                name: 'Printers',
                icon: 'icons/printer-0.png',
                action: 'openPrinters',
                size: '',
                type: 'System Folder',
                modified: ''
            },
            {
                name: 'Dial-Up Networking',
                icon: 'icons/directory_dial_up_networking-3.png',
                action: 'openDialUp',
                size: '',
                type: 'System Folder',
                modified: ''
            }
        ];
    },

    /**
     * Get Control Panel items
     */
    getControlPanelItems: function() {
        return [
            {
                name: 'Accessibility Options',
                icon: 'icons/accessibility-0.png',
                action: 'openAccessibility',
                size: '',
                type: 'Control Panel',
                modified: ''
            },
            {
                name: 'Display',
                icon: 'icons/display_properties-1.png',
                action: 'openDisplay',
                size: '',
                type: 'Control Panel',
                modified: ''
            },
            {
                name: 'Keyboard',
                icon: 'icons/keyboard-0.png',
                action: 'openKeyboard',
                size: '',
                type: 'Control Panel',
                modified: ''
            },
            {
                name: 'Mouse',
                icon: 'icons/mouse-2.png',
                action: 'openMouse',
                size: '',
                type: 'Control Panel',
                modified: ''
            },
            {
                name: 'Network',
                icon: 'icons/network-0.png',
                action: 'openNetwork',
                size: '',
                type: 'Control Panel',
                modified: ''
            },
            {
                name: 'Printers',
                icon: 'icons/printer-0.png',
                action: 'openPrinters',
                size: '',
                type: 'Control Panel',
                modified: ''
            },
            {
                name: 'Sounds',
                icon: 'icons/loudspeaker_rays-0.png',
                action: 'openSounds',
                size: '',
                type: 'Control Panel',
                modified: ''
            },
            {
                name: 'Date/Time',
                icon: 'icons/time_and_date-0.png',
                action: 'openDateTime',
                size: '',
                type: 'Control Panel',
                modified: ''
            },
            {
                name: 'Add New Hardware',
                icon: 'icons/hardware-0.png',
                action: 'openAddHardware',
                size: '',
                type: 'Control Panel',
                modified: ''
            },
            {
                name: 'Add/Remove Programs',
                icon: 'icons/appwizard-0.png',
                action: 'openAddRemovePrograms',
                size: '',
                type: 'Control Panel',
                modified: ''
            },
            {
                name: 'Fonts',
                icon: 'icons/font_tt-0.png',
                action: 'openFonts',
                size: '',
                type: 'Control Panel',
                modified: ''
            },
            {
                name: 'Regional Settings',
                icon: 'icons/world-0.png',
                action: 'openRegional',
                size: '',
                type: 'Control Panel',
                modified: ''
            },
            {
                name: 'Passwords',
                icon: 'icons/key_win-0.png',
                action: 'openPasswords',
                size: '',
                type: 'Control Panel',
                modified: ''
            },
            {
                name: 'Internet Options',
                icon: 'icons/internet_options-0.png',
                action: 'openInternetOptions',
                size: '',
                type: 'Control Panel',
                modified: ''
            },
            {
                name: 'System',
                icon: 'icons/computer-0.png',
                action: 'openSystem',
                size: '',
                type: 'Control Panel',
                modified: ''
            }
        ];
    },

    /**
     * Initialize explorer event handlers
     */
    initializeExplorer: function(windowEl) {
        // Toolbar buttons
        const toolbarButtons = windowEl.querySelectorAll('.toolbar-btn');
        toolbarButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = btn.dataset.action;
                this.handleToolbarAction(action, windowEl);
            });
        });

        // File items
        const items = windowEl.querySelectorAll('.file-item');
        items.forEach(item => {
            // Click
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleItemClick(item, e.ctrlKey, windowEl);
            });

            // Double-click
            item.addEventListener('dblclick', (e) => {
                e.stopPropagation();
                this.handleItemDoubleClick(item, windowEl);
            });

            // Context menu
            item.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.handleItemContextMenu(item, e, windowEl);
            });
        });

        // Content area click (deselect)
        const content = windowEl.querySelector('.explorer-content');
        content.addEventListener('click', (e) => {
            if (e.target === content) {
                this.deselectAll(windowEl);
            }
        });

        // Address dropdown
        const addressDropdown = windowEl.querySelector('.address-dropdown-btn');
        if (addressDropdown) {
            addressDropdown.addEventListener('click', (e) => {
                this.showAddressDropdown(e, windowEl);
            });
        }
    },

    /**
     * Handle toolbar actions
     */
    handleToolbarAction: function(action, windowEl) {
        switch(action) {
            case 'back':
                this.navigateBack(windowEl);
                break;
            case 'forward':
                this.navigateForward(windowEl);
                break;
            case 'up':
                this.navigateUp(windowEl);
                break;
            case 'views':
                this.showViewsMenu(windowEl);
                break;
            case 'cut':
            case 'copy':
            case 'paste':
            case 'undo':
            case 'delete':
            case 'properties':
                console.log(`Action: ${action}`);
                break;
        }
    },

    /**
     * Show views menu
     */
    showViewsMenu: function(windowEl) {
        const viewsBtn = windowEl.querySelector('[data-action="views"]');
        const rect = viewsBtn.getBoundingClientRect();

        // Create views menu
        const menu = document.createElement('div');
        menu.className = 'context-menu views-menu';
        menu.style.position = 'fixed';
        menu.style.left = rect.left + 'px';
        menu.style.top = rect.bottom + 'px';
        menu.style.zIndex = '10000';
        menu.innerHTML = `
            <div class="context-menu-item" data-view="large-icons">
                <span>${this.currentView === 'large-icons' ? '• ' : ''}Large Icons</span>
            </div>
            <div class="context-menu-item" data-view="small-icons">
                <span>${this.currentView === 'small-icons' ? '• ' : ''}Small Icons</span>
            </div>
            <div class="context-menu-item" data-view="list">
                <span>${this.currentView === 'list' ? '• ' : ''}List</span>
            </div>
            <div class="context-menu-item" data-view="details">
                <span>${this.currentView === 'details' ? '• ' : ''}Details</span>
            </div>
        `;

        document.body.appendChild(menu);

        // Handle view selection
        menu.querySelectorAll('.context-menu-item').forEach(item => {
            item.addEventListener('click', () => {
                const view = item.dataset.view;
                this.switchView(view, windowEl);
                document.body.removeChild(menu);
            });
        });

        // Close on outside click
        setTimeout(() => {
            const closeHandler = (e) => {
                if (!menu.contains(e.target) && e.target !== viewsBtn) {
                    if (menu.parentNode) {
                        document.body.removeChild(menu);
                    }
                    document.removeEventListener('click', closeHandler);
                }
            };
            document.addEventListener('click', closeHandler);
        }, 0);
    },

    /**
     * Switch view mode
     */
    switchView: function(viewMode, windowEl) {
        this.currentView = viewMode;

        const content = windowEl.querySelector('.explorer-content');
        const items = this.getMyComputerItems(); // TODO: Get current items

        // Update view class
        content.className = `explorer-content view-${viewMode}`;
        content.dataset.view = viewMode;

        // Rebuild items
        content.innerHTML = this.buildItemsHTML(items);

        // Re-initialize event handlers
        this.initializeExplorer(windowEl);
    },

    /**
     * Handle item click
     */
    handleItemClick: function(item, ctrlKey, windowEl) {
        const items = windowEl.querySelectorAll('.file-item');

        if (!ctrlKey) {
            items.forEach(i => i.classList.remove('selected'));
        }

        item.classList.toggle('selected');
    },

    /**
     * Handle item double-click
     */
    handleItemDoubleClick: function(item, windowEl) {
        const action = item.dataset.action;
        const name = item.dataset.name;

        if (action) {
            // Route to appropriate handler
            switch(action) {
                case 'openControlPanel':
                    this.openControlPanel();
                    break;
                case 'openDisplay':
                    if (window.DisplayProperties) {
                        DisplayProperties.open();
                    }
                    break;
                case 'openDriveC':
                case 'openDriveA':
                case 'openDriveD':
                case 'openPrinters':
                case 'openDialUp':
                    console.log(`Opening: ${name}`);
                    // TODO: Implement drive/folder navigation
                    break;
                default:
                    console.log(`Double-clicked: ${action}`);
            }
        }
    },

    /**
     * Handle item context menu
     */
    handleItemContextMenu: function(item, event, windowEl) {
        // Select item if not already selected
        if (!item.classList.contains('selected')) {
            this.deselectAll(windowEl);
            item.classList.add('selected');
        }

        // TODO: Show context menu
        console.log('Context menu for:', item.dataset.name);
    },

    /**
     * Deselect all items
     */
    deselectAll: function(windowEl) {
        const items = windowEl.querySelectorAll('.file-item');
        items.forEach(i => i.classList.remove('selected'));
    },

    /**
     * Show address dropdown
     */
    showAddressDropdown: function(event, windowEl) {
        // TODO: Implement address dropdown with recent locations
        console.log('Address dropdown');
    },

    /**
     * Navigation methods
     */
    navigateBack: function(windowEl) {
        // TODO: Implement back navigation
    },

    navigateForward: function(windowEl) {
        // TODO: Implement forward navigation
    },

    navigateUp: function(windowEl) {
        // TODO: Implement up navigation
    },

    /**
     * Get address bar icon based on title
     */
    getAddressIcon: function(title) {
        const icons = {
            'My Computer': 'icons/my_computer-0.png',
            'Control Panel': 'icons/directory_control_panel-0.png',
            'Recycle Bin': 'icons/recycle_bin_empty-0.png',
            'My Documents': 'icons/directory_open_file_mydocs-0.png'
        };

        return icons[title] || 'icons/directory_open-0.png';
    },

    /**
     * SVG Icons for toolbar buttons
     */
    getSVGIcon: function(name) {
        const icons = {
            'back': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="#000" d="M8 2L2 8l6 6v-4h6V6H8z"/></svg>`,
            'forward': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="#000" d="M8 2l6 6-6 6v-4H2V6h6z"/></svg>`,
            'up': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="#000" d="M8 2l6 6h-4v6H6V8H2z"/></svg>`,
            'cut': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><circle cx="4" cy="12" r="2" fill="#000"/><circle cx="12" cy="12" r="2" fill="#000"/><path fill="#000" d="M14 2l-6 6m0 0L2 2"/></svg>`,
            'copy': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><rect x="2" y="2" width="9" height="9" fill="none" stroke="#000" stroke-width="1"/><rect x="5" y="5" width="9" height="9" fill="none" stroke="#000" stroke-width="1"/></svg>`,
            'paste': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><rect x="3" y="5" width="10" height="9" fill="none" stroke="#000" stroke-width="1"/><rect x="6" y="2" width="4" height="3" fill="#000"/></svg>`,
            'undo': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="#000" d="M8 3L3 7l5 4V8h5V5H8z"/></svg>`,
            'delete': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><rect x="4" y="5" width="8" height="9" fill="none" stroke="#000" stroke-width="1"/><rect x="3" y="3" width="10" height="2" fill="#000"/><rect x="6" y="2" width="4" height="1" fill="#000"/></svg>`,
            'properties': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><rect x="3" y="2" width="10" height="12" fill="none" stroke="#000" stroke-width="1"/><path fill="#000" d="M5 5h6v1H5zm0 2h6v1H5zm0 2h4v1H5z"/></svg>`,
            'views': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><rect x="2" y="2" width="5" height="5" fill="#000"/><rect x="9" y="2" width="5" height="5" fill="#000"/><rect x="2" y="9" width="5" height="5" fill="#000"/><rect x="9" y="9" width="5" height="5" fill="#000"/></svg>`
        };

        return icons[name] || icons['properties'];
    }
};

// Expose globally
window.WindowsExplorer = WindowsExplorer;
