// js/config.js

// Configuration constants for the Win98 Desktop Environment
const Config = {
    DESKTOP_PADDING: 10,               // Padding around the desktop area
    ICON_WIDTH: 75,                    // Width of each desktop icon
    ICON_HEIGHT: 90,                   // Height of each desktop icon (including label)
    MIN_WINDOW_WIDTH: 200,             // Minimum width for a window
    MIN_WINDOW_HEIGHT: 150,            // Minimum height for a window
    DEFAULT_WINDOW_Z_INDEX: 100,       // Base z-index for windows
    CLOCK_UPDATE_INTERVAL: 60000,      // Update interval for the system clock in milliseconds (60 seconds)

    // File System Constants
    MAX_FILENAME_LENGTH: 255,          // Maximum length for file/folder names
    MAX_PATH_LENGTH: 260,              // Maximum path length (Windows limitation)
    RECENT_DOCUMENTS_MAX: 15,          // Maximum recent documents to track
    FILE_EXTENSIONS: {                 // File type to icon mapping
        '.txt': 'icons/file_text-0.png',
        '.doc': 'icons/wordpad-0.png',
        '.xls': 'icons/file_spreadsheet-0.png',
        '.ppt': 'icons/file_presentation-0.png',
        '.jpg': 'icons/file_image-0.png',
        '.png': 'icons/file_image-0.png',
        '.bmp': 'icons/file_image-0.png',
        '.gif': 'icons/file_image-0.png',
        '.exe': 'icons/application-0.png',
        '.dll': 'icons/file_dll-0.png',
        '.sys': 'icons/file_config-0.png',
        '.ini': 'icons/file_config-0.png',
        '.bat': 'icons/file_bat-0.png',
        '.com': 'icons/file_bat-0.png'
    },

    // Submenu Constants
    SUBMENU_OFFSET_X: 2,               // Horizontal offset for submenus
    SUBMENU_OFFSET_Y: -5,              // Vertical offset for submenus
    SUBMENU_HOVER_DELAY: 300           // Delay before showing submenu on hover (ms)
};

// Make the configuration globally available to other modules
window.Config = Config;
