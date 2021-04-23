/* MINDsLab. NBR. 20210422 */

// header 스크롤 효과
const header = document.querySelector('#header');

function headerScrollFunc(){ 
    if (pageYOffset > 5){ 
        header.classList.add('fixed'); 
    }else{ 
        header.classList.remove('fixed'); 
    } 
} 
window.addEventListener('scroll', headerScrollFunc);

// stn - use_case 탭기능
let tabBtn = $('.tabArea .tab_lst > li');
let tabCont = $('.tabArea .tab_cont > li');

tabBtn.on('click', function(){
    var target = $(this);
    var index = target.index();
    tabBtn.removeClass('active');
    target.addClass('active');
    tabCont.removeClass('active');
    tabCont.eq(index).addClass('active');
});

let subBtn = $('.sub_lst li');
let subCont = $('.sub_cont li');

subBtn.on('click', function(){
    var target = $(this);
    var index = target.index();
    subBtn.removeClass('active');font
    target.addClass('active');
    subCont.removeClass('active');
    subCont.eq(index).addClass('active');
});
