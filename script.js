'use strict';

var onLoad = function(files) {
    document.getElementById('image').onmousedown = null;
    for (var i = 0; i < files.length; i++) {
        var reader = new FileReader();
        var img = document.getElementById('image');
        reader.onload = (function(aImg) {
            return function(e) {
                aImg.src = e.target.result;
                document.getElementById('imageBlur').src = e.target.result;
                aImg.style.maxWidth = '100%';
                aImg.style.maxHeight = '100%';
                aImg.style.width = '100%';
                aImg.style.height = '100%';
                aImg.style.top = null;
                aImg.style.left = null;
                cloneImgLay(aImg);
            };
        })(img);
        reader.readAsDataURL(files[i]);
    }

    var moveLabel = document.getElementById('image');        


    moveLabel.onmousedown = function(event) {
        let shiftX = event.clientX - moveLabel.getBoundingClientRect().left;
        let shiftY = event.clientY - moveLabel.getBoundingClientRect().top;
        
        let parentX = document.getElementById('stepCover').getBoundingClientRect().left;
        let parentY = document.getElementById('stepCover').getBoundingClientRect().top;
    
        moveLabel.style.position = 'absolute';
        
        moveLabel.style.width = moveLabel.clientWidth;
        moveLabel.style.height = moveLabel.clientHeight;
        moveLabel.style.zIndex = 1000;

        moveLabel.parentElement.append(moveLabel);
        //document.body.append(moveLabel);

        moveAt(event.clientX, event.clientY);

        function moveAt(pageX, pageY) {
            moveLabel.style.left = pageX - parentX - shiftX;
            moveLabel.style.top = pageY - parentY - shiftY;
        }

        function onMouseMove(event) {
            if (event.which == 1) {
                //moveAt(event.offsetX, event.offsetY);
                moveAt(event.clientX, event.clientY);
                cloneImgLay(moveLabel);
            } else {
                onMouseUpImg();
            }
        }

        var onMouseUpImg = function() {
            let image = document.getElementById('image');
            let widthImg = +image.style.width.slice(0, -2);
            let heightImg = +image.style.height.slice(0, -2);
            let parentWidth = +image.parentElement.clientWidth;
            let parentHeight = +image.parentElement.clientHeight;
            
            if (image.style.top) {
                image.style.top.slice(0, -2) < 30 - heightImg ? image.style.top = 0 : null;
                image.style.top.slice(0, -2) > parentHeight - 30 ? image.style.top = image.parentElement.clientHeight - image.clientHeight : null;
                image.style.left.slice(0, -2) < 30 - widthImg ? image.style.left = 0 : null;
                image.style.left.slice(0, -2) > parentWidth - 30 ? image.style.left = image.parentElement.clientWidth - image.clientWidth : null;
            }
            cloneImgLay(image);

            document.removeEventListener('mousemove', onMouseMove);
            moveLabel.onmouseup = null;
        }

        moveLabel.onmouseup = onMouseUpImg;
        
        document.body.onmouseup = onMouseUpImg;

        document.addEventListener('mousemove', onMouseMove);
    }


    moveLabel.ondragstart = function() {
        console.log('I\'m working!!!');
        return false;
    };

    document.getElementById('imageBlur').ondragstart = function() {
        console.log('I\'m working too!!!');
        return false;
    }

    if (window.matchMedia('(hover: none)').matches) {
        document.getElementById('navPanel').style.display = 'flex';
        document.getElementById('navUp').addEventListener("touchstart", function(event) { onClickNavPanel(-2); });
        document.getElementById('navLeft').addEventListener("touchstart", function(event) { onClickNavPanel(-1); });
        document.getElementById('navCenter').addEventListener("touchstart", function(event) { onClickNavPanel(0); });
        document.getElementById('navRight').addEventListener("touchstart", function(event) { onClickNavPanel(1); });
        document.getElementById('navDown').addEventListener("touchstart", function(event) { onClickNavPanel(2); });
    }
};

var cloneImgLay = function(elem) {
    let cloneCover = document.getElementById('stepCover').cloneNode(true);
    let containerClone = document.getElementById('coverLayDisplay');
    document.getElementById('stepCoverClone') && document.getElementById('stepCoverClone').remove();
    cloneCover.childNodes.forEach(function(child) {
        if (child.id == 'image') {
            elem.clientWidth ? child.style.width = elem.clientWidth / (elem.parentElement.clientWidth / containerClone.clientWidth) : null;
            elem.clientHeight ? child.style.height = elem.clientHeight / (elem.parentElement.clientHeight / containerClone.clientHeight) : null;
            if (elem.style.top)
                child.style.top = +elem.style.top.slice(0, -2) / (elem.parentElement.clientWidth / containerClone.clientWidth);
            if (elem.style.left)
                child.style.left = +elem.style.left.slice(0, -2) / (elem.parentElement.clientWidth / containerClone.clientWidth);
            child.style.maxWidth ? child.style.maxWidth = '' : null;
            child.style.maxHeight ? child.style.maxHeight = '' : null;
        }
        child.tagName === 'BUTTON' && child.remove();
        child.id === 'navPanel' && child.remove();
        child.id ? child.id += 'Clone': null;
    });
    cloneCover.id += 'Clone';
    document.getElementById('coverLayDisplay').appendChild(cloneCover);

};

var chooseType = function(elem) {
    elem.parentElement.childNodes.forEach(function(child) {
        if (child.tagName == 'UL') {
            child.style.display = child.style.display == 'block' ? 'none' : 'block';
            elem.parentElement.style.height = child.style.display == 'block' ? '175px' : '40px';
        }
    })
};

var onClickType = function(elem) {
    var typeMaket = elem.parentElement.parentElement.querySelector('[name="typeMaket"]');
    typeMaket.innerText = elem.innerText;
    elem.parentElement.style.display = 'none';
}

var onClickLoad = function(elem) {
    elem.parentElement.getElementsByTagName('input')[0].click();
};

var onClickScale = function(mark) {
    let image = document.getElementById('image');
    if (image.style.maxWidth) {
        image.clientWidth == image.parentElement.clientWidth ? image.style.width = image.style.maxWidth : image.style.height = image.style.maxHeight;
        image.style.maxWidth = null;
        image.style.maxHeight = null;
    }
    image.style.width = image.clientWidth * (mark == 0 ? 1.1 : 0.9) + 'px';
    image.style.height = image.clientHeight * (mark == 0 ? 1.1 : 0.9) + 'px';
    if (image.style.top == '0px')
        image.style.top = null
    if (image.style.left == '0px')
        image.style.left = null
    if (image.style.top)
        image.style.top = +image.style.top.slice(0, -2) + (mark == 0 ? -image.clientHeight : image.clientHeight) * 0.05 + 'px';
    if (image.style.left)
        image.style.left = +image.style.left.slice(0, -2) + (mark == 0 ? -image.clientWidth : image.clientWidth) * 0.05 + 'px';
    
    cloneImgLay(image);
};

var onClickNavPanel = function(mark) {
    let image = document.getElementById('image');
    if (!image.style.top) {
        image.style.top = '0px';
        image.style.left = '0px';  
    }

    switch (mark) {
        case -2:
            image.style.top = +image.style.top.slice(0, -2) - 5 + 'px';
            break;
        case -1:
            image.style.left = +image.style.left.slice(0, -2) - 5 + 'px';
            break;
        case 0:
            image.style.top = '0px';
            image.style.left = '0px';
            break;
        case 1:
            image.style.left = +image.style.left.slice(0, -2) + 5 + 'px';
            break;
        case 2:
            image.style.top = +image.style.top.slice(0, -2) + 5 + 'px';
            break;
    }
    cloneImgLay(image);
}

var onChangeTrackName = function(dom) {
    document.getElementsByName('coverLayName')[0].innerHTML = dom.value;
};

var onChangeTrackSinger = function(dom) {
    document.getElementsByName('coverLaySinger')[0].innerHTML = dom.value;
};

var onChangeTrackExtraText = function(dom) {
    document.getElementsByName('coverLayExtraText')[0].innerHTML = dom.value;
};