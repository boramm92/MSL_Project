// MINDsLab UX/UI. NBR. 20210915

var aiccVisible = false,
    smartxVisible = false,
    minutesVisible = false,
    cloudApiVisible = false,
    maumDataVisible = false;

// $(window).scroll(function(){
//     sectionFigureAni();
// });

// 각 영역 수치 애니메이션
function sectionFigureAni(){
    // 각 수치 롤링 애니메이션
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
                this.timer = setTimeout(function(){self.counter();}, 20);
            }else{
                clearTimeout(this.timer);
                this.targetFigure.innerHTML =  this.targetText;
            }           
        }else if((typeKor.test(this.targetText))){           
            if(this.count < this.target_count){
                this.timer = setTimeout(function(){self.counter();}, 20);
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
    new numberCounter('.aicc_fgr01', 768000);
    new numberCounter('.aicc_fgr02', 3600000);
    new numberCounter('.aicc_fgr03', 1000, '1억');
    new numberCounter('.aicc_fgr04', 1000, '1천만');
    new numberCounter('.aicc_fgr05', 2300000);

    // smart X 영역
    new numberCounter('.smartX_fgr01', 5000, '수천개');		
    new numberCounter('.smartX_fgr02', 10000, '백만대');		
    new numberCounter('.smartX_fgr03', 20000, '2만여개');		
    new numberCounter('.smartX_fgr04', 2000);

    // maum minutes 영역
    new numberCounter('.minutes_fgr01', 400000);
    new numberCounter('.minutes_fgr02', 276000);
    new numberCounter('.minutes_fgr03', 29000);

    // cloud API 영역
    new numberCounter('.cloudApi_fgr01', 10000);
    new numberCounter('.cloudApi_fgr02', 100000, '수십만');
    new numberCounter('.cloudApi_fgr03', 4500000);
    new numberCounter('.cloudApi_fgr04', 3600000);
    new numberCounter('.cloudApi_fgr05', 1000);

    // maum DATA 영역
    new numberCounter('.maumData_fgr01', 4700000);
    new numberCounter('.maumData_fgr02', 1787);
    new numberCounter('.maumData_fgr03', 1356);

    // // AICC 영역
    // if(checkVisible($('.stn.aicc')) && !aiccVisible){		        
    //     new numberCounter('.aicc_fgr01', 768000);
    //     new numberCounter('.aicc_fgr02', 3600000);
    //     new numberCounter('.aicc_fgr03', 10000, '1억');
    //     new numberCounter('.aicc_fgr04', 1000, '1천만');
    //     new numberCounter('.aicc_fgr05', 2300000);
        
    //     aiccVisible = true;
    // }

    // // smart X 영역
    // if(checkVisible($('.stn.smartX')) && !smartxVisible){
    //     new numberCounter('.smartX_fgr01', 5000, '수천개');		
    //     new numberCounter('.smartX_fgr02', 10000, '백만대');		
    //     new numberCounter('.smartX_fgr03', 20000, '2만여개');		
    //     new numberCounter('.smartX_fgr04', 2000);		
        
    //     smartxVisible = true;
    // }
    
    // // maum minutes 영역
    // if(checkVisible($('.stn.minutes')) && !minutesVisible){
    //     new numberCounter('.minutes_fgr01', 400000);
    //     new numberCounter('.minutes_fgr02', 276000);
    //     new numberCounter('.minutes_fgr03', 29000);
        
    //     minutesVisible = true;
    // }

    // // cloud API 영역
    // if(checkVisible($('.stn.cloudApi')) && !cloudApiVisible){
    //     new numberCounter('.cloudApi_fgr01', 10000);
    //     new numberCounter('.cloudApi_fgr02', 100000, '수십만');
    //     new numberCounter('.cloudApi_fgr03', 4500000);
    //     new numberCounter('.cloudApi_fgr04', 3600000);
    //     new numberCounter('.cloudApi_fgr05', 1000);
        
    //     cloudApiVisible = true;
    // }

    // // maum DATA 영역
    // if(checkVisible($('.stn.maumData')) && !maumDataVisible){
    //     new numberCounter('.maumData_fgr01', 4700000);
    //     new numberCounter('.maumData_fgr02', 1787);
    //     new numberCounter('.maumData_fgr03', 1356);
        
    //     maumDataVisible = true;
    // }
}
sectionFigureAni();

setInterval(function(){
    sectionFigureAni();
    console.log('실행');
}, 4000);

// 스크롤 영역 감지
function checkVisible(elm, eval) {
    eval = eval || 'object visible';
    var viewportHalfHeight = $(window).height() / 2,
        scrolltop = $(window).scrollTop(),
        elementHalfHeight = $(elm).outerHeight() / 2,
        y = $(elm).offset().top;
    
    if(eval == 'object visible') return ((y < (viewportHalfHeight + scrolltop)) && (y > (scrolltop - elementHalfHeight)));
    if(eval == 'above') return ((y < (viewportHalfHeight + scrolltop)));
}
