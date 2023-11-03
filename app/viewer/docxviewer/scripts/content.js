var $body = $('body');
var $extension = $('#main');
var $dragDrop = $extension.find("#docxjs-drag-drop");
var $dragDropArea = $dragDrop.find("#drag-drag-area img");
var $files = $dragDrop.find("#files");
var $docxjsWrapper = $extension.find("#docxjs-wrapper");
var $menuHideBtn = $body.find(".hide-btn");

var docxJS = new DocxJS();
var afterRender = function () {
    var element = $docxjsWrapper[0];
    var loadingNode = document.createElement("div");
    loadingNode.setAttribute("class", 'docx-loading');
    element.parentNode.insertBefore(loadingNode, element);
    $dragDrop.hide();

    docxJS.render(element, function (result) {
        if (result.isError) {
            if(!$body.hasClass('is-docxjs-rendered')){
                $dragDrop.show();
                $docxjsWrapper.hide();
                $body.removeClass('is-docxjs-rendered');
                element.innerHTML = "";

                $body.addClass('rendered');
            }
        } else {
            $body.addClass('is-docxjs-rendered');
            console.log("Success Render");
        }

        loadingNode.parentNode.removeChild(loadingNode);
    });
};

$files.on('change', function (e) {
    var files = e.target.files;
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();

    e.returnValue = false;
    e.cancelBubble = true;
    e.stopped = true;

    docxJS.parse(
        files[0],
        function () {
            $docxjsWrapper[0].filename = files[0].name;
            afterRender();
        }, function (e) {
            if(!$body.hasClass('is-docxjs-rendered')){
                $dragDrop.show();
                $docxjsWrapper.hide();
            }
            if(e.isError && e.msg){
                alert(e.msg);
            }
        }
    );
});


var stopEvent = function(e){
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();

    e.returnValue = false;
    e.cancelBubble = true;
    e.stopped = true;
};

var renderDocxJS = function (file) {
    docxJS.parse(
        file,
        function () {
            afterRender();
        }, function (e) {
            if(!$body.hasClass('is-docxjs-rendered')){
                $dragDrop.show();
                $docxjsWrapper.hide();
            }
            if(e.isError && e.msg){
                alert(e.msg);
            }
        }
    );
};


$dragDropArea.on("click", function () {
    $files.trigger("click");
}).on("dragover", function (e) {
    stopEvent(e);
    e.originalEvent.dataTransfer.dropEffect = 'copy';

    $dragDropArea.addClass("drag-on");
}).on("dragenter", function (e) {
    stopEvent(e);
}).on("dragleave", function (e) {
    stopEvent(e);
    $dragDropArea.removeClass("drag-on");
}).on("drop", function (e) {
    $dragDropArea.removeClass("drag-on");

    if (e.originalEvent.dataTransfer) {
        if (e.originalEvent.dataTransfer.files.length) {
            if (e.preventDefault) e.preventDefault();
            if (e.stopPropagation) e.stopPropagation();

            renderDocxJS(e.originalEvent.dataTransfer.files[0]);
        }
    }
});

$menuHideBtn.on("click", function () {
    if($menuHideBtn.hasClass('hide')){
        $body.removeClass('menu-hide');
        $menuHideBtn.removeClass('hide');
    }else{
        $body.addClass('menu-hide');
        $menuHideBtn.addClass('hide');
    }
});