// js/state.js

// Application state for the Win98 Desktop Environment
const State = {
    openWindows: [],                      // Array to hold the currently open windows
    activeWindow: null,                   // Reference to the currently active window
    zIndexCounter: Config.DEFAULT_WINDOW_Z_INDEX, // Z-index counter for window stacking
    selectedIcon: null,                   // Currently selected desktop icon, if any
    recycleBinFiles: [],                  // List of files currently in the recycle bin
    dragState: null,                      // State for dragging windows
    resizeState: null,                    // State for resizing windows
    contextMenuOpen: false                // Flag indicating whether a context menu is open
};

// Make the state globally accessible to other modules
window.State = State;
