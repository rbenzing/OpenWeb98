// js/utils/fileSystem.js

/**
 * Mock File System Utility
 * Manages a virtual file system in memory with drives, folders, and files
 */
const FileSystemUtil = {
    /**
     * Initialize the file system with data
     * @param {Object} data - Initial file system structure
     */
    init: function(data) {
        this.drives = data.drives || {};
        this.currentPath = data.currentPath || 'C:\\';
        this.clipboard = null;
        this.clipboardOperation = null; // 'copy' or 'cut'
        this.history = [];
        this.historyIndex = -1;
        this.maxHistory = 50;
    },

    /**
     * Parse a path string into drive and path components
     * @param {string} path - Path like "C:\Windows\System"
     * @returns {Object} - {drive: 'C:', pathParts: ['Windows', 'System']}
     */
    parsePath: function(path) {
        if (!path || typeof path !== 'string') {
            return { drive: 'C:', pathParts: [] };
        }

        // Normalize path separators to backslash
        path = path.replace(/\//g, '\\');

        // Extract drive letter
        const driveMatch = path.match(/^([A-Z]:)/i);
        const drive = driveMatch ? driveMatch[1].toUpperCase() : 'C:';

        // Get path after drive
        let remainingPath = path.substring(drive.length);

        // Remove leading/trailing slashes
        remainingPath = remainingPath.replace(/^\\+|\\+$/g, '');

        // Split into parts
        const pathParts = remainingPath ? remainingPath.split('\\').filter(p => p.length > 0) : [];

        return { drive, pathParts };
    },

    /**
     * Get an item (folder or file) at a specific path
     * @param {string} path - Path to the item
     * @returns {Object|null} - The item object or null if not found
     */
    getItem: function(path) {
        const { drive, pathParts } = this.parsePath(path);

        if (!this.drives[drive]) {
            return null;
        }

        let current = this.drives[drive];

        // Traverse the path
        for (let i = 0; i < pathParts.length; i++) {
            if (!current.children || !current.children[pathParts[i]]) {
                return null;
            }
            current = current.children[pathParts[i]];
        }

        return current;
    },

    /**
     * Get the contents of a folder at a specific path
     * @param {string} path - Path to the folder
     * @returns {Array} - Array of {name, type, ...metadata} objects
     */
    getContents: function(path) {
        const item = this.getItem(path);

        if (!item) {
            return [];
        }

        // If it's a drive or folder, return its children
        if ((item.type === 'drive' || item.type === 'folder') && item.children) {
            return Object.keys(item.children).map(name => {
                const child = item.children[name];
                return {
                    name: name,
                    type: child.type,
                    size: child.size || 0,
                    modified: child.modified || new Date(),
                    icon: child.icon || null
                };
            });
        }

        // If it's a floppy/cdrom that's empty
        if (item.empty) {
            return [];
        }

        return [];
    },

    /**
     * Navigate to a path and update history
     * @param {string} path - Path to navigate to
     * @param {boolean} addToHistory - Whether to add to history (default: true)
     * @returns {boolean} - Success
     */
    navigate: function(path, addToHistory = true) {
        const item = this.getItem(path);

        if (!item) {
            return false;
        }

        // Can only navigate to drives and folders
        if (item.type !== 'drive' && item.type !== 'folder' && item.type !== 'floppy' && item.type !== 'cdrom') {
            return false;
        }

        // Add to history
        if (addToHistory) {
            // Remove any forward history
            this.history = this.history.slice(0, this.historyIndex + 1);

            // Add new path
            this.history.push(path);

            // Limit history size
            if (this.history.length > this.maxHistory) {
                this.history.shift();
            } else {
                this.historyIndex++;
            }
        }

        this.currentPath = path;
        return true;
    },

    /**
     * Go back in history
     * @returns {string|null} - New path or null if can't go back
     */
    goBack: function() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            const path = this.history[this.historyIndex];
            this.currentPath = path;
            return path;
        }
        return null;
    },

    /**
     * Go forward in history
     * @returns {string|null} - New path or null if can't go forward
     */
    goForward: function() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            const path = this.history[this.historyIndex];
            this.currentPath = path;
            return path;
        }
        return null;
    },

    /**
     * Go up one directory level
     * @returns {string|null} - New path or null if at root
     */
    goUp: function() {
        const { drive, pathParts } = this.parsePath(this.currentPath);

        if (pathParts.length === 0) {
            // Already at drive root, can't go up
            return null;
        }

        // Remove last path component
        pathParts.pop();
        const newPath = drive + '\\' + pathParts.join('\\');

        if (this.navigate(newPath)) {
            return newPath;
        }

        return null;
    },

    /**
     * Create a new folder
     * @param {string} parentPath - Path to parent folder
     * @param {string} folderName - Name of new folder
     * @returns {boolean} - Success
     */
    createFolder: function(parentPath, folderName) {
        const parent = this.getItem(parentPath);

        if (!parent || (parent.type !== 'drive' && parent.type !== 'folder')) {
            return false;
        }

        if (!parent.children) {
            parent.children = {};
        }

        // Check if already exists
        if (parent.children[folderName]) {
            return false;
        }

        // Create new folder
        parent.children[folderName] = {
            type: 'folder',
            children: {},
            modified: new Date()
        };

        return true;
    },

    /**
     * Create a new file
     * @param {string} parentPath - Path to parent folder
     * @param {string} fileName - Name of new file
     * @param {string} content - File content
     * @returns {boolean} - Success
     */
    createFile: function(parentPath, fileName, content = '') {
        const parent = this.getItem(parentPath);

        if (!parent || (parent.type !== 'drive' && parent.type !== 'folder')) {
            return false;
        }

        if (!parent.children) {
            parent.children = {};
        }

        // Create or overwrite file
        parent.children[fileName] = {
            type: 'file',
            content: content,
            size: content.length,
            modified: new Date()
        };

        return true;
    },

    /**
     * Delete an item (file or folder)
     * @param {string} path - Path to the item
     * @returns {Object|null} - Deleted item or null if failed
     */
    deleteItem: function(path) {
        const { drive, pathParts } = this.parsePath(path);

        if (pathParts.length === 0) {
            // Can't delete drive
            return null;
        }

        // Get parent path
        const parentPathParts = pathParts.slice(0, -1);
        const parentPath = drive + '\\' + parentPathParts.join('\\');
        const itemName = pathParts[pathParts.length - 1];

        const parent = this.getItem(parentPath);

        if (!parent || !parent.children || !parent.children[itemName]) {
            return null;
        }

        // Get item and delete it
        const item = parent.children[itemName];
        delete parent.children[itemName];

        return { name: itemName, ...item };
    },

    /**
     * Rename an item
     * @param {string} path - Path to the item
     * @param {string} newName - New name
     * @returns {boolean} - Success
     */
    renameItem: function(path, newName) {
        const { drive, pathParts } = this.parsePath(path);

        if (pathParts.length === 0) {
            // Can't rename drive
            return false;
        }

        // Get parent path
        const parentPathParts = pathParts.slice(0, -1);
        const parentPath = drive + '\\' + parentPathParts.join('\\');
        const oldName = pathParts[pathParts.length - 1];

        const parent = this.getItem(parentPath);

        if (!parent || !parent.children || !parent.children[oldName]) {
            return false;
        }

        // Check if new name already exists
        if (parent.children[newName]) {
            return false;
        }

        // Rename by moving to new key
        parent.children[newName] = parent.children[oldName];
        delete parent.children[oldName];

        return true;
    },

    /**
     * Copy an item to clipboard
     * @param {string} path - Path to the item
     * @returns {boolean} - Success
     */
    copyToClipboard: function(path) {
        const item = this.getItem(path);
        const { pathParts } = this.parsePath(path);

        if (!item || pathParts.length === 0) {
            return false;
        }

        const itemName = pathParts[pathParts.length - 1];

        // Deep clone the item
        this.clipboard = {
            name: itemName,
            item: JSON.parse(JSON.stringify(item)),
            sourcePath: path
        };
        this.clipboardOperation = 'copy';

        return true;
    },

    /**
     * Cut an item to clipboard
     * @param {string} path - Path to the item
     * @returns {boolean} - Success
     */
    cutToClipboard: function(path) {
        const item = this.getItem(path);
        const { pathParts } = this.parsePath(path);

        if (!item || pathParts.length === 0) {
            return false;
        }

        const itemName = pathParts[pathParts.length - 1];

        // Deep clone the item
        this.clipboard = {
            name: itemName,
            item: JSON.parse(JSON.stringify(item)),
            sourcePath: path
        };
        this.clipboardOperation = 'cut';

        return true;
    },

    /**
     * Paste item from clipboard
     * @param {string} destPath - Destination folder path
     * @returns {boolean} - Success
     */
    pasteFromClipboard: function(destPath) {
        if (!this.clipboard) {
            return false;
        }

        const dest = this.getItem(destPath);

        if (!dest || (dest.type !== 'drive' && dest.type !== 'folder')) {
            return false;
        }

        if (!dest.children) {
            dest.children = {};
        }

        // Generate unique name if already exists
        let newName = this.clipboard.name;
        let counter = 1;
        while (dest.children[newName]) {
            const ext = newName.includes('.') ? '.' + newName.split('.').pop() : '';
            const baseName = ext ? newName.substring(0, newName.lastIndexOf('.')) : newName;
            newName = `${baseName} (${counter})${ext}`;
            counter++;
        }

        // Paste the item
        dest.children[newName] = JSON.parse(JSON.stringify(this.clipboard.item));
        dest.children[newName].modified = new Date();

        // If it was cut, delete from source
        if (this.clipboardOperation === 'cut') {
            this.deleteItem(this.clipboard.sourcePath);
            this.clipboard = null;
            this.clipboardOperation = null;
        }

        return true;
    },

    /**
     * Search for files/folders matching a pattern
     * @param {string} searchPath - Path to search in
     * @param {string} pattern - Search pattern (supports * wildcard)
     * @param {boolean} recursive - Search recursively
     * @returns {Array} - Array of matching paths
     */
    search: function(searchPath, pattern, recursive = true) {
        const results = [];
        const patternRegex = new RegExp('^' + pattern.replace(/\*/g, '.*').replace(/\?/g, '.') + '$', 'i');

        const searchRecursive = (path) => {
            const contents = this.getContents(path);

            contents.forEach(item => {
                const itemPath = path + '\\' + item.name;

                // Check if name matches pattern
                if (patternRegex.test(item.name)) {
                    results.push(itemPath);
                }

                // Recurse into folders
                if (recursive && item.type === 'folder') {
                    searchRecursive(itemPath);
                }
            });
        };

        searchRecursive(searchPath);
        return results;
    },

    /**
     * Get file content
     * @param {string} path - Path to the file
     * @returns {string|null} - File content or null
     */
    getFileContent: function(path) {
        const item = this.getItem(path);

        if (!item || item.type !== 'file') {
            return null;
        }

        return item.content || '';
    },

    /**
     * Set file content
     * @param {string} path - Path to the file
     * @param {string} content - New content
     * @returns {boolean} - Success
     */
    setFileContent: function(path, content) {
        const item = this.getItem(path);

        if (!item || item.type !== 'file') {
            return false;
        }

        item.content = content;
        item.size = content.length;
        item.modified = new Date();

        return true;
    }
};

// Expose globally
window.FileSystemUtil = FileSystemUtil;
