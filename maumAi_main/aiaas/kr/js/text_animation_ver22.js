// MINDsLab UX/UI. NBR. 20210915

// var aiccVisible = false,
//     smartxVisible = false,
//     minutesVisible = false,
//     cloudApiVisible = false,
//     maumDataVisible = false;

// $(window).scroll(function(){
//     sectionFigureAni();
// });

// // 각 영역 수치 애니메이션
// function sectionFigureAni(){
//     // 각 수치 롤링 애니메이션 - 숫자
//     function numberCounter(targetFigure, targetNum, targetText){
//         this.count = 0; this.diff = 0;
//         this.targetNum = targetNum;
//         this.targetText = targetText;
//         this.target_count = parseInt(targetNum);
//         this.targetFigure = document.querySelector(targetFigure);
//         this.timer = null;
//         this.counter();        
//     };

//     numberCounter.prototype.counter = function(){
//         var self = this;      
        
//         var typeNum = /[0-9]/;
//         var typeKor = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;

//         this.diff = this.target_count - this.count;
        
//         if(this.diff > 0){
//             self.count += Math.ceil(this.diff / 5);
//         }
        
//         this.targetFigure.innerHTML = this.count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

//         if((typeKor.test(this.targetText)) && (typeNum.test(this.targetText))){           
//             if(this.count < this.target_count){
//                 this.timer = setTimeout(function(){self.counter();}, 40);
//             }else{
//                 clearTimeout(this.timer);
//                 this.targetFigure.innerHTML =  this.targetText;
//             }           
//         }else if((typeKor.test(this.targetText))){            
//             if(this.count < this.target_count){
//                 this.timer = setTimeout(function(){self.counter();}, 40);
//             }else{
//                 clearTimeout(this.timer);
//                 this.targetFigure.innerHTML =  this.targetText;
//             }   
//         }
//         else if((typeNum.test(this.targetNum))){
//             if(this.count < this.target_count){
//                 this.timer = setTimeout(function(){self.counter();}, 20);
//             }else{
//                 clearTimeout(this.timer);
//             }
//         }
//     };

//     // AICC 영역
//     if(checkVisible($('.stn.aicc')) && !aiccVisible){     
//         setTimeout(function(){
//             $('.stn.aicc').addClass('on');
//             new numberCounter('.aicc.on .aicc_fgr01', 768000);
//             new numberCounter('.aicc.on .aicc_fgr02', 3600000);
//             new numberCounter('.aicc.on .aicc_fgr03', 1000, '1억');
//             new numberCounter('.aicc.on .aicc_fgr04', 1000, '1천만');
//             new numberCounter('.aicc.on .aicc_fgr05', 2300000);
//             aiccVisible = true;
//         });        
//     }else if(!checkVisible2($('.stn.aicc'))){
//         $('.stn.aicc').removeClass('on');
//         aiccVisible = false;
//     }

//     // smart X 영역
//     if(checkVisible($('.stn.smartX')) && !smartxVisible){
//         setTimeout(function(){
//             $('.stn.smartX').addClass('on');
//             new numberCounter('.smartX.on .smartX_fgr01', 3000, '수천개');		
//             new numberCounter('.smartX.on .smartX_fgr02', 1800, '백만대');		
//             new numberCounter('.smartX.on .smartX_fgr03', 2000, '2만여개');		
//             new numberCounter('.smartX.on .smartX_fgr04', 2000);
//             smartxVisible = true;
//         });        
//     }else if(!checkVisible2($('.stn.smartX'))){
//         $('.stn.smartX').removeClass('on');
//         smartxVisible = false;
//     }
    
//     // maum minutes 영역
//     if(checkVisible($('.stn.minutes')) && !minutesVisible){
//         setTimeout(function(){
//             $('.stn.minutes').addClass('on');
//             new numberCounter('.minutes.on .minutes_fgr01', 400000);
//             new numberCounter('.minutes.on .minutes_fgr02', 276000);
//             new numberCounter('.minutes.on .minutes_fgr03', 29000);
//             minutesVisible = true;
//         });       
//     }else if(!checkVisible2($('.stn.minutes'))){
//         $('.stn.minutes').removeClass('on');
//         minutesVisible = false;
//     }

//     // cloud API 영역
//     if(checkVisible($('.stn.cloudApi')) && !cloudApiVisible){
//         setTimeout(function(){
//             $('.stn.cloudApi').addClass('on');
//             new numberCounter('.cloudApi.on .cloudApi_fgr01', 10000);
//             new numberCounter('.cloudApi.on .cloudApi_fgr02', 100000, '수십만');
//             new numberCounter('.cloudApi.on .cloudApi_fgr03', 4500000);
//             new numberCounter('.cloudApi.on .cloudApi_fgr04', 3600000);
//             new numberCounter('.cloudApi.on .cloudApi_fgr05', 1000);
//             cloudApiVisible = true;
//         });        
//     }else if(!checkVisible2($('.stn.cloudApi'))){
//         $('.stn.cloudApi').removeClass('on');
//         cloudApiVisible = false;
//     }

//     // maum DATA 영역
//     if(checkVisible($('.stn.maumData')) && !maumDataVisible){
//         setTimeout(function(){
//             $('.stn.maumData').addClass('on');
//             new numberCounter('.maumData.on .maumData_fgr01', 4700000);
//             new numberCounter('.maumData.on .maumData_fgr02', 1787);
//             new numberCounter('.maumData.on .maumData_fgr03', 1356);
//             maumDataVisible = true;
//         });       
//     }else if(!checkVisible2($('.stn.maumData'))){
//         $('.stn.maumData').removeClass('on');
//         maumDataVisible = false;
//     }
// }
// sectionFigureAni();

// // 스크롤 영역 감지
// function checkVisible(elm, eval) {
//     eval = eval || 'object visible';
//     var viewportHalfHeight = $(window).height() / 2,
//         scrolltop = $(window).scrollTop(),
//         elementHalfHeight = $(elm).outerHeight() / 2,
//         y = $(elm).offset().top;
    
//     if(eval == 'object visible') return ((y < (viewportHalfHeight + scrolltop)) && (y > (scrolltop - elementHalfHeight)));
//     if(eval == 'above') return ((y < (viewportHalfHeight + scrolltop)));
// }

// function checkVisible2(elm, eval) {
//     eval = eval || 'object visible';
//     var viewportHeight = $(window).height(),
//         scrolltop = $(window).scrollTop(),
//         elementHeight = $(elm).outerHeight(),
//         y = $(elm).offset().top;
    
//     if(eval == 'object visible') return ((y < (viewportHeight + scrolltop)) && (y > (scrolltop - elementHeight)));
//     if(eval == 'above') return ((y < (viewportHeight + scrolltop)));
// }








function hasScrolled(){
    var wS = scrollTop = document.documentElement.scrollTop || document.body.scrollTop,
        divStn = document.getElementById("wrap").getElementsByClassName("stn"),
        viewportHeight = document.documentElement.clientHeight,
        scrollH = document.documentElement.scrollHeight - document.documentElement.clientHeight;

    for(var i = 0; i < divStn.length; i++){
        var elm = divStn[i];
            pos        = elm.getBoundingClientRect(),
            topPerc    = pos.top / viewportHeight * 100,
            bottomPerc = pos.bottom / viewportHeight * 100,
            middle     = (topPerc + bottomPerc) / 2,
            inViewport = middle > 25 && middle < (100 - 25);

        if (inViewport) {
            if(elm.className.indexOf('active') == -1){
                elm.classList.add("active"); 
                var stnName = elm.getAttribute("name");
            } 
        }else{
            elm.classList.remove("active");
        }
    }
    
    if(wS === 0){ 
        divStn[0].classList.add("active");
        var stnName = divStn[0].getAttribute("name");
    }
            
    if(wS === scrollH){
        if(divStn[divStn.length - 1].className.indexOf('active') == -1){
            divStn[divStn.length - 1].classList.add("active");
            var stnName = divStn[divStn.length - 1].getAttribute("name");
        } 
    }

    // 각 수치 롤링 애니메이션 - 숫자
    function numberCounter(targetFigure, targetNum, targetText){
        this.count = 0; this.diff = 0;
        this.targetNum = targetNum;
        this.targetText = targetText;
        this.target_count = parseInt(targetNum);
        this.targetFigure = document.querySelector(targetFigure);
        this.timer = null;
        this.counter();        
    };

    numberCounter.prototype.counter = function(){
        var self = this;      
        
        var typeNum = /[0-9]/;
        var typeKor = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;

        this.diff = this.target_count - this.count;
        
        if(this.diff > 0){
            self.count += Math.ceil(this.diff / 5);
        }
        
        this.targetFigure.innerHTML = this.count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        if((typeKor.test(this.targetText)) && (typeNum.test(this.targetText))){           
            if(this.count < this.target_count){
                this.timer = setTimeout(function(){self.counter();}, 40);
            }else{
                clearTimeout(this.timer);
                this.targetFigure.innerHTML =  this.targetText;
            }           
        }else if((typeKor.test(this.targetText))){            
            if(this.count < this.target_count){
                this.timer = setTimeout(function(){self.counter();}, 40);
            }else{
                clearTimeout(this.timer);
                this.targetFigure.innerHTML =  this.targetText;
            }   
        }
        else if((typeNum.test(this.targetNum))){
            if(this.count < this.target_count){
                this.timer = setTimeout(function(){self.counter();}, 20);
            }else{
                clearTimeout(this.timer);
            }
        }
    };

    // AICC 영역
    if($('.stn.aicc').hasClass('active')){     
        new numberCounter('.aicc_fgr01', 768000);
        new numberCounter('.aicc_fgr02', 3600000);
        new numberCounter('.aicc_fgr03', 1000, '1억');
        new numberCounter('.aicc_fgr04', 1000, '1천만');
        new numberCounter('.aicc_fgr05', 2300000);
        aiccVisible = true;     
    }else{
        aiccVisible = false;
    }

    // smart X 영역
    if($('.stn.smartX').hasClass('active')){
        new numberCounter('.smartX_fgr01', 3000, '수천개');		
        new numberCounter('.smartX_fgr02', 1800, '백만대');		
        new numberCounter('.smartX_fgr03', 2000, '2만여개');		
        new numberCounter('.smartX_fgr04', 2000);
        smartxVisible = true;     
    }else{
        smartxVisible = false;
    }
    
    // maum minutes 영역
    if($('.stn.minutes').hasClass('active')){
        new numberCounter('.minutes_fgr01', 400000);
        new numberCounter('.minutes_fgr02', 276000);
        new numberCounter('.minutes_fgr03', 29000);
        minutesVisible = true;     
    }else{
        minutesVisible = false;
    }

    // cloud API 영역
    if($('.stn.cloudApi').hasClass('active')){
        new numberCounter('.cloudApi_fgr01', 10000);
        new numberCounter('.cloudApi_fgr02', 100000, '수십만');
        new numberCounter('.cloudApi_fgr03', 4500000);
        new numberCounter('.cloudApi_fgr04', 3600000);
        new numberCounter('.cloudApi_fgr05', 1000);
        cloudApiVisible = true;       
    }else{
        cloudApiVisible = false;
    }

    // maum DATA 영역
    if($('.stn.maumData').hasClass('active')){
        new numberCounter('.maumData_fgr01', 4700000);
        new numberCounter('.maumData_fgr02', 1787);
        new numberCounter('.maumData_fgr03', 1356);
        maumDataVisible = true;     
    }else{
        maumDataVisible = false;
    }
}

document.addEventListener("DOMContentLoaded", function(){
    var didScroll;
    var Timer;

    document.addEventListener('scroll', function() {
        didScroll = true;
        if (Timer) window.clearTimeout(Timer);
        Timer = window.setTimeout(function() {
            if(didScroll){
                hasScrolled();
                didScroll = false;
            }
        }, 200);
    });
});
