const previewFrame = document.getElementById('preview-file'),
    filesTable = document.getElementById('files-table'),
    gridViewBtn = document.getElementById('enable-grid-view'),
    listViewBtn = document.getElementById('enable-list-view'),
    fileListingClass = 'file-listing-item',
    fileTypeMap = common.getConfig().fileTypeMap;

//file listing stuff
const tableBody = document.getElementById('files-list');
const dirPaths = common.getConfig().dirPaths;
let supportedFileTypes = {};
Object.keys(fileTypeMap).sort().forEach(function (k) {
    if (fileTypeMap[k].isExt) {
        supportedFileTypes[k] = fileTypeMap[k];
    }
});
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
    removeMenus();
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
    removeMenus(getMenuID(path));
    makeAllListingsInActive(fileListingClass);
    if (e) {
        e.classList.add('active');
    }
    previewFrame.src = common.getPreviewURL(path);
}

function clearPreview() {
    previewFrame.src = '';
}

function quickLookPreview(name, path) {
    common.quickLookPreview(name, path);
}

function openFile(name, path) {
    clearPreview();
    hideOpenFiles();
    let res = common.openFile(path);
    if (res.state == common.fileOpened) {
        createFileListing(name, path, res.url);
    }
}

function openFileAs(type, name, path) {
    clearPreview();
    hideOpenFiles();
    common.openFile(path, type);
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
    let menu = document.getElementById(getMenuID(fileObj.path));
    if (menu) {
        return;
    }
    document.body.appendChild(createOptions(fileObj, event.pageX, event.pageY));
}

function removeMenus(idToSkip = '') {
    let openMenus = document.getElementsByClassName('menu');
    for (let i = 0; i < openMenus.length; i++) {
        if (openMenus[i].id == '' || openMenus[i].id == idToSkip) {
            continue;
        }
        openMenus[i].parentNode.removeChild(openMenus[i]);
    }
}

function getMenuID(path) {
    return 'options-menu-' + path;
}

function createOptions(fileObj, posX, posY) {
    let menu = document.createElement('menu');
    menu.setAttribute('class', 'menu show-menu');
    menu.setAttribute('id', getMenuID(fileObj.path));
    if (fileObj.isFile) {
        let item = createMenuItem('Open File', 'icon icon-eye', 'openFile("' + fileObj.name + '", "' + fileObj.path + '")');
        menu.appendChild(item);
        item = createMenuItem('Open File As', 'icon icon-shareable', '');
        let submenu = document.createElement('menu');
        submenu.setAttribute('class', 'menu');
        for (let type in supportedFileTypes) {
            let subMenuItem = createMenuItem(type, '', 'openFileAs("' + type + '", "' + fileObj.name + '", "' + fileObj.path + '")')
            submenu.appendChild(subMenuItem);
        }
        item.classList.add('submenu');
        item.appendChild(submenu);
        menu.appendChild(item);
        if (common.isOSX()) {
            item = createMenuItem('QuickLook Preview', 'icon icon-eye', 'quickLookPreview("' + fileObj.name + '", "' + fileObj.path + '")');
            menu.appendChild(item);
        }
    }
    if (fileObj.isDir) {
        let item = createMenuItem('Open Folder', 'icon icon-folder', 'showFiles(null, "' + fileObj.path + '")');
        menu.appendChild(item);
    }
    menu.style.left = posX + 'px';
    menu.style.top = posY + 'px';
    return menu;
}

function createMenuItem(txt, icn, onClick) {
    let item = document.createElement('li');
    let btn = document.createElement('button');
    btn.setAttribute('class', 'menu-btn');
    let icon = document.createElement('i');
    icon.setAttribute('class', icn);
    let text = document.createElement('span');
    text.setAttribute('class', 'menu-text');
    text.innerText = txt;
    item.setAttribute('class', 'menu-item');
    if (onClick != '') {
        item.setAttribute('onclick', onClick);
    }
    btn.appendChild(icon);
    btn.appendChild(text);
    item.appendChild(btn);
    item.setAttribute('title', txt);
    return item;
}