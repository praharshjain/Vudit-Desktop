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
    window.close();
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
    window.close();
});