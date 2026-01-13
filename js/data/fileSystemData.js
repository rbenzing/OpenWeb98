// js/data/fileSystemData.js

/**
 * Initial File System Data
 * Represents a realistic Windows 98 file system structure
 */
const FileSystemData = {
    drives: {
        'C:': {
            type: 'drive',
            label: 'Local Disk',
            icon: 'icons/drive-0.png',
            children: {
                'Windows': {
                    type: 'folder',
                    icon: 'icons/directory_closed-1.png',
                    modified: new Date('1999-05-05'),
                    children: {
                        'System': {
                            type: 'folder',
                            modified: new Date('1999-05-05'),
                            children: {
                                'drivers': {
                                    type: 'folder',
                                    modified: new Date('1999-05-05'),
                                    children: {
                                        'vga.drv': { type: 'file', size: 5824, content: '', modified: new Date('1999-05-05') },
                                        'mouse.drv': { type: 'file', size: 4512, content: '', modified: new Date('1999-05-05') },
                                        'keyboard.drv': { type: 'file', size: 3200, content: '', modified: new Date('1999-05-05') }
                                    }
                                },
                                'kernel32.dll': { type: 'file', size: 476672, content: '', modified: new Date('1999-05-05') },
                                'user32.dll': { type: 'file', size: 392704, content: '', modified: new Date('1999-05-05') },
                                'gdi32.dll': { type: 'file', size: 181248, content: '', modified: new Date('1999-05-05') }
                            }
                        },
                        'System32': {
                            type: 'folder',
                            modified: new Date('1999-05-05'),
                            children: {
                                'notepad.exe': { type: 'file', size: 69632, content: '', modified: new Date('1999-05-05') },
                                'calc.exe': { type: 'file', size: 114688, content: '', modified: new Date('1999-05-05') },
                                'mspaint.exe': { type: 'file', size: 336896, content: '', modified: new Date('1999-05-05') },
                                'sol.exe': { type: 'file', size: 82944, content: '', modified: new Date('1999-05-05') },
                                'cmd.exe': { type: 'file', size: 245760, content: '', modified: new Date('1999-05-05') }
                            }
                        },
                        'Fonts': {
                            type: 'folder',
                            modified: new Date('1999-05-05'),
                            children: {
                                'arial.ttf': { type: 'file', size: 272352, content: '', modified: new Date('1999-05-05') },
                                'times.ttf': { type: 'file', size: 315424, content: '', modified: new Date('1999-05-05') },
                                'cour.ttf': { type: 'file', size: 268512, content: '', modified: new Date('1999-05-05') }
                            }
                        },
                        'Desktop': {
                            type: 'folder',
                            modified: new Date('1999-05-05'),
                            children: {}
                        },
                        'win.ini': { type: 'file', size: 2048, content: '[Windows]\r\nload=\r\nrun=\r\n', modified: new Date('1999-05-05') },
                        'system.ini': { type: 'file', size: 3072, content: '[boot]\r\nshell=explorer.exe\r\n', modified: new Date('1999-05-05') },
                        'explorer.exe': { type: 'file', size: 512000, content: '', modified: new Date('1999-05-05') }
                    }
                },
                'Program Files': {
                    type: 'folder',
                    icon: 'icons/directory_program-0.png',
                    modified: new Date('1999-05-05'),
                    children: {
                        'Accessories': {
                            type: 'folder',
                            modified: new Date('1999-05-05'),
                            children: {
                                'Wordpad.exe': { type: 'file', size: 245760, content: '', modified: new Date('1999-05-05') },
                                'Paint.exe': { type: 'file', size: 336896, content: '', modified: new Date('1999-05-05') }
                            }
                        },
                        'Internet Explorer': {
                            type: 'folder',
                            modified: new Date('1999-05-05'),
                            children: {
                                'iexplore.exe': { type: 'file', size: 589824, content: '', modified: new Date('1999-05-05') }
                            }
                        },
                        'Common Files': {
                            type: 'folder',
                            modified: new Date('1999-05-05'),
                            children: {
                                'Microsoft Shared': {
                                    type: 'folder',
                                    modified: new Date('1999-05-05'),
                                    children: {}
                                }
                            }
                        }
                    }
                },
                'My Documents': {
                    type: 'folder',
                    icon: 'icons/directory_open_file_mydocs-0.png',
                    modified: new Date('1999-06-15'),
                    children: {
                        'Personal': {
                            type: 'folder',
                            modified: new Date('1999-06-15'),
                            children: {
                                'Resume.doc': { type: 'file', size: 24576, content: 'John Smith\nContact Information\nExperience: ...', modified: new Date('1999-06-15') },
                                'CoverLetter.doc': { type: 'file', size: 18432, content: 'Dear Hiring Manager,\n\n...', modified: new Date('1999-06-18') }
                            }
                        },
                        'Work': {
                            type: 'folder',
                            modified: new Date('1999-07-01'),
                            children: {
                                'Q2 Report.xls': { type: 'file', size: 36864, content: '', modified: new Date('1999-07-01') },
                                'Presentation.ppt': { type: 'file', size: 98304, content: '', modified: new Date('1999-07-15') },
                                'Budget.xls': { type: 'file', size: 28672, content: '', modified: new Date('1999-08-01') }
                            }
                        },
                        'Photos': {
                            type: 'folder',
                            modified: new Date('1999-08-20'),
                            children: {
                                'Vacation1999.jpg': { type: 'file', size: 245760, content: '', modified: new Date('1999-08-20') },
                                'Family.jpg': { type: 'file', size: 196608, content: '', modified: new Date('1999-08-21') }
                            }
                        },
                        'Letter to Mom.txt': { type: 'file', size: 1024, content: 'Dear Mom,\n\nHow are you doing? I hope everything is well...\n\nLove,\nJohn', modified: new Date('1999-06-20') },
                        'Shopping List.txt': { type: 'file', size: 512, content: 'Groceries:\n- Milk\n- Bread\n- Eggs\n- Butter\n- Coffee', modified: new Date('1999-09-01') },
                        'Meeting Notes.txt': { type: 'file', size: 2048, content: 'Meeting with Marketing Team\nDate: September 15, 1999\n\nAgenda:\n1. Q3 Review\n2. Q4 Planning\n3. Budget Discussion', modified: new Date('1999-09-15') },
                        'Ideas.txt': { type: 'file', size: 768, content: 'Project Ideas:\n- Website redesign\n- Customer database\n- Automated reports', modified: new Date('1999-08-10') }
                    }
                },
                'Temp': {
                    type: 'folder',
                    modified: new Date('1999-09-20'),
                    children: {
                        '~temp1.tmp': { type: 'file', size: 4096, content: '', modified: new Date('1999-09-20') },
                        '~temp2.tmp': { type: 'file', size: 8192, content: '', modified: new Date('1999-09-20') }
                    }
                },
                'autoexec.bat': {
                    type: 'file',
                    size: 1024,
                    content: '@ECHO OFF\r\nPATH=C:\\WINDOWS;C:\\WINDOWS\\COMMAND\r\nSET TEMP=C:\\TEMP\r\n',
                    modified: new Date('1999-05-05')
                },
                'config.sys': {
                    type: 'file',
                    size: 512,
                    content: 'DEVICE=C:\\WINDOWS\\HIMEM.SYS\r\nDEVICE=C:\\WINDOWS\\EMM386.EXE\r\n',
                    modified: new Date('1999-05-05')
                },
                'msdos.sys': {
                    type: 'file',
                    size: 1536,
                    content: '[Options]\r\nBootMulti=1\r\nBootGUI=1\r\n',
                    modified: new Date('1999-05-05')
                },
                'command.com': {
                    type: 'file',
                    size: 93890,
                    content: '',
                    modified: new Date('1999-05-05')
                }
            }
        },
        'A:': {
            type: 'floppy',
            label: '3½ Floppy',
            icon: 'icons/floppy_drive-0.png',
            empty: true,
            modified: new Date('1999-05-05')
        },
        'D:': {
            type: 'cdrom',
            label: 'CD-ROM Drive',
            icon: 'icons/cd_drive-0.png',
            modified: new Date('1999-05-05'),
            children: {
                'Install': {
                    type: 'folder',
                    modified: new Date('1999-05-05'),
                    children: {
                        'Setup.exe': { type: 'file', size: 524288, content: '', modified: new Date('1999-05-05') },
                        'Setup.ini': { type: 'file', size: 2048, content: '[Setup]\r\nVersion=1.0\r\n', modified: new Date('1999-05-05') }
                    }
                },
                'Drivers': {
                    type: 'folder',
                    modified: new Date('1999-05-05'),
                    children: {
                        'Audio': {
                            type: 'folder',
                            modified: new Date('1999-05-05'),
                            children: {
                                'sndblast.drv': { type: 'file', size: 16384, content: '', modified: new Date('1999-05-05') }
                            }
                        },
                        'Video': {
                            type: 'folder',
                            modified: new Date('1999-05-05'),
                            children: {
                                'vga.drv': { type: 'file', size: 5824, content: '', modified: new Date('1999-05-05') }
                            }
                        }
                    }
                },
                'Setup.exe': { type: 'file', size: 524288, content: '', modified: new Date('1999-05-05') },
                'Readme.txt': {
                    type: 'file',
                    size: 4096,
                    content: 'Windows 98 Installation CD\r\n\r\nThank you for purchasing Windows 98.\r\n\r\nFor installation instructions, please refer to the Getting Started guide.',
                    modified: new Date('1999-05-05')
                },
                'Autorun.inf': {
                    type: 'file',
                    size: 256,
                    content: '[autorun]\r\nopen=Setup.exe\r\nicon=Setup.exe,0\r\n',
                    modified: new Date('1999-05-05')
                }
            }
        }
    },
    currentPath: 'C:\\'
};

// Expose globally
window.FileSystemData = FileSystemData;
