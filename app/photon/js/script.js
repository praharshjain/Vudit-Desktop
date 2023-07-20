const previewFrame = document.getElementById('preview-file'),
    filesTable = document.getElementById('files-table'),
    gridViewBtn = document.getElementById('enable-grid-view'),
    listViewBtn = document.getElementById('enable-list-view');

//file listing stuff
const tableBody = document.getElementById('files-list');
const dirPaths = common.getConfig().dirPaths;
let searchBar = document.getElementById('search-bar');
searchBar.addEventListener('input', filterFiles);
let sideBar = document.getElementById('sidebar-nav-pane');
let footer = document.getElementById('footer-text');
let currentDir = common.getConfig().dirPaths.Home.path;
for (d in dirPaths) {
    let sp = document.createElement('span');
    sp.setAttribute('class', 'nav-group-item');
    sp.setAttribute('onclick', 'showFiles("' + dirPaths[d].path + '")');
    sp.innerHTML = '<span class="icon ' + dirPaths[d].icon + '"></span>' + d;
    sideBar.appendChild(sp);
}
showFiles(currentDir);

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
        tr.setAttribute('onclick', 'showFiles("' + fileObj.path + '")');
    }
    else if (fileObj.isDir) {
        tr.setAttribute('onclick', 'showFiles("' + fileObj.path + '")');
    }
    else if (fileObj.isFile) {
        tr.setAttribute('onclick', 'previewFile("' + fileObj.path + '")');
        tr.setAttribute('ondblclick', 'clearPreview();common.openFile("' + fileObj.path + '")');
    }
    return tr;
}

function showFiles(dirPath) {
    clearPreview();
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

function previewFile(path) {
    previewFrame.src = common.getPreviewURL(path);
}

function clearPreview() {
    previewFrame.src = '';
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