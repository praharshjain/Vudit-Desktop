const previewFrame = document.getElementById('preview-file'),
    filesTable = document.getElementById('files-table'),
    gridViewBtn = document.getElementById('enable-grid-view'),
    listViewBtn = document.getElementById('enable-list-view'),
    fileListingClass = 'file-listing-item';

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
    let optionsBtn = document.createElement('button');
    optionsBtn.setAttribute('class', 'icon icon-dot-3 file-options');
    optionsBtn.setAttribute('onclick', 'showOptionsMenu(event)');
    optionsBtn.value = JSON.stringify(fileObj);
    name.appendChild(optionsBtn);
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
    tr.setAttribute('title', fileObj.name);
    tr.setAttribute('class', fileListingClass);
    if (fileObj.isBackLink) {
        tr.setAttribute('id', 'backlink');
        tr.setAttribute('onclick', 'showFiles(this, "' + fileObj.path + '")');
    }
    else if (fileObj.isDir) {
        tr.setAttribute('onclick', 'previewFile(this, "' + fileObj.path + '")');
        tr.setAttribute('ondblclick', 'showFiles(this, "' + fileObj.path + '")');
    }
    else if (fileObj.isFile) {
        tr.setAttribute('onclick', 'previewFile(this, "' + fileObj.path + '")');
        tr.setAttribute('ondblclick', 'openFile("' + fileObj.name + '", "' + fileObj.path + '")');
    }
    return tr;
}

function showFiles(e, dirPath) {
    makeAllListingsInActive(fileListingClass);
    clearPreview();
    hideOpenFiles();
    if (e) {
        e.classList.add('active');
    }
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
    makeAllListingsInActive('nav-group-item');
    common.ipcRenderer.sendSync('hideOpenFiles');
}

function makeAllListingsInActive(className) {
    let ele = document.getElementsByClassName(className);
    for (let i = 0; i < ele.length; i++) {
        ele[i].classList.remove('active');
    }
}

function previewFile(e, path) {
    makeAllListingsInActive(fileListingClass);
    if (e) {
        e.classList.add('active');
    }
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
        makeAllListingsInActive('nav-group-item');
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
        if (listItems[i].innerText.toLowerCase().includes(query.toLowerCase())) {
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

function showOptionsMenu(event) {
    let ele = event.target;
    let fileObj = JSON.parse(ele.value);
    let id = 'options-menu-' + fileObj.path;
    let menu = document.getElementById(id);
    if (menu) {
        return menu.parentNode.removeChild(menu);
    }
    let openMenus = document.getElementsByClassName('options-menu');
    for (let i = 0; i < openMenus.length; i++) {
        openMenus[i].parentNode.removeChild(openMenus[i]);
    }
    menu = createOptions(fileObj);
    menu.setAttribute('id', id);
    ele.appendChild(menu);
}

function createOptions(fileObj) {
    let menu = document.createElement('ul');
    menu.setAttribute('class', 'list-group options-menu');
    if (fileObj.isFile) {
        let open = document.createElement('li');
        open.innerText = 'Open File';
        open.setAttribute('class', 'list-group-item');
        open.setAttribute('onclick', 'openFile("' + fileObj.name + '", "' + fileObj.path + '")');
        menu.appendChild(open);
    }
    if (fileObj.isDir) {
        let open = document.createElement('li');
        open.innerText = 'Open Folder';
        open.setAttribute('class', 'list-group-item');
        open.setAttribute('onclick', 'showFiles(null, "' + fileObj.path + '")');
        menu.appendChild(open);
    }
    return menu;
}