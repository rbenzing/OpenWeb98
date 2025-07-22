// js/config.js

// Configuration constants for the Win98 Desktop Environment
const Config = {
    DESKTOP_PADDING: 10,               // Padding around the desktop area
    ICON_WIDTH: 75,                    // Width of each desktop icon
    ICON_HEIGHT: 90,                   // Height of each desktop icon (including label)
    MIN_WINDOW_WIDTH: 200,             // Minimum width for a window
    MIN_WINDOW_HEIGHT: 150,            // Minimum height for a window
    DEFAULT_WINDOW_Z_INDEX: 100,       // Base z-index for windows
    CLOCK_UPDATE_INTERVAL: 60000       // Update interval for the system clock in milliseconds (60 seconds)
};

// Make the configuration globally available to other modules
window.Config = Config;
