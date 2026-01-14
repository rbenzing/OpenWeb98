// js/components/taskbar.js

/**
 * Taskbar Module
 * Manages interactions with the taskbar, including the Start button, system tray, and task buttons.
 */
const Taskbar = {
    // Initialize the taskbar module.
    init: function() {
        this.cacheElements();
        this.attachEventListeners();
        this.initClock();
        this.setupSystemTray();
    },

    // Cache frequently used DOM elements.
    cacheElements: function() {
        this.startButton = document.getElementById('start-button');
        this.startMenu = document.getElementById('start-menu');
        this.taskButtonsContainer = document.getElementById('task-buttons');
        this.systemTray = document.querySelector('.system-tray');
        this.systemTrayTime = document.getElementById('system-tray-time');
    },

    // Attach event listeners for taskbar interactions.
    attachEventListeners: function() {
        // Toggle the Start menu when the Start button is clicked.
        this.startButton.addEventListener('click', (e) => {
            e.stopPropagation();
            if (this.startMenu.style.display === 'block') {
                this.startMenu.style.display = 'none';
                // Remove click outside handler when closing
                if (WinOS && WinOS.components.menus) {
                    WinOS.components.menus.removeClickOutsideHandler();
                }
            } else {
                this.startMenu.style.display = 'block';
                // Setup click outside handler when opening
                if (WinOS && WinOS.components.menus) {
                    WinOS.components.menus.setupClickOutsideHandler();
                }
            }
        });
    },

    // Initialize and update the system clock.
    initClock: function() {
        this.updateClock();
        setInterval(() => {
            this.updateClock();
        }, Config.CLOCK_UPDATE_INTERVAL);
    },

    // Update the clock displayed in the system tray.
    updateClock: function() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // Adjust hour '0' to '12'
        const minutesStr = minutes < 10 ? '0' + minutes : minutes;
        this.systemTrayTime.textContent = `${hours}:${minutesStr} ${ampm}`;
    },

    // Setup system tray icons (e.g., volume and network) and re-add the time element.
    setupSystemTray: function() {
        // Clear existing elements in the system tray.
        while (this.systemTray.firstChild) {
            this.systemTray.removeChild(this.systemTray.firstChild);
        }

        // Create and append the volume icon.
        const volumeIcon = document.createElement('img');
        volumeIcon.className = 'system-tray-icon';
        volumeIcon.src = 'icons/loudspeaker_rays-0.png';
        volumeIcon.alt = 'Volume';
        volumeIcon.title = 'Volume';
        this.systemTray.appendChild(volumeIcon);

        // Create and append the network icon.
        const networkIcon = document.createElement('img');
        networkIcon.className = 'system-tray-icon';
        networkIcon.src = 'icons/network-0.png';
        networkIcon.alt = 'Network';
        networkIcon.title = 'Network';
        this.systemTray.appendChild(networkIcon);

        // Create and append the modem/dialup icon.
        const modemIcon = document.createElement('img');
        modemIcon.className = 'system-tray-icon';
        modemIcon.src = 'icons/modem-0.png';
        modemIcon.alt = 'Modem';
        modemIcon.title = 'Dial-up Connection';
        this.systemTray.appendChild(modemIcon);

        // Create and append the power/battery icon.
        const powerIcon = document.createElement('img');
        powerIcon.className = 'system-tray-icon';
        powerIcon.src = 'icons/ac_plug-0.png';
        powerIcon.alt = 'Power';
        powerIcon.title = 'Power Management';
        this.systemTray.appendChild(powerIcon);

        // Append the time element as the last item.
        this.systemTray.appendChild(this.systemTrayTime);
    },

    // Add a task button for an open window.
    // This function can be called from the windows module when a new window is created.
    addTaskButton: function(windowData) {
        const taskButton = document.createElement('div');
        taskButton.className = 'task-button';
        taskButton.innerHTML = `
            <img src="icons/windows-0.png" alt="" style="width: 16px; height: 16px;">
            <span>${windowData.title}</span>
        `;
        this.taskButtonsContainer.appendChild(taskButton);
        windowData.taskButton = taskButton;

        // Task button event: Restore, minimize, or activate the window.
        taskButton.addEventListener('click', () => {
            if (windowData.minimized) {
                WinOS.components.windows.restoreWindow(windowData);
            } else if (State.activeWindow === windowData) {
                WinOS.components.windows.minimizeWindow(windowData);
            } else {
                WinOS.components.windows.activateWindow(windowData);
            }
        });
    }
};

// Attach the Taskbar module to the global WinOS components.
if (!window.WinOS) window.WinOS = {};
if (!window.WinOS.components) window.WinOS.components = {};
window.WinOS.components.taskbar = Taskbar;
