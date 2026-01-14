// js/components/controlPanel/display.js

/**
 * Display Properties Control Panel Applet
 * Implements the Display Properties dialog with all tabs:
 * - Background: Wallpaper selection
 * - Screen Saver: Screen saver selection and preview
 * - Appearance: Color schemes
 * - Effects: Visual effects
 * - Web: Active Desktop settings
 * - Settings: Display resolution and color depth
 */

const DisplayProperties = {
    currentTab: 'background',
    settings: {
        wallpaper: 'none',
        pattern: 'none',
        screenSaver: 'none',
        colorScheme: 'Windows Standard',
        resolution: '800 by 600 pixels',
        colorDepth: 'High Color (16 bit)',
        effects: {
            useTransitionEffects: false,
            smoothEdges: false,
            useAllTransitions: false,
            showWindowContents: false
        }
    },

    // Wallpaper options (Windows 98 defaults)
    wallpapers: [
        { name: '(None)', value: 'none', file: null },
        { name: 'Clouds', value: 'clouds', file: 'clouds.jpg' },
        { name: 'Setup', value: 'setup', file: 'setup.bmp' },
        { name: 'Black Thatch', value: 'black-thatch', file: 'black-thatch.bmp' },
        { name: 'Blue Rivets', value: 'blue-rivets', file: 'blue-rivets.bmp' },
        { name: 'Bubbles', value: 'bubbles', file: 'bubbles.bmp' },
        { name: 'Gold Weave', value: 'gold-weave', file: 'gold-weave.bmp' },
        { name: 'Red Blocks', value: 'red-blocks', file: 'red-blocks.bmp' }
    ],

    // Screen savers
    screenSavers: [
        { name: '(None)', value: 'none' },
        { name: '3D Flying Objects', value: '3d-flying' },
        { name: '3D Maze', value: '3d-maze' },
        { name: '3D Pipes', value: '3d-pipes' },
        { name: '3D Text', value: '3d-text' },
        { name: 'Beziers', value: 'beziers' },
        { name: 'Blank Screen', value: 'blank' },
        { name: 'Flying Windows', value: 'flying-windows' },
        { name: 'Mystify', value: 'mystify' },
        { name: 'Scrolling Marquee', value: 'marquee' },
        { name: 'Starfield', value: 'starfield' }
    ],

    // Color schemes (Windows 98)
    colorSchemes: [
        { name: 'Windows Standard', value: 'standard' },
        { name: 'High Contrast Black', value: 'hc-black' },
        { name: 'High Contrast White', value: 'hc-white' },
        { name: 'Brick', value: 'brick' },
        { name: 'Desert', value: 'desert' },
        { name: 'Eggplant', value: 'eggplant' },
        { name: 'Maple', value: 'maple' },
        { name: 'Marine', value: 'marine' },
        { name: 'Plum', value: 'plum' },
        { name: 'Pumpkin', value: 'pumpkin' },
        { name: 'Rainy Day', value: 'rainy-day' },
        { name: 'Red, White, and Blue', value: 'rwb' },
        { name: 'Rose', value: 'rose' },
        { name: 'Slate', value: 'slate' },
        { name: 'Spruce', value: 'spruce' },
        { name: 'Storm', value: 'storm' },
        { name: 'Teal', value: 'teal' },
        { name: 'Wheat', value: 'wheat' }
    ],

    /**
     * Opens the Display Properties dialog
     */
    open: function() {
        if (!window.WindowCore) {
            console.error('WindowCore not available');
            return;
        }

        const content = this.buildDialogHTML();
        const windowData = WindowCore.createWindow(
            'Display Properties',
            content,
            420,
            475,
            null,
            null,
            false,  // No menu bar
            'icons/display_properties-0.png'
        );

        // Apply dialog-specific styles
        const windowEl = windowData.element;
        windowEl.classList.add('display-properties-dialog');

        // Initialize the dialog
        this.initDialog(windowEl);

        return windowData;
    },

    /**
     * Builds the main dialog HTML structure
     */
    buildDialogHTML: function() {
        return `
            <div class="dialog-content display-properties-content">
                <!-- Tab Strip -->
                <div class="tab-strip">
                    <button class="tab-button active" data-tab="background">Background</button>
                    <button class="tab-button" data-tab="screensaver">Screen Saver</button>
                    <button class="tab-button" data-tab="appearance">Appearance</button>
                    <button class="tab-button" data-tab="effects">Effects</button>
                    <button class="tab-button" data-tab="web">Web</button>
                    <button class="tab-button" data-tab="settings">Settings</button>
                </div>

                <!-- Tab Content -->
                <div class="tab-content-area">
                    ${this.buildBackgroundTab()}
                    ${this.buildScreenSaverTab()}
                    ${this.buildAppearanceTab()}
                    ${this.buildEffectsTab()}
                    ${this.buildWebTab()}
                    ${this.buildSettingsTab()}
                </div>

                <!-- Dialog Buttons -->
                <div class="dialog-buttons">
                    <button class="win98-button dialog-button-ok">OK</button>
                    <button class="win98-button dialog-button-cancel">Cancel</button>
                    <button class="win98-button dialog-button-apply">Apply</button>
                </div>
            </div>
        `;
    },

    /**
     * Background Tab
     */
    buildBackgroundTab: function() {
        return `
            <div class="tab-content active" data-tab-content="background">
                <div class="monitor-preview">
                    <div class="monitor-frame">
                        <div class="monitor-screen">
                            <div class="monitor-desktop" id="preview-desktop"></div>
                        </div>
                        <div class="monitor-stand"></div>
                    </div>
                </div>

                <div class="wallpaper-select-container">
                    <label for="wallpaper-select">Wallpaper:</label>
                    <select id="wallpaper-select" class="win98-select" size="4">
                        ${this.wallpapers.map(wp =>
                            `<option value="${wp.value}">${wp.name}</option>`
                        ).join('')}
                    </select>
                </div>

                <div class="pattern-row">
                    <button class="win98-button" id="browse-wallpaper">Browse...</button>
                    <label for="pattern-select">Pattern:</label>
                    <select id="pattern-select" class="win98-select" style="width: 120px;">
                        <option value="none">(None)</option>
                    </select>
                    <button class="win98-button" id="edit-pattern">Edit Pattern...</button>
                </div>

                <div class="display-options">
                    <label>Display:</label>
                    <div class="radio-group">
                        <label><input type="radio" name="wallpaper-style" value="center" checked> Center</label>
                        <label><input type="radio" name="wallpaper-style" value="tile"> Tile</label>
                        <label><input type="radio" name="wallpaper-style" value="stretch"> Stretch</label>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Screen Saver Tab
     */
    buildScreenSaverTab: function() {
        return `
            <div class="tab-content" data-tab-content="screensaver">
                <div class="monitor-preview">
                    <div class="monitor-frame">
                        <div class="monitor-screen screensaver-preview" id="screensaver-preview"></div>
                        <div class="monitor-stand"></div>
                    </div>
                </div>

                <div class="screensaver-select-container">
                    <label for="screensaver-select">Screen Saver:</label>
                    <select id="screensaver-select" class="win98-select">
                        ${this.screenSavers.map(ss =>
                            `<option value="${ss.value}">${ss.name}</option>`
                        ).join('')}
                    </select>
                </div>

                <div class="screensaver-buttons">
                    <button class="win98-button" id="screensaver-settings">Settings...</button>
                    <button class="win98-button" id="screensaver-preview-btn">Preview</button>
                </div>

                <fieldset>
                    <legend>Energy saving features of monitor</legend>
                    <div class="wait-time-group">
                        <label for="wait-time">Wait:</label>
                        <input type="number" id="wait-time" value="15" min="1" max="60" style="width: 50px;">
                        <span>minutes</span>
                    </div>
                    <div class="checkbox-group">
                        <label><input type="checkbox" id="password-protected"> Password protected</label>
                    </div>
                    <button class="win98-button" id="energy-settings">Energy...</button>
                </fieldset>
            </div>
        `;
    },

    /**
     * Appearance Tab
     */
    buildAppearanceTab: function() {
        return `
            <div class="tab-content" data-tab-content="appearance">
                <div class="appearance-preview">
                    <div class="preview-window">
                        <div class="preview-titlebar">
                            <span>Active Window</span>
                            <div class="preview-buttons">
                                <button>_</button>
                                <button>□</button>
                                <button>X</button>
                            </div>
                        </div>
                        <div class="preview-content">
                            <div class="preview-menu">File Edit View Help</div>
                            <div class="preview-text">
                                Normal Text
                            </div>
                        </div>
                    </div>
                    <div class="preview-inactive-window">
                        <div class="preview-titlebar-inactive">Inactive Window</div>
                    </div>
                    <div class="preview-tooltip">ToolTip</div>
                </div>

                <div class="form-group">
                    <label for="scheme-select">Scheme:</label>
                    <select id="scheme-select" class="win98-select">
                        ${this.colorSchemes.map(cs =>
                            `<option value="${cs.value}">${cs.name}</option>`
                        ).join('')}
                    </select>
                </div>

                <div class="scheme-controls">
                    <button class="win98-button" id="save-scheme">Save As...</button>
                    <button class="win98-button" id="delete-scheme">Delete</button>
                </div>

                <div class="item-customization">
                    <label for="item-select">Item:</label>
                    <select id="item-select" class="win98-select">
                        <option>Desktop</option>
                        <option>Active Title Bar</option>
                        <option>Inactive Title Bar</option>
                        <option>Menu</option>
                        <option>Window</option>
                        <option>Message Box</option>
                        <option>ToolTip</option>
                    </select>

                    <div class="size-color-row">
                        <label>Size:</label>
                        <input type="number" id="item-size" value="18">
                        <label>Color:</label>
                        <input type="color" id="item-color" value="#000080">
                    </div>
                </div>

                <div class="font-options">
                    <div class="font-row">
                        <label for="font-select">Font:</label>
                        <select id="font-select" class="win98-select">
                            <option>MS Sans Serif</option>
                            <option>Arial</option>
                            <option>Tahoma</option>
                        </select>
                        <label>Size:</label>
                        <input type="number" id="font-size" value="8">
                    </div>
                    <div class="font-style-checks">
                        <label><input type="checkbox" id="font-bold"> Bold</label>
                        <label><input type="checkbox" id="font-italic"> Italic</label>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Effects Tab
     */
    buildEffectsTab: function() {
        return `
            <div class="tab-content" data-tab-content="effects">
                <fieldset class="icon-customization">
                    <legend>Desktop icons</legend>
                    <div class="icon-list">
                        <div class="icon-item">
                            <img src="icons/my_computer-0.png" alt="My Computer">
                            <span>My Computer</span>
                            <button class="win98-button">Change Icon...</button>
                        </div>
                        <div class="icon-item">
                            <img src="icons/directory_closed-1.png" alt="My Documents">
                            <span>My Documents</span>
                            <button class="win98-button">Change Icon...</button>
                        </div>
                        <div class="icon-item">
                            <img src="icons/recycle_bin_empty-0.png" alt="Recycle Bin">
                            <span>Recycle Bin</span>
                            <button class="win98-button">Change Icon...</button>
                        </div>
                    </div>
                </fieldset>

                <fieldset class="visual-effects">
                    <legend>Visual effects</legend>
                    <div class="checkbox-group">
                        <label><input type="checkbox" id="effect-transition"> Use transition effects for menus and tooltips</label>
                        <label><input type="checkbox" id="effect-smooth"> Smooth edges of screen fonts</label>
                        <label><input type="checkbox" id="effect-large-icons"> Use large icons</label>
                        <label><input type="checkbox" id="effect-show-contents"> Show window contents while dragging</label>
                        <label><input type="checkbox" id="effect-hide-underline"> Hide keyboard navigation indicators until I use the ALT key</label>
                    </div>
                </fieldset>
            </div>
        `;
    },

    /**
     * Web Tab
     */
    buildWebTab: function() {
        return `
            <div class="tab-content" data-tab-content="web">
                <div class="active-desktop-options">
                    <div class="radio-group" style="flex-direction: column;">
                        <label><input type="radio" name="active-desktop" value="on" checked> Show Web content on my Active Desktop</label>
                        <label><input type="radio" name="active-desktop" value="off"> Use Windows classic desktop</label>
                    </div>
                </div>

                <fieldset class="web-items-container">
                    <legend>Active Desktop items</legend>
                    <div class="web-items-list">
                        <select id="web-items" class="win98-select" size="5">
                            <option>Internet Explorer Channel Bar</option>
                        </select>
                    </div>
                    <div class="web-item-buttons">
                        <button class="win98-button" id="web-new">New...</button>
                        <button class="win98-button" id="web-delete">Delete</button>
                        <button class="win98-button" id="web-properties">Properties...</button>
                    </div>
                </fieldset>
            </div>
        `;
    },

    /**
     * Settings Tab (from screenshot)
     */
    buildSettingsTab: function() {
        return `
            <div class="tab-content" data-tab-content="settings">
                <div class="monitor-preview">
                    <div class="monitor-frame">
                        <div class="monitor-screen">
                            <div class="monitor-desktop settings-preview">
                                <div class="mini-window">
                                    <div class="mini-titlebar"></div>
                                    <div class="mini-content"></div>
                                </div>
                            </div>
                        </div>
                        <div class="monitor-stand"></div>
                    </div>
                </div>

                <div class="form-group">
                    <label>Display:</label>
                    <p class="display-adapter">Default Monitor on ATI Graphics Pro Turbo PCI [ati64 - GX]</p>
                </div>

                <div class="form-group">
                    <label for="colors-select">Colors:</label>
                    <select id="colors-select" class="win98-select">
                        <option>256 Colors</option>
                        <option selected>High Color (16 bit)</option>
                        <option>True Color (32 bit)</option>
                    </select>
                    <div class="color-bar">
                        <div style="background: linear-gradient(to right, #ff00ff, #0000ff, #00ffff, #00ff00, #ffff00, #ff0000, #ff00ff);"></div>
                    </div>
                </div>

                <div class="form-group">
                    <label>Screen area:</label>
                    <div class="resolution-control">
                        <button class="win98-button" id="resolution-less">Less</button>
                        <div class="resolution-slider">
                            <input type="range" id="resolution-slider" min="0" max="5" value="2" step="1">
                        </div>
                        <button class="win98-button" id="resolution-more">More</button>
                    </div>
                    <div class="resolution-display">800 by 600 pixels</div>
                </div>

                <div class="form-group">
                    <div class="checkbox-group">
                        <label><input type="checkbox" id="extend-desktop"> Extend my Windows desktop onto this monitor</label>
                    </div>
                </div>

                <div class="form-group">
                    <button class="win98-button" id="advanced-settings">Advanced...</button>
                </div>
            </div>
        `;
    },

    /**
     * Initialize dialog event handlers
     */
    initDialog: function(windowEl) {
        // Tab switching
        const tabButtons = windowEl.querySelectorAll('.tab-button');
        const tabContents = windowEl.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const tabName = button.dataset.tab;

                // Update active tab button
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Update active tab content
                tabContents.forEach(content => {
                    if (content.dataset.tabContent === tabName) {
                        content.classList.add('active');
                    } else {
                        content.classList.remove('active');
                    }
                });

                this.currentTab = tabName;
            });
        });

        // Background tab handlers
        this.initBackgroundTab(windowEl);

        // Screen saver tab handlers
        this.initScreenSaverTab(windowEl);

        // Appearance tab handlers
        this.initAppearanceTab(windowEl);

        // Effects tab handlers
        this.initEffectsTab(windowEl);

        // Settings tab handlers
        this.initSettingsTab(windowEl);

        // Dialog buttons
        const okBtn = windowEl.querySelector('.dialog-button-ok');
        const cancelBtn = windowEl.querySelector('.dialog-button-cancel');
        const applyBtn = windowEl.querySelector('.dialog-button-apply');

        okBtn.addEventListener('click', () => {
            this.applySettings();
            WindowCore.closeWindow(windowEl);
        });

        cancelBtn.addEventListener('click', () => {
            WindowCore.closeWindow(windowEl);
        });

        applyBtn.addEventListener('click', () => {
            this.applySettings();
        });
    },

    /**
     * Initialize Background tab
     */
    initBackgroundTab: function(windowEl) {
        const wallpaperSelect = windowEl.querySelector('#wallpaper-select');
        const previewDesktop = windowEl.querySelector('#preview-desktop');

        wallpaperSelect.addEventListener('change', (e) => {
            this.settings.wallpaper = e.target.value;
            this.updateWallpaperPreview(previewDesktop, e.target.value);
        });

        // Initialize with current wallpaper
        wallpaperSelect.value = this.settings.wallpaper;
        this.updateWallpaperPreview(previewDesktop, this.settings.wallpaper);
    },

    /**
     * Initialize Screen Saver tab
     */
    initScreenSaverTab: function(windowEl) {
        const ssSelect = windowEl.querySelector('#screensaver-select');
        const previewBtn = windowEl.querySelector('#screensaver-preview-btn');
        const previewArea = windowEl.querySelector('#screensaver-preview');

        ssSelect.addEventListener('change', (e) => {
            this.settings.screenSaver = e.target.value;
            this.updateScreenSaverPreview(previewArea, e.target.value);
        });

        previewBtn.addEventListener('click', () => {
            this.showFullScreenSaverPreview(this.settings.screenSaver);
        });

        // Initialize preview
        ssSelect.value = this.settings.screenSaver;
        this.updateScreenSaverPreview(previewArea, this.settings.screenSaver);
    },

    /**
     * Initialize Appearance tab
     */
    initAppearanceTab: function(windowEl) {
        const schemeSelect = windowEl.querySelector('#scheme-select');

        schemeSelect.addEventListener('change', (e) => {
            this.settings.colorScheme = e.target.value;
            this.updateAppearancePreview(windowEl);
        });

        schemeSelect.value = this.settings.colorScheme;
    },

    /**
     * Initialize Effects tab
     */
    initEffectsTab: function(windowEl) {
        const checkboxes = {
            'effect-transition': 'useTransitionEffects',
            'effect-smooth': 'smoothEdges',
            'effect-show-contents': 'showWindowContents'
        };

        Object.keys(checkboxes).forEach(id => {
            const checkbox = windowEl.querySelector(`#${id}`);
            if (checkbox) {
                checkbox.checked = this.settings.effects[checkboxes[id]];
                checkbox.addEventListener('change', (e) => {
                    this.settings.effects[checkboxes[id]] = e.target.checked;
                });
            }
        });
    },

    /**
     * Initialize Settings tab
     */
    initSettingsTab: function(windowEl) {
        const colorsSelect = windowEl.querySelector('#colors-select');
        const resolutionSlider = windowEl.querySelector('#resolution-slider');
        const resolutionDisplay = windowEl.querySelector('.resolution-display');
        const lessBtn = windowEl.querySelector('#resolution-less');
        const moreBtn = windowEl.querySelector('#resolution-more');

        const resolutions = [
            '640 by 480 pixels',
            '800 by 600 pixels',
            '1024 by 768 pixels',
            '1152 by 864 pixels',
            '1280 by 1024 pixels',
            '1600 by 1200 pixels'
        ];

        colorsSelect.addEventListener('change', (e) => {
            this.settings.colorDepth = e.target.value;
        });

        const updateResolution = () => {
            const index = parseInt(resolutionSlider.value);
            this.settings.resolution = resolutions[index];
            resolutionDisplay.textContent = resolutions[index];
        };

        resolutionSlider.addEventListener('input', updateResolution);

        lessBtn.addEventListener('click', () => {
            if (resolutionSlider.value > 0) {
                resolutionSlider.value = parseInt(resolutionSlider.value) - 1;
                updateResolution();
            }
        });

        moreBtn.addEventListener('click', () => {
            if (resolutionSlider.value < resolutions.length - 1) {
                resolutionSlider.value = parseInt(resolutionSlider.value) + 1;
                updateResolution();
            }
        });

        // Initialize
        resolutionSlider.value = 1; // 800x600
        updateResolution();
    },

    /**
     * Update wallpaper preview
     */
    updateWallpaperPreview: function(previewEl, wallpaperValue) {
        // Remove existing classes
        previewEl.className = 'monitor-desktop';

        if (wallpaperValue === 'none') {
            previewEl.style.background = '#008080'; // Teal default
        } else {
            // Add wallpaper class for CSS background
            previewEl.classList.add('wallpaper-' + wallpaperValue);
        }
    },

    /**
     * Update screen saver preview
     */
    updateScreenSaverPreview: function(previewEl, screenSaverValue) {
        previewEl.innerHTML = '';
        previewEl.className = 'monitor-screen screensaver-preview';

        if (screenSaverValue === 'none') {
            previewEl.style.background = '#000';
            return;
        }

        // Add simple animations for different screen savers
        previewEl.classList.add('ss-' + screenSaverValue);

        switch(screenSaverValue) {
            case 'starfield':
                this.renderStarfield(previewEl);
                break;
            case 'mystify':
                this.renderMystify(previewEl);
                break;
            case 'blank':
                previewEl.style.background = '#000';
                break;
            default:
                previewEl.innerHTML = `<div class="ss-placeholder">${screenSaverValue}</div>`;
        }
    },

    /**
     * Render starfield screen saver preview
     */
    renderStarfield: function(container) {
        container.style.background = '#000';
        for (let i = 0; i < 20; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.animationDelay = Math.random() * 2 + 's';
            container.appendChild(star);
        }
    },

    /**
     * Render mystify screen saver preview
     */
    renderMystify: function(container) {
        container.style.background = '#000';
        const canvas = document.createElement('canvas');
        canvas.width = container.clientWidth || 200;
        canvas.height = container.clientHeight || 150;
        container.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        let lines = [];

        // Simple mystify-like animation
        for (let i = 0; i < 2; i++) {
            lines.push({
                points: [
                    {x: Math.random() * canvas.width, y: Math.random() * canvas.height, dx: 1, dy: 1},
                    {x: Math.random() * canvas.width, y: Math.random() * canvas.height, dx: -1, dy: 1},
                    {x: Math.random() * canvas.width, y: Math.random() * canvas.height, dx: -1, dy: -1},
                    {x: Math.random() * canvas.width, y: Math.random() * canvas.height, dx: 1, dy: -1}
                ],
                color: `hsl(${Math.random() * 360}, 100%, 50%)`
            });
        }

        function animate() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            lines.forEach(line => {
                ctx.strokeStyle = line.color;
                ctx.lineWidth = 2;
                ctx.beginPath();

                line.points.forEach((point, i) => {
                    if (i === 0) {
                        ctx.moveTo(point.x, point.y);
                    } else {
                        ctx.lineTo(point.x, point.y);
                    }

                    point.x += point.dx;
                    point.y += point.dy;

                    if (point.x < 0 || point.x > canvas.width) point.dx *= -1;
                    if (point.y < 0 || point.y > canvas.height) point.dy *= -1;
                });

                ctx.closePath();
                ctx.stroke();
            });

            requestAnimationFrame(animate);
        }
        animate();
    },

    /**
     * Show full-screen preview
     */
    showFullScreenSaverPreview: function(screenSaverValue) {
        const overlay = document.createElement('div');
        overlay.className = 'screensaver-fullscreen';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #000;
            z-index: 10000;
            cursor: none;
        `;

        if (screenSaverValue !== 'none' && screenSaverValue !== 'blank') {
            this.updateScreenSaverPreview(overlay, screenSaverValue);
        }

        document.body.appendChild(overlay);

        // Close on any mouse movement or click
        const close = () => {
            document.body.removeChild(overlay);
        };
        overlay.addEventListener('click', close);
        overlay.addEventListener('mousemove', close);
        overlay.addEventListener('keydown', close);
    },

    /**
     * Update appearance preview window
     */
    updateAppearancePreview: function(windowEl) {
        const previewWindow = windowEl.querySelector('.preview-window');
        // Apply color scheme styles to preview
        // This would update colors based on selected scheme
    },

    /**
     * Apply all settings to the actual desktop
     */
    applySettings: function() {
        // Apply wallpaper
        if (State.desktopWallpaper !== this.settings.wallpaper) {
            State.desktopWallpaper = this.settings.wallpaper;
            this.applyWallpaperToDesktop(this.settings.wallpaper);
        }

        // Apply other settings
        // Screen saver settings would be stored for later use
        // Color scheme changes would update CSS variables
        // Effects would update global flags

        console.log('Display settings applied:', this.settings);
    },

    /**
     * Apply wallpaper to actual desktop
     */
    applyWallpaperToDesktop: function(wallpaperValue) {
        const desktop = document.querySelector('.desktop');
        if (!desktop) return;

        // Remove existing wallpaper classes
        desktop.classList.forEach(cls => {
            if (cls.startsWith('wallpaper-')) {
                desktop.classList.remove(cls);
            }
        });

        if (wallpaperValue === 'none') {
            desktop.style.background = '#008080'; // Teal
        } else {
            desktop.classList.add('wallpaper-' + wallpaperValue);
        }
    }
};

// Register with WinOS
if (typeof window.WinOS !== 'undefined') {
    window.WinOS.components = window.WinOS.components || {};
    window.WinOS.components.displayProperties = DisplayProperties;
}

// Expose globally
window.DisplayProperties = DisplayProperties;
