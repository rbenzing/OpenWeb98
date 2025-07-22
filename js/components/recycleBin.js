// js/components/recycleBin.js

/**
 * Recycle Bin Module
 * Manages operations related to the recycle bin, such as adding files to the bin and emptying it.
 */
const RecycleBin = {
    // Empties the recycle bin, updating the state and corresponding UI elements.
    emptyRecycleBin: function() {
        // Clear all files from the recycle bin state.
        State.recycleBinFiles.length = 0;

        // Update the Recycle Bin desktop icon to indicate an empty bin.
        const binIcon = document.querySelector('.desktop-icon img[alt="Recycle Bin"]');
        if (binIcon) {
            binIcon.src = 'icons/recycle_bin_empty-0.png';
        }

        // If the Recycle Bin window is open, update its content.
        const binWindow = State.openWindows.find(w => w.title === 'Recycle Bin');
        if (binWindow) {
            const content = binWindow.element.querySelector('#recycle-bin-content');
            const statusBar = binWindow.element.querySelector('.explorer-status-bar');

            if (content) {
                content.innerHTML = `
                    <div style="display: flex; justify-content: center; align-items: center; height: 100%; width: 100%;">
                        <p>The Recycle Bin is empty</p>
                    </div>
                `;
            }

            // Update status bar
            if (statusBar) {
                statusBar.innerHTML = `<span>0 object(s)</span>`;
            }
        }
    },

    // Adds a file to the recycle bin and updates UI elements accordingly.
    addToRecycleBin: function(file) {
        // Add the file to the recycle bin state.
        State.recycleBinFiles.push(file);

        // Update the Recycle Bin desktop icon to indicate it's full.
        const binIcon = document.querySelector('.desktop-icon img[alt="Recycle Bin"]');
        if (binIcon) {
            binIcon.src = 'icons/recycle_bin_full-0.png';
        }

        // Update the Recycle Bin window content if it is open.
        const binWindow = State.openWindows.find(w => w.title === 'Recycle Bin');
        if (binWindow) {
            const content = binWindow.element.querySelector('#recycle-bin-content');
            const statusBar = binWindow.element.querySelector('.explorer-status-bar');

            if (content) {
                // If the bin was empty, clear the "empty" message.
                if (State.recycleBinFiles.length === 1) {
                    content.innerHTML = '';
                }

                // Create a file icon element for the recycled file.
                const fileElement = document.createElement('div');
                fileElement.className = 'file-icon';
                fileElement.setAttribute('data-filename', file.name);
                fileElement.innerHTML = `
                    <img src="${file.icon}" alt="${file.name}">
                    <span>${file.name}</span>
                `;

                // Add a click event to select the file in the Recycle Bin window.
                fileElement.addEventListener('click', (e) => {
                    e.stopPropagation();

                    if (!e.ctrlKey) {
                        content.querySelectorAll('.file-icon').forEach(icon => {
                            icon.classList.remove('selected');
                        });
                    }

                    fileElement.classList.toggle('selected');
                });

                content.appendChild(fileElement);

                // Update status bar
                if (statusBar) {
                    statusBar.innerHTML = `<span>${State.recycleBinFiles.length} object(s)</span>`;
                }
            }
        }
    }
};

// Attach the Recycle Bin module to the global WinOS components.
if (!window.WinOS) window.WinOS = {};
if (!window.WinOS.components) window.WinOS.components = {};
window.WinOS.components.recycleBin = RecycleBin;
