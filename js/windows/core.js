// js/windows/core.js

/**
 * Core Window Management
 * Handles creation, activation, minimization, maximization, restoration, and closing of windows
 */
const WindowCore = {
    // Create a new window with given parameters
    createWindow: function(title, content, width, height, x, y, showMenuBar = true, icon = 'icons/windows-0.png') {
        const windowEl = document.createElement('div');
        windowEl.className = 'window';
        windowEl.style.width = `${width}px`;
        windowEl.style.height = `${height}px`;
        windowEl.style.left = x !== undefined ? `${x}px` : `${Math.max(0, Math.random() * (window.innerWidth - width))}px`;
        windowEl.style.top = y !== undefined ? `${y}px` : `${Math.max(0, Math.random() * (window.innerHeight - height - 40))}px`;
        windowEl.style.zIndex = State.zIndexCounter++;

        // Create the window header (titlebar) and controls
        let windowHTML = `
            <div class="window-titlebar active">
                <img src="${icon}" alt="Icon" style="width: 16px; height: 16px;">
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

        // Optionally add a menu bar
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

        // Add resize handles
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

        // Create window data for state management
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

        // Save the window in global state
        State.openWindows.push(windowData);

        // Add a taskbar button for the window
        if (WinOS && WinOS.components.taskbar) {
            WinOS.components.taskbar.addTaskButton(windowData);
        }

        // Activate window on mouse down
        windowEl.addEventListener('mousedown', () => {
            this.activateWindow(windowData);
        });

        // Attach control button event handlers
        windowEl.querySelector('.window-close').addEventListener('click', () => {
            this.closeWindow(windowData);
        });
        windowEl.querySelector('.window-minimize').addEventListener('click', () => {
            this.minimizeWindow(windowData);
        });
        windowEl.querySelector('.window-maximize').addEventListener('click', () => {
            if (windowData.maximized) {
                this.restoreWindowSize(windowData);
            } else {
                this.maximizeWindow(windowData);
            }
        });

        // Enable dragging and resizing
        const titlebar = windowEl.querySelector('.window-titlebar');
        if (typeof makeDraggable === 'function' && titlebar) {
            makeDraggable(windowEl, titlebar);
        }
        if (typeof makeResizable === 'function') {
            makeResizable(windowEl);
        }

        // Make this newly created window active
        this.activateWindow(windowData);
        return windowData;
    },

    // Activate a window: bring it to the front and set it as active
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
            this.restoreWindow(windowData);
        }
    },

    // Minimize a window
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

    // Restore a minimized window
    restoreWindow: function(windowData) {
        windowData.element.style.display = 'block';
        windowData.minimized = false;
        this.activateWindow(windowData);
    },

    // Maximize a window
    maximizeWindow: function(windowData) {
        // Save current dimensions for later restoration
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
        if (maximizeButton) {
            maximizeButton.src = 'icons/restore.svg';
        }
    },

    // Restore a maximized window to its previous dimensions
    restoreWindowSize: function(windowData) {
        windowData.element.style.width = `${windowData.prevDimensions.width}px`;
        windowData.element.style.height = `${windowData.prevDimensions.height}px`;
        windowData.element.style.left = `${windowData.prevDimensions.x}px`;
        windowData.element.style.top = `${windowData.prevDimensions.y}px`;
        windowData.maximized = false;
        const maximizeButton = windowData.element.querySelector('.window-maximize img');
        if (maximizeButton) {
            maximizeButton.src = 'icons/maximize.svg';
        }
    },

    // Close a window and remove its related elements
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

    // Setup menu bar interactions
    setupMenuBar: function(menuBar) {
        const menuItems = menuBar.querySelectorAll('.window-menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', function() {
                const menuName = this.textContent;
                console.log(`Menu clicked: ${menuName}`);
                // Menu handlers will be implemented as needed
            });
        });
    }
};

// Expose globally
window.WindowCore = WindowCore;
