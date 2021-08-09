$(document).ready(function(){
    var allIndexItem = document.querySelectorAll('.index_item');
    var allStickyItem = document.querySelectorAll('.scroll_item');
    var currentStickyItem = allStickyItem[0];

    for(var i = 0; i < allIndexItem.length; i++){
        allIndexItem[i].dataset.index = i;
        allStickyItem[i].dataset.index = i;
    }

    function activate(){       
        currentStickyItem.classList.add('visible');       
    }

    function inactivate(){
        currentStickyItem.classList.remove('visible'); 
    }

    window.addEventListener('scroll', function(){
        var stickyItem;
        var boundingRect;

        for(var i = 0; i < allIndexItem.length; i++){
            stickyItem = allIndexItem[i];
            boundingRect = stickyItem.getBoundingClientRect();
            scrollAreaBoundingRect = scrollArea.getBoundingClientRect();

            if(boundingRect.top > window.innerHeight * 0.1 && boundingRect.top < window.innerHeight * 0.9){
                inactivate();
                currentStickyItem = allStickyItem[stickyItem.dataset.index];
                activate();  
            }

            // console.log(window.pageYOffset, window.pageYOffset + scrollAreaBoundingRect.top);

            // console.log(currentStickyItem.getBoundingClientRect().top)
            
            // if(window.pageYOffset >= window.pageYOffset + scrollAreaBoundingRect.top){
            //     scrollArea.classList.add('fixed');                
            // }
            // if(window.pageYOffset + currentStickyItem.getBoundingClientRect().top > 3900){
            //     console.log('마지막 영역이다', boundingRect.top)
            //     scrollArea.classList.remove('fixed');
            // }  
        }
    });
    activate();

    // if(document.currentScript === undefined){
    //     // IE 에서만 돌아갈 내용
    // }
});        


