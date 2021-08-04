$(document).ready(function(){
    var allTxtItem = document.querySelectorAll('.txt_item');
    var allImgItem = document.querySelectorAll('.img_item');
    var currentImgItem = allImgItem[0];

    for(var i = 0; i < allTxtItem.length; i++){
        allTxtItem[i].dataset.index = i;
        allImgItem[i].dataset.index = i;
    }

    function activate(){
        currentImgItem.classList.add('visible');
    }

    function inactivate(){
        currentImgItem.classList.remove('visible');
    }

    window.addEventListener('scroll', function(){
        var txtItem;
        var boundingRect;

        for(var i = 0; i < allTxtItem.length; i++){
            txtItem = allTxtItem[i];
            boundingRect = txtItem.getBoundingClientRect();

            if(boundingRect.top > window.innerHeight * 0.2 && boundingRect.top < window.innerHeight * 0.8){
                inactivate();
                currentImgItem = allImgItem[txtItem.dataset.index];
                activate();
            }
        }
    });

    activate();
});