$(document).ready(function(){
    function stickyEffect(){
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

                if(boundingRect.top > window.innerHeight * 0.4 && boundingRect.top < window.innerHeight * 0.6){
                    inactivate();
                    currentStickyItem = allStickyItem[stickyItem.dataset.index];
                    activate();
                }
            }
        });

        activate();
    }

    if($(window).outerWidth() > 768){
        stickyEffect();
    }else{
        return false;
    }
});

$(window).resize(function(){
    function stickyEffect(){
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

                if(boundingRect.top > window.innerHeight * 0.4 && boundingRect.top < window.innerHeight * 0.6){
                    inactivate();
                    currentStickyItem = allStickyItem[stickyItem.dataset.index];
                    activate();
                }
            }
        });

        activate();
    }

    if($(window).outerWidth() > 768){
        stickyEffect();
    }else{
        return false;
    }
})
