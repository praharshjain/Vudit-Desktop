const previewFrame = document.getElementById('preview-file'),
    filesTable = document.getElementById('files-table'),
    gridViewBtn = document.getElementById('enable-grid-view'),
    listViewBtn = document.getElementById('enable-list-view');

//file listing stuff
const tableBody = document.getElementById('files-list');
const dirPaths = common.getConfig().dirPaths;
let favoritesPane = document.getElementById('sidebar-nav-pane');
let openFilesPane = document.getElementById('sidebar-open-files-pane');
let footer = document.getElementById('footer-text');
let searchBar = document.getElementById('search-bar');
searchBar.addEventListener('input', filterFiles);
common.ipcRenderer.on('fileOpened', function (e, obj, path) {
    if (obj.state == common.fileOpened || obj.state == common.fileRestored) {
        createFileListing(common.getFileNameFromPath(path), path, obj.url);
    }
});

let currentDir = dirPaths.Home.path;
for (d in dirPaths) {
    let sp = document.createElement('span');
    sp.setAttribute('class', 'nav-group-item');
    sp.setAttribute('onclick', 'showFiles(this, "' + dirPaths[d].path + '")');
    sp.innerHTML = '<span class="icon ' + dirPaths[d].icon + '"></span>' + d;
    favoritesPane.appendChild(sp);
}
showFiles(favoritesPane.children[2], currentDir);

function goBack() {
    let b = document.getElementById('backlink');
    if (b) {
        b.click();
    }
}

function getRow(fileObj) {
    let tr = document.createElement('tr');
    let icon = document.createElement('td');
    icon.innerHTML = common.getIcon(fileObj);
    icon.setAttribute('class', 'icon-holder');
    tr.appendChild(icon);
    let name = document.createElement('td');
    name.innerText = fileObj.name;
    name.setAttribute('class', 'file-name');
    tr.appendChild(name);
    let kind = document.createElement('td');
    kind.innerText = common.getKind(fileObj);
    tr.appendChild(kind);
    let type = document.createElement('td');
    type.innerText = fileObj.type;
    tr.appendChild(type);
    let size = document.createElement('td');
    size.innerText = common.getReadableSize(fileObj);
    size.setAttribute('class', 'file-size');
    tr.appendChild(size);
    let time = document.createElement('td');
    time.innerText = fileObj.isBackLink ? '-' : fileObj.mTime.toString();
    tr.appendChild(time);
    tr.setAttribute('data-path', fileObj.path);
    if (fileObj.isBackLink) {
        tr.setAttribute('id', 'backlink');
        tr.setAttribute('onclick', 'showFiles(this, "' + fileObj.path + '")');
    }
    else if (fileObj.isDir) {
        tr.setAttribute('onclick', 'showFiles(this, "' + fileObj.path + '")');
    }
    else if (fileObj.isFile) {
        tr.setAttribute('onclick', 'previewFile("' + fileObj.path + '")');
        tr.setAttribute('ondblclick', 'openFile("' + fileObj.name + '", "' + fileObj.path + '")');
    }
    return tr;
}

function showFiles(e, dirPath) {
    clearPreview();
    hideOpenFiles();
    e.classList.add('active');
    searchBar.value = '';
    currentDir = dirPath;
    footer.innerText = dirPath;
    common.ipcRenderer.invoke('listFiles', dirPath).then((filesArr) => {
        tableBody.innerHTML = '';
        filesArr.forEach(fileObj => {
            tableBody.appendChild(getRow(fileObj));
        });
    });
}

function hideOpenFiles() {
    makeAllListingsInActive();
    common.ipcRenderer.sendSync('hideOpenFiles');
}

function makeAllListingsInActive() {
    let ele = document.getElementsByClassName('nav-group-item');
    for (let i = 0; i < ele.length; i++) {
        ele[i].classList.remove('active');
    }
}

function previewFile(path) {
    previewFrame.src = common.getPreviewURL(path);
}

function clearPreview() {
    previewFrame.src = '';
}

function openFile(name, path) {
    clearPreview();
    hideOpenFiles();
    let res = common.openFile(path);
    if (res.state == common.fileOpened) {
        createFileListing(name, path, res.url);
    }
}

function createFileListing(name, path, url) {
    let ele = document.getElementById(url);
    if (ele && ele.parentNode == openFilesPane) {
        makeAllListingsInActive();
        ele.classList.add('active');
        return;
    }
    let sp = document.createElement('span');
    sp.setAttribute('class', 'nav-group-item active');
    sp.setAttribute('onclick', 'restoreFile(this)');
    sp.setAttribute('title', path);
    sp.setAttribute('id', url);
    sp.innerHTML = '<span class="icon icon-cancel float-right" onclick="closeFile(event);"></span>' + name;
    openFilesPane.appendChild(sp);
}

function restoreFile(ele) {
    hideOpenFiles();
    ele.classList.add('active');
    return common.ipcRenderer.sendSync('restoreView', ele.id);
}

function closeFile(e) {
    e.stopPropagation();
    hideOpenFiles();
    let ele = e.target;
    common.ipcRenderer.sendSync('closeView', ele.parentNode.id);
    ele.parentNode.remove(ele);
    showFiles(favoritesPane.children[2], dirPaths.Home.path);
}

function filterFiles(e) {
    previewFrame.src = '';
    let query = e.target.value;
    let listItems = document.getElementsByClassName('file-name');
    for (let i = 0; i < listItems.length; i++) {
        if (listItems[i].innerText.includes(query)) {
            listItems[i].parentNode.classList.remove('hidden');
        } else {
            listItems[i].parentNode.classList.add('hidden');
        }
    }
}

function listView() {
    filesTable.classList.remove('grid-view');
    gridViewBtn.classList.remove('active');
    listViewBtn.classList.add('active');
}

function gridView() {
    filesTable.classList.add('grid-view');
    listViewBtn.classList.remove('active');
    gridViewBtn.classList.add('active');
}