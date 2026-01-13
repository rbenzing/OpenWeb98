// js/windows/apps.js

/**
 * Built-in Windows 98 Applications
 */
const WindowsApps = {
    // Notepad application
    openNotepad: function(fileName = 'Untitled', filePath = null) {
        const content = `
            <div style="display: flex; flex-direction: column; height: 100%; background: white;">
                <textarea id="notepad-content" style="flex: 1; border: none; padding: 5px; font-family: 'Courier New', monospace; font-size: 12px; resize: none;" placeholder="Type here..."></textarea>
            </div>
        `;

        const windowData = WindowCore.createWindow(`${fileName} - Notepad`, content, 500, 400, undefined, undefined, true, 'icons/notepad-0.png');

        // Add custom menu bar
        const menuBar = windowData.element.querySelector('.window-menubar');
        menuBar.innerHTML = `
            <div class="window-menu-item" data-menu="file">File</div>
            <div class="window-menu-item" data-menu="edit">Edit</div>
            <div class="window-menu-item" data-menu="format">Format</div>
            <div class="window-menu-item" data-menu="help">Help</div>
        `;

        // Store file info
        windowData.filePath = filePath;
        windowData.fileName = fileName;

        // Setup menu handlers
        setTimeout(() => {
            const fileMenu = menuBar.querySelector('[data-menu="file"]');
            fileMenu.addEventListener('click', () => {
                this.showNotepadFileMenu(windowData);
            });
        }, 0);

        return windowData;
    },

    showNotepadFileMenu: function(windowData) {
        alert('File menu - Save/Open will integrate with file system!');
    },

    // Calculator application
    openCalculator: function() {
        const content = `
            <div style="display: flex; flex-direction: column; background: #c0c0c0; padding: 5px; height: 100%;">
                <div id="calc-display" style="background: white; border: 2px inset; padding: 5px; text-align: right; font-size: 20px; margin-bottom: 5px; height: 30px;">0</div>
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 3px;">
                    <button class="calc-btn" data-value="7">7</button>
                    <button class="calc-btn" data-value="8">8</button>
                    <button class="calc-btn" data-value="9">9</button>
                    <button class="calc-btn" data-op="/">/</button>
                    <button class="calc-btn" data-value="4">4</button>
                    <button class="calc-btn" data-value="5">5</button>
                    <button class="calc-btn" data-value="6">6</button>
                    <button class="calc-btn" data-op="*">*</button>
                    <button class="calc-btn" data-value="1">1</button>
                    <button class="calc-btn" data-value="2">2</button>
                    <button class="calc-btn" data-value="3">3</button>
                    <button class="calc-btn" data-op="-">-</button>
                    <button class="calc-btn" data-value="0">0</button>
                    <button class="calc-btn" data-value=".">.</button>
                    <button class="calc-btn" data-action="equals">=</button>
                    <button class="calc-btn" data-op="+">+</button>
                    <button class="calc-btn" data-action="clear" style="grid-column: span 2;">C</button>
                    <button class="calc-btn" data-action="backspace" style="grid-column: span 2;">←</button>
                </div>
            </div>
        `;

        const windowData = WindowCore.createWindow('Calculator', content, 250, 320, undefined, undefined, false, 'icons/calculator-0.png');

        // Calculator logic
        setTimeout(() => {
            let currentValue = '0';
            let previousValue = '';
            let operator = null;

            const display = windowData.element.querySelector('#calc-display');
            const buttons = windowData.element.querySelectorAll('.calc-btn');

            buttons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const value = btn.getAttribute('data-value');
                    const op = btn.getAttribute('data-op');
                    const action = btn.getAttribute('data-action');

                    if (value !== null) {
                        if (currentValue === '0') {
                            currentValue = value;
                        } else {
                            currentValue += value;
                        }
                        display.textContent = currentValue;
                    } else if (op !== null) {
                        previousValue = currentValue;
                        currentValue = '0';
                        operator = op;
                    } else if (action === 'equals') {
                        if (operator && previousValue) {
                            const a = parseFloat(previousValue);
                            const b = parseFloat(currentValue);
                            let result = 0;
                            switch(operator) {
                                case '+': result = a + b; break;
                                case '-': result = a - b; break;
                                case '*': result = a * b; break;
                                case '/': result = a / b; break;
                            }
                            currentValue = result.toString();
                            display.textContent = currentValue;
                            previousValue = '';
                            operator = null;
                        }
                    } else if (action === 'clear') {
                        currentValue = '0';
                        previousValue = '';
                        operator = null;
                        display.textContent = currentValue;
                    } else if (action === 'backspace') {
                        currentValue = currentValue.slice(0, -1) || '0';
                        display.textContent = currentValue;
                    }
                });
            });
        }, 0);

        return windowData;
    },

    // Minesweeper application
    openMinesweeper: function() {
        const content = `
            <div style="display: flex; flex-direction: column; background: #c0c0c0; padding: 5px; height: 100%; align-items: center;">
                <div style="background: #c0c0c0; border: 2px outset; padding: 5px; margin-bottom: 10px; display: flex; justify-content: space-between; width: 200px;">
                    <div id="mine-counter" style="background: black; color: red; font-family: monospace; font-size: 20px; padding: 2px 5px;">010</div>
                    <button id="reset-game" style="font-size: 20px; width: 30px; height: 30px;">🙂</button>
                    <div id="timer" style="background: black; color: red; font-family: monospace; font-size: 20px; padding: 2px 5px;">000</div>
                </div>
                <div id="mine-grid" style="display: grid; grid-template-columns: repeat(8, 25px); gap: 0; border: 3px inset;"></div>
                <div style="margin-top: 10px; font-size: 11px;">Left-click: Reveal | Right-click: Flag</div>
            </div>
        `;

        const windowData = WindowCore.createWindow('Minesweeper', content, 260, 350, undefined, undefined, false, 'icons/mine-0.png');

        // Initialize Minesweeper game
        setTimeout(() => {
            this.initMinesweeper(windowData.element);
        }, 0);

        return windowData;
    },

    initMinesweeper: function(windowEl) {
        const grid = windowEl.querySelector('#mine-grid');
        const mineCounter = windowEl.querySelector('#mine-counter');
        const timer = windowEl.querySelector('#timer');
        const resetBtn = windowEl.querySelector('#reset-game');

        const gridSize = 8;
        const mineCount = 10;
        let cells = [];
        let revealed = 0;
        let flagged = 0;
        let gameOver = false;
        let time = 0;
        let timerInterval = null;

        function createGrid() {
            grid.innerHTML = '';
            cells = [];
            revealed = 0;
            flagged = 0;
            gameOver = false;
            time = 0;
            clearInterval(timerInterval);
            timer.textContent = '000';
            mineCounter.textContent = String(mineCount - flagged).padStart(3, '0');
            resetBtn.textContent = '🙂';

            // Create cells
            for (let i = 0; i < gridSize * gridSize; i++) {
                const cell = document.createElement('div');
                cell.style.cssText = 'width: 25px; height: 25px; background: #c0c0c0; border: 2px outset; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; cursor: pointer;';
                cell.dataset.index = i;
                cells.push({ element: cell, mine: false, revealed: false, flagged: false, adjacent: 0 });
                grid.appendChild(cell);

                cell.addEventListener('click', () => revealCell(i));
                cell.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    toggleFlag(i);
                });
            }

            // Place mines
            let minesPlaced = 0;
            while (minesPlaced < mineCount) {
                const idx = Math.floor(Math.random() * cells.length);
                if (!cells[idx].mine) {
                    cells[idx].mine = true;
                    minesPlaced++;
                }
            }

            // Calculate adjacent mines
            for (let i = 0; i < cells.length; i++) {
                if (!cells[i].mine) {
                    cells[i].adjacent = countAdjacentMines(i);
                }
            }
        }

        function countAdjacentMines(idx) {
            const row = Math.floor(idx / gridSize);
            const col = idx % gridSize;
            let count = 0;

            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    if (dr === 0 && dc === 0) continue;
                    const newRow = row + dr;
                    const newCol = col + dc;
                    if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize) {
                        const newIdx = newRow * gridSize + newCol;
                        if (cells[newIdx].mine) count++;
                    }
                }
            }
            return count;
        }

        function revealCell(idx) {
            if (gameOver || cells[idx].revealed || cells[idx].flagged) return;

            if (timerInterval === null) {
                timerInterval = setInterval(() => {
                    time++;
                    timer.textContent = String(Math.min(time, 999)).padStart(3, '0');
                }, 1000);
            }

            cells[idx].revealed = true;
            cells[idx].element.style.border = '1px solid #808080';
            cells[idx].element.style.background = '#c0c0c0';
            revealed++;

            if (cells[idx].mine) {
                cells[idx].element.textContent = '💣';
                resetBtn.textContent = '😵';
                gameOver = true;
                clearInterval(timerInterval);
                revealAllMines();
                setTimeout(() => alert('Game Over!'), 100);
            } else {
                if (cells[idx].adjacent > 0) {
                    cells[idx].element.textContent = cells[idx].adjacent;
                    const colors = ['', 'blue', 'green', 'red', 'darkblue', 'darkred', 'cyan', 'black', 'gray'];
                    cells[idx].element.style.color = colors[cells[idx].adjacent];
                } else {
                    revealAdjacent(idx);
                }

                if (revealed === cells.length - mineCount) {
                    resetBtn.textContent = '😎';
                    gameOver = true;
                    clearInterval(timerInterval);
                    setTimeout(() => alert('You Win!'), 100);
                }
            }
        }

        function revealAdjacent(idx) {
            const row = Math.floor(idx / gridSize);
            const col = idx % gridSize;

            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    if (dr === 0 && dc === 0) continue;
                    const newRow = row + dr;
                    const newCol = col + dc;
                    if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize) {
                        const newIdx = newRow * gridSize + newCol;
                        if (!cells[newIdx].revealed && !cells[newIdx].mine) {
                            revealCell(newIdx);
                        }
                    }
                }
            }
        }

        function toggleFlag(idx) {
            if (gameOver || cells[idx].revealed) return;

            cells[idx].flagged = !cells[idx].flagged;
            cells[idx].element.textContent = cells[idx].flagged ? '🚩' : '';
            flagged += cells[idx].flagged ? 1 : -1;
            mineCounter.textContent = String(mineCount - flagged).padStart(3, '0');
        }

        function revealAllMines() {
            cells.forEach(cell => {
                if (cell.mine && !cell.revealed) {
                    cell.element.textContent = '💣';
                }
            });
        }

        resetBtn.addEventListener('click', createGrid);
        createGrid();
    },

    // Solitaire (simplified)
    openSolitaire: function() {
        const content = `
            <div style="display: flex; flex-direction: column; background: #008000; padding: 10px; height: 100%; align-items: center; justify-content: center;">
                <h2 style="color: white;">Solitaire</h2>
                <p style="color: white;">Full implementation coming soon!</p>
                <button onclick="alert('Deal new game')" style="padding: 10px 20px;">New Game</button>
            </div>
        `;

        return WindowCore.createWindow('Solitaire', content, 600, 450, undefined, undefined, true, 'icons/cards-0.png');
    },

    // Paint (simplified)
    openPaint: function() {
        const content = `
            <div style="display: flex; flex-direction: column; background: white; height: 100%;">
                <div style="background: #c0c0c0; border-bottom: 1px solid #808080; padding: 5px; display: flex; gap: 5px;">
                    <button title="Pencil">✏️</button>
                    <button title="Brush">🖌️</button>
                    <button title="Fill">🪣</button>
                    <button title="Eraser">🧹</button>
                    <button title="Line">📏</button>
                    <button title="Rectangle">⬜</button>
                    <button title="Ellipse">⭕</button>
                </div>
                <canvas id="paint-canvas" style="flex: 1; border: 1px solid #000; cursor: crosshair;"></canvas>
            </div>
        `;

        const windowData = WindowCore.createWindow('untitled - Paint', content, 600, 450, undefined, undefined, true, 'icons/paint_file-0.png');

        setTimeout(() => {
            const canvas = windowData.element.querySelector('#paint-canvas');
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            const ctx = canvas.getContext('2d');

            let drawing = false;
            canvas.addEventListener('mousedown', () => drawing = true);
            canvas.addEventListener('mouseup', () => drawing = false);
            canvas.addEventListener('mousemove', (e) => {
                if (!drawing) return;
                const rect = canvas.getBoundingClientRect();
                ctx.fillStyle = '#000';
                ctx.fillRect(e.clientX - rect.left, e.clientY - rect.top, 2, 2);
            });
        }, 0);

        return windowData;
    }
};

// Expose globally
window.WindowsApps = WindowsApps;
