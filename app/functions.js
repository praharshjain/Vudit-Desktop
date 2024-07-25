const { ipcRenderer } = require('electron');
const fileNotOpened = 'file-not-opened';
const fileOpened = 'file-opened';
const fileRestored = 'file-restored';
let typeMap = null;

function getFileExt(filePath) {
    return filePath.substring(filePath.lastIndexOf('.') + 1, filePath.length).toLowerCase().trim();
}

function isOSX() {
    return process.platform == 'darwin';
}

function getKind(fileObj) {
    if (fileObj.isBackLink) {
        return '-';
    }
    if (fileObj.isDir) {
        return 'Directory';
    }
    if (fileObj.isFile) {
        return 'File';
    }
    if (fileObj.isSymLink) {
        return 'Symbolic Link';
    }
    return 'Unknown';
}

function getIcon(fileObj) {
    if (fileObj.isBackLink) {
        return '-';
    }
    if (fileObj.isDir) {
        return '<img class="icon" src="../icons/folder.svg">';
    }
    if (fileObj.isFile) {
        return '<img class="icon" src="' + fileNameToIcon(fileObj.path) + '">';
    }
    return '?';
}

function fileNameToIcon(path) {
    if (!typeMap) {
        getConfig();
    }
    let ext = getFileExt(path);
    let iconPath = 'app/icons/file_default.svg';
    if (ext in typeMap && typeMap[ext].icon) {
        iconPath = typeMap[ext].icon;
    }
    return '../../' + iconPath;
}

function openFile(path, type) {
    return ipcRenderer.sendSync('openFile', path, type);
}
function quickLookPreview(name, path) {
    return ipcRenderer.sendSync('quickLookPreview', name, path);
}
function getPreviewURL(path) {
    return ipcRenderer.sendSync('getPreviewURL', path);
}

function getConfig() {
    let config = null;
    if (ipcRenderer) {
        //from rendered process
        config = ipcRenderer.sendSync('getConfig');
        config = JSON.parse(config);
    } else {
        //from node process
        config = require('./config');
    }
    typeMap = config.fileTypeMap;
    return config;
}

function getParameterByName(name, url) {
    if (!url) {
        url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function getCurrentFilePath() {
    return getParameterByName('file');
}

function getFileNameFromPath(path) {
    let pos = path.lastIndexOf('/');
    if (pos > 0) {
        return path.substring(pos + 1);
    }
    return path;
}

function getReadableSize(fileObj) {
    if (!fileObj.isFile) {
        return '--';
    }
    let i = 0, size = fileObj.size;
    let arr = [' bytes', ' KB', ' MB', ' GB'];
    while (i < arr.length && size / 1024 > 1) {
        size /= 1024;
        i++;
    }
    return Math.round(size * 100) / 100 + arr[i];
}

function getViewerURLByType(path, ext, mimeType, map) {
    //let baseURL = 'file://' + __dirname + '/viewer';
    let baseURL = 'viewer';
    path = encodeURIComponent(path);
    if (ext in map) {
        return baseURL + map[ext].url + path;
    }
    if (mimeType in map) {
        return baseURL + map[mimeType].url + path;
    }
    if (mimeType.includes('text')) {
        return baseURL + map['txt'].url + path;
    }
    if (mimeType.includes('video')) {
        return baseURL + map['mp4'].url + path;
    }
    if (mimeType.includes('audio')) {
        return baseURL + map['mp3'].url + path;
    }
    if (mimeType.includes('image')) {
        return baseURL + map['png'].url + path;
    }
    console.log('\n\n unsupported file -> path: ' + path + ' ext: ' + ext + ' mimeType: ' + mimeType);
    return '';
}

let common = {
    fileNotOpened: fileNotOpened,
    fileOpened: fileOpened,
    fileRestored: fileRestored,
    isOSX: isOSX,
    getKind: getKind,
    getIcon: getIcon,
    openFile: openFile,
    getConfig: getConfig,
    getFileExt: getFileExt,
    ipcRenderer: ipcRenderer,
    getPreviewURL: getPreviewURL,
    fileNameToIcon: fileNameToIcon,
    getReadableSize: getReadableSize,
    quickLookPreview: quickLookPreview,
    getCurrentFilePath: getCurrentFilePath,
    getParameterByName: getParameterByName,
    getViewerURLByType: getViewerURLByType,
    getFileNameFromPath: getFileNameFromPath,
}
if (typeof module != 'undefined') {
    module.exports = common;
}
if (typeof window != 'undefined') {
    window.common = common;
}

//insert common theme css
const css = `
::-webkit-scrollbar {
	width: 8px;
	height: 8px;
	background-color: whitesmoke;
}
::-webkit-scrollbar-thumb {
	border-radius: 0px;
	height: 8px;
	width: 8px;
	background-color: #666;
}
::-webkit-scrollbar-thumb:hover {
	background-color: #999;
	height: 8px;
	width: 8px;
}
::-webkit-scrollbar-thumb:active {
	background-color: #999;
	width: 8px;
	height: 8px;
}`;
if (typeof document != 'undefined') {
    document.addEventListener("DOMContentLoaded", function (event) {
        let styleSheet = document.createElement("style");
        styleSheet.innerText = css;
        document.body.appendChild(styleSheet);
        let filePath = common.getCurrentFilePath();
        if (filePath) {
            document.title = 'Vudit - ' + filePath;
        } else {
            document.title = 'Vudit';
        }
    });
}