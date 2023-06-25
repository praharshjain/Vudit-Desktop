const os = require('os');
const path = require('path');
const fs = require('fs');
const data = require(path.join(__dirname, '../package.json'));
let arcExt = [], imageExt = [], audioExt = [], videoExt = [], treedocExt = [], markDownExt = [], docExt = [];
let txtExt = [
    'ascii',
    'asm',
    'awk',
    'bash',
    'bat',
    'bf',
    'bsh',
    'c',
    'cert',
    'cgi',
    'clj',
    'conf',
    'cpp',
    'cs',
    'css',
    'elr',
    'go',
    'h',
    'hs',
    'htaccess',
    'htm',
    'html',
    'ini',
    'java',
    'js',
    'key',
    'lisp',
    'log',
    'lua',
    'pem',
    'php',
    'pl',
    'py',
    'rb',
    'readme',
    'scala',
    'sh',
    'sql',
    'srt',
    'sub',
    'txt',
    'vb',
    'vbs',
    'vhdl',
    'wollok',
    'xsd',
    'xsl',
    'iml',
    'gitignore',
    'gradle',
    'lock',
];

let fileTypeMap = {};
data.build.fileAssociations.forEach(f => {
    switch (f.rank) {
        case 'Archives':
            arcExt.push(f.ext);
            f.url = '/zipviewer/index.html?file=';
            break;
        case 'Images':
            imageExt.push(f.ext);
            f.url = '/imgviewer/index.html?file=';
            break;
        case 'Audio':
            audioExt.push(f.ext);
            f.url = '/mediaviewer/audio.html?file=';
            break;
        case 'Video':
            videoExt.push(f.ext);
            f.url = '/mediaviewer/video.html?file=';
            break;
        case 'Documents':
            docExt.push(f.ext);
            f.url = '/docviewer/index.html?file=';
            break;
        case 'TreeDoc':
            treedocExt.push(f.ext);
            f.url = '/treedocviewer/index.html?file=';
            break;
        case 'Markdown':
            markDownExt.push(f.ext);
            f.url = '/markdownviewer/index.html?file=';
            break;
    }
    fileTypeMap[f.ext] = f;
    fileTypeMap[f.mimeType] = f;
});
for (let ext of txtExt) {
    fileTypeMap[ext] = { icon: '', url: '/ide/index.html?file=' };
}

//manual overrides
fileTypeMap['swf'].url = '/swfviewer/index.html?file=';
fileTypeMap['pdf'].url = '/pdfviewer/web/viewer.html?file=';
fileTypeMap['epub'].url = '/epubviewer/index.html?file=';
fileTypeMap['opf'].url = '/epubviewer/index.html?file=';
fileTypeMap['rtf'].url = '/rtfviewer/index.html?file=';
fileTypeMap['wmf'].url = '/rtfviewer/index.html?file=';
fileTypeMap['tex'].url = '/latexviewer/index.html?file=';
fileTypeMap['latex'].url = '/latexviewer/index.html?file=';
fileTypeMap['djv'].url = '/djvuviewer/index.html?file=';
fileTypeMap['djvu'].url = '/djvuviewer/index.html?file=';
fileTypeMap['docx'].url = '/docxviewer/index.html?file=';
fileTypeMap['ipynb'].url = '/ipynbviewer/index.html?file=';
fileTypeMap['sqlite'].url = '/sqliteviewer/index.html?file=';


//directory paths
const homeDir = os.homedir();
let dirPaths = {
    Root: { path: '/', icon: 'icon-drive' },
    Home: { path: homeDir, icon: 'icon-home' }
};
const pathsToCheck = {
    Applications: { possiblePaths: ['/Applications'], icon: 'icon-tools' },
    Desktop: { possiblePaths: ['Desktop'], icon: 'icon-monitor' },
    Documents: { possiblePaths: ['Documents'], icon: 'icon-archive' },
    Downloads: { possiblePaths: ['Downloads'], icon: 'icon-download' },
    Movies: { possiblePaths: ['Movies'], icon: 'icon-video' },
    Music: { possiblePaths: ['Music'], icon: 'icon-music' },
    Pictures: { possiblePaths: ['Pictures'], icon: 'icon-picture' },
};

for (p in pathsToCheck) {
    let possiblePaths = pathsToCheck[p].possiblePaths;
    for (let i = 0; i < possiblePaths.length; i++) {
        let fullPath = '';
        if (possiblePaths[i][0] == '/') {
            //absolute path
            fullPath = possiblePaths[i];
        } else {
            //path relative to home dir
            fullPath = homeDir + '/' + possiblePaths[i];
        }
        if (fs.existsSync(fullPath)) {
            dirPaths[p] = { path: fullPath, icon: pathsToCheck[p].icon }
            break;
        }
    }
}

module.exports = {
    appName: data.productName,
    appVersion: data.version,
    appDescription: data.description,
    copyrightInfo: data.copyright,
    author: data.author,
    website: data.website,
    iconPath: path.join(__dirname, 'icon.png'),
    imageExt: imageExt,
    arcExt: arcExt,
    audioExt: audioExt,
    videoExt: videoExt,
    docExt: docExt,
    txtExt: txtExt,
    treedocExt: treedocExt,
    markDownExt: markDownExt,
    dirPaths: dirPaths,
    fileTypeMap: fileTypeMap,
}