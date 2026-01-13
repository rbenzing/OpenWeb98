// js/data/programsData.js

/**
 * Programs Menu Structure
 * Defines the Start Menu → Programs submenu hierarchy
 */
const ProgramsData = {
    items: [
        {
            name: 'Accessories',
            icon: 'icons/directory_program_group-0.png',
            type: 'folder',
            items: [
                {
                    name: 'Calculator',
                    icon: 'icons/calculator-0.png',
                    type: 'app',
                    action: 'openCalculator'
                },
                {
                    name: 'Imaging',
                    icon: 'icons/kodak_imaging-0.png',
                    type: 'app',
                    action: 'openImaging'
                },
                {
                    name: 'Notepad',
                    icon: 'icons/notepad-0.png',
                    type: 'app',
                    action: 'openNotepad'
                },
                {
                    name: 'Paint',
                    icon: 'icons/paint_file-0.png',
                    type: 'app',
                    action: 'openPaint'
                },
                {
                    name: 'WordPad',
                    icon: 'icons/wordpad-0.png',
                    type: 'app',
                    action: 'openWordPad'
                },
                {
                    type: 'separator'
                },
                {
                    name: 'Communications',
                    icon: 'icons/directory_program_group-0.png',
                    type: 'folder',
                    items: [
                        {
                            name: 'Dial-Up Networking',
                            icon: 'icons/dun-0.png',
                            type: 'app',
                            action: 'openDialUp'
                        },
                        {
                            name: 'HyperTerminal',
                            icon: 'icons/hyperterminal-0.png',
                            type: 'app',
                            action: 'openHyperTerminal'
                        }
                    ]
                },
                {
                    name: 'Entertainment',
                    icon: 'icons/directory_program_group-0.png',
                    type: 'folder',
                    items: [
                        {
                            name: 'CD Player',
                            icon: 'icons/cd_audio_cd-0.png',
                            type: 'app',
                            action: 'openCDPlayer'
                        },
                        {
                            name: 'Sound Recorder',
                            icon: 'icons/sound_recorder-0.png',
                            type: 'app',
                            action: 'openSoundRecorder'
                        },
                        {
                            name: 'Volume Control',
                            icon: 'icons/speaker-0.png',
                            type: 'app',
                            action: 'openVolumeControl'
                        },
                        {
                            name: 'Windows Media Player',
                            icon: 'icons/media_player-0.png',
                            type: 'app',
                            action: 'openMediaPlayer'
                        }
                    ]
                },
                {
                    name: 'Games',
                    icon: 'icons/game_controller-0.png',
                    type: 'folder',
                    items: [
                        {
                            name: 'FreeCell',
                            icon: 'icons/freecell-0.png',
                            type: 'app',
                            action: 'openFreeCell'
                        },
                        {
                            name: 'Hearts',
                            icon: 'icons/hearts-0.png',
                            type: 'app',
                            action: 'openHearts'
                        },
                        {
                            name: 'Minesweeper',
                            icon: 'icons/mine-0.png',
                            type: 'app',
                            action: 'openMinesweeper'
                        },
                        {
                            name: 'Solitaire',
                            icon: 'icons/cards-0.png',
                            type: 'app',
                            action: 'openSolitaire'
                        }
                    ]
                },
                {
                    name: 'System Tools',
                    icon: 'icons/directory_program_group-0.png',
                    type: 'folder',
                    items: [
                        {
                            name: 'Disk Defragmenter',
                            icon: 'icons/defrag-0.png',
                            type: 'app',
                            action: 'openDiskDefrag'
                        },
                        {
                            name: 'ScanDisk',
                            icon: 'icons/scandisk-0.png',
                            type: 'app',
                            action: 'openScanDisk'
                        },
                        {
                            name: 'System Information',
                            icon: 'icons/info_bubble-0.png',
                            type: 'app',
                            action: 'openSystemInfo'
                        },
                        {
                            name: 'Scheduled Tasks',
                            icon: 'icons/scheduled_tasks-0.png',
                            type: 'app',
                            action: 'openScheduledTasks'
                        },
                        {
                            name: 'System Monitor',
                            icon: 'icons/monitor_window-0.png',
                            type: 'app',
                            action: 'openSystemMonitor'
                        },
                        {
                            name: 'Drive Converter (FAT32)',
                            icon: 'icons/drive-0.png',
                            type: 'app',
                            action: 'openDriveConverter'
                        }
                    ]
                }
            ]
        },
        {
            type: 'separator'
        },
        {
            name: 'Internet Explorer',
            icon: 'icons/msie1-0.png',
            type: 'app',
            action: 'openInternetExplorer'
        },
        {
            name: 'Outlook Express',
            icon: 'icons/outlook-0.png',
            type: 'app',
            action: 'openOutlookExpress'
        },
        {
            name: 'Windows Explorer',
            icon: 'icons/explorer-0.png',
            type: 'app',
            action: 'openWindowsExplorer'
        },
        {
            type: 'separator'
        },
        {
            name: 'MS-DOS Prompt',
            icon: 'icons/console_prompt-0.png',
            type: 'app',
            action: 'openMSDOSPrompt'
        },
        {
            type: 'separator'
        },
        {
            name: 'Startup',
            icon: 'icons/directory_open-0.png',
            type: 'folder',
            items: []
        }
    ]
};

// Settings submenu structure
const SettingsData = {
    items: [
        {
            name: 'Control Panel',
            icon: 'icons/directory_control_panel-0.png',
            type: 'app',
            action: 'openControlPanel'
        },
        {
            name: 'Printers',
            icon: 'icons/printer-0.png',
            type: 'app',
            action: 'openPrinters'
        },
        {
            type: 'separator'
        },
        {
            name: 'Taskbar & Start Menu',
            icon: 'icons/taskbar-0.png',
            type: 'app',
            action: 'openTaskbarSettings'
        },
        {
            name: 'Folder Options',
            icon: 'icons/settings_gear-0.png',
            type: 'app',
            action: 'openFolderOptions'
        },
        {
            name: 'Active Desktop',
            icon: 'icons/desktop-0.png',
            type: 'app',
            action: 'openActiveDesktop'
        },
        {
            type: 'separator'
        },
        {
            name: 'Windows Update',
            icon: 'icons/windows_update_large-0.png',
            type: 'app',
            action: 'openWindowsUpdate'
        }
    ]
};

// Find submenu structure
const FindData = {
    items: [
        {
            name: 'Files or Folders...',
            icon: 'icons/search_file-0.png',
            type: 'app',
            action: 'openFindFiles'
        },
        {
            name: 'Computer...',
            icon: 'icons/computer_find-0.png',
            type: 'app',
            action: 'openFindComputer'
        },
        {
            name: 'On the Internet...',
            icon: 'icons/search_web-0.png',
            type: 'app',
            action: 'openFindInternet'
        },
        {
            name: 'People...',
            icon: 'icons/users-0.png',
            type: 'app',
            action: 'openFindPeople'
        }
    ]
};

// Documents submenu (recent documents)
const DocumentsData = {
    items: [
        {
            name: 'Meeting Notes.txt',
            icon: 'icons/file_text-0.png',
            type: 'file',
            action: 'openRecentDocument',
            path: 'C:\\My Documents\\Meeting Notes.txt'
        },
        {
            name: 'Shopping List.txt',
            icon: 'icons/file_text-0.png',
            type: 'file',
            action: 'openRecentDocument',
            path: 'C:\\My Documents\\Shopping List.txt'
        },
        {
            name: 'Resume.doc',
            icon: 'icons/file_text-0.png',
            type: 'file',
            action: 'openRecentDocument',
            path: 'C:\\My Documents\\Personal\\Resume.doc'
        }
    ]
};

// Expose globally
window.ProgramsData = ProgramsData;
window.SettingsData = SettingsData;
window.FindData = FindData;
window.DocumentsData = DocumentsData;
