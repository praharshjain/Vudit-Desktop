//file drop support
const dropArea = document.querySelector(".drop-file"),
    dragText = document.getElementById("drop-file-text"),
    button = document.getElementById("file-chooser"),
    input = document.getElementById("file-input");
button.onclick = () => { input.click() }
input.addEventListener("change", function () {
    dropArea.classList.add("active");
    let file = this.files[0];
    common.openFile(file.path);
});
dropArea.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropArea.classList.add("active");
    dragText.textContent = "Release to Open File";
});
dropArea.addEventListener("dragleave", () => {
    dropArea.classList.remove("active");
    dragText.textContent = "Drag it here to Open";
});
dropArea.addEventListener("drop", (event) => {
    event.preventDefault();
    let file = event.dataTransfer.files[0];
    common.openFile(file.path);
});

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
    kind.innerText = common.getType(fileObj);
    tr.appendChild(kind);
    let size = document.createElement('td');
    size.innerText = common.getReadableSize(fileObj);
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
        tr.setAttribute('onclick', 'common.openFile("' + fileObj.path + '")');
    }
    return tr;
}

function showFiles(dirPath) {
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

function filterFiles(e) {
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