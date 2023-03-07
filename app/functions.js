const { ipcRenderer } = require('electron');
let fileTypeMap = null;

function getFileExt(filePath) {
    return filePath.substring(filePath.lastIndexOf('.') + 1, filePath.length).toLowerCase().trim();
}

function getType(fileObj) {
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
    if (!fileTypeMap) {
        getConfig();
    }
    let ext = getFileExt(path);
    let iconPath = 'app/icons/file_default.svg';
    if (ext in fileTypeMap && fileTypeMap[ext].icon) {
        iconPath = fileTypeMap[ext].icon;
    }
    return '../../' + iconPath;
}

function openFile(path) {
    ipcRenderer.invoke('openFile', path);
}

function getConfig() {
    let config = null;
    if(ipcRenderer) {
        //from rendered process
        config = ipcRenderer.sendSync('getConfig');
        config = JSON.parse(config);
    } else {
        //from node process
        config = require('./config');
    }
    fileTypeMap = config.fileTypeMap;
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

let common = {
    getType: getType,
    getIcon: getIcon,
    openFile: openFile,
    getConfig: getConfig,
    getFileExt: getFileExt,
    ipcRenderer: ipcRenderer,
    fileNameToIcon: fileNameToIcon,
    getReadableSize: getReadableSize,
    getParameterByName: getParameterByName,
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
        let filePath = common.getParameterByName('file');
        if (filePath) {
            document.title = 'Vudit - ' + filePath;
        } else {
            document.title = 'Vudit';
        }
    });
}