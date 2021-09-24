// MINDsLab UX/UI. NBR. 20210915

var visualVisible = false,
    aiccVisible = false,
    smartxVisible = false,
    minutesVisible = false,
    cloudApiVisible = false,
    maumDataVisible = false;

window.scrollPosition = document.documentElement.scrollTop || 0;

$(window).scroll(function(){
    sectionFigureAni();
});

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

    // 스크롤 방향 감지
    var documentY = document.documentElement.scrollTop;
    var direction = documentY - window.scrollPosition >= 0 ? 1 : -1;

    window.scrollPosition = documentY; // Update scrollY

    // visual 영역
    // if(checkVisible2($('.stn.visual')) && !visualVisible){	
    //     console.log('visual');

    //     $('.stn').removeClass('on');
    //     visualVisible = true;         
    // }

    // AICC 영역
    if(checkVisible($('.stn.aicc')) && !aiccVisible && direction == 1){	
        console.log('aicc');

        $('.stn').removeClass('on');
        $('.stn.aicc').addClass('on');	        
        new numberCounter('.aicc_fgr01', 768000);
        new numberCounter('.aicc_fgr02', 3600000);
        new numberCounter('.aicc_fgr03', 10000, '1억');
        new numberCounter('.aicc_fgr04', 1000, '1천만');
        new numberCounter('.aicc_fgr05', 2300000); 
        aiccVisible = true;         
    }else if(!checkVisible2($('.stn.aicc')) && direction == -1){
        $('.stn.aicc').removeClass('on');
        aiccVisible = false;
    }
    if(checkVisible2($('.stn.aicc')) && !aiccVisible && direction == -1){
        console.log('aicc');

        $('.stn').removeClass('on');
        $('.stn.aicc').addClass('on');	        
        new numberCounter('.aicc_fgr01', 768000);
        new numberCounter('.aicc_fgr02', 3600000);
        new numberCounter('.aicc_fgr03', 10000, '1억');
        new numberCounter('.aicc_fgr04', 1000, '1천만');
        new numberCounter('.aicc_fgr05', 2300000); 
        aiccVisible = true;  
    }else if(!checkVisible2($('.stn.aicc')) && direction == -1){
        $('.stn.aicc').removeClass('on');
        aiccVisible = false;
    }

    // smart X 영역
    if(checkVisible($('.stn.smartX')) && !smartxVisible && direction == 1){
        console.log('smartX');

        $('.stn').removeClass('on');
        $('.stn.smartX').addClass('on');	 
        new numberCounter('.smartX_fgr01', 5000, '수천개');		
        new numberCounter('.smartX_fgr02', 10000, '백만대');		
        new numberCounter('.smartX_fgr03', 20000, '2만여개');		
        new numberCounter('.smartX_fgr04', 2000);		       
        smartxVisible = true;        
    }else if(!checkVisible2($('.stn.smartX')) && direction == -1){
        $('.stn.smartX').removeClass('on');
        smartxVisible = false;
    }
    if(checkVisible2($('.stn.smartX')) && !smartxVisible && direction == -1){
        console.log('smartX');

        $('.stn').removeClass('on');
        $('.stn.smartX').addClass('on');	 
        new numberCounter('.smartX_fgr01', 5000, '수천개');		
        new numberCounter('.smartX_fgr02', 10000, '백만대');		
        new numberCounter('.smartX_fgr03', 20000, '2만여개');		
        new numberCounter('.smartX_fgr04', 2000);		       
        smartxVisible = true;      
    }else if(!checkVisible2($('.stn.smartX')) && direction == -1){
        $('.stn.smartX').removeClass('on');
        smartxVisible = false;
    }
    
    // maum minutes 영역
    if(checkVisible($('.stn.minutes')) && !minutesVisible && direction == 1){
        console.log('minutes');

        $('.stn').removeClass('on');
        $('.stn.minutes').addClass('on');	 
        new numberCounter('.minutes_fgr01', 400000);
        new numberCounter('.minutes_fgr02', 276000);
        new numberCounter('.minutes_fgr03', 29000);        
        minutesVisible = true;       
    }else if(!checkVisible2($('.stn.minutes')) && direction == -1){
        $('.stn.minutes').removeClass('on');
        minutesVisible = false;
    }
    if(checkVisible2($('.stn.minutes')) && !minutesVisible && direction == -1){
        console.log('minutes');

        $('.stn').removeClass('on');
        $('.stn.minutes').addClass('on');	 
        new numberCounter('.minutes_fgr01', 400000);
        new numberCounter('.minutes_fgr02', 276000);
        new numberCounter('.minutes_fgr03', 29000);        
        minutesVisible = true;   
    }else if(!checkVisible2($('.stn.minutes')) && direction == -1){
        $('.stn.minutes').removeClass('on');
        minutesVisible = false;
    }

    // cloud API 영역
    if(checkVisible($('.stn.cloudApi')) && !cloudApiVisible && direction == 1){
        console.log('cloudApi');

        $('.stn').removeClass('on');
        $('.stn.cloudApi').addClass('on');	 
        new numberCounter('.cloudApi_fgr01', 10000);
        new numberCounter('.cloudApi_fgr02', 100000, '수십만');
        new numberCounter('.cloudApi_fgr03', 4500000);
        new numberCounter('.cloudApi_fgr04', 3600000);
        new numberCounter('.cloudApi_fgr05', 1000);       
        cloudApiVisible = true;        
    }else if(!checkVisible2($('.stn.cloudApi')) && direction == -1){
        $('.stn.cloudApi').removeClass('on');
        cloudApiVisible = false;
    }
    if(checkVisible2($('.stn.cloudApi')) && !cloudApiVisible && direction == -1){
        console.log('cloudApi');

        $('.stn').removeClass('on');
        $('.stn.cloudApi').addClass('on');	 
        new numberCounter('.cloudApi_fgr01', 10000);
        new numberCounter('.cloudApi_fgr02', 100000, '수십만');
        new numberCounter('.cloudApi_fgr03', 4500000);
        new numberCounter('.cloudApi_fgr04', 3600000);
        new numberCounter('.cloudApi_fgr05', 1000);       
        cloudApiVisible = true;
    }else if(!checkVisible2($('.stn.cloudApi')) && direction == -1){
        $('.stn.cloudApi').removeClass('on');
        cloudApiVisible = false;
    }

    // maum DATA 영역
    if(checkVisible($('.stn.maumData')) && !maumDataVisible && direction == 1){
        console.log('maumData');

        $('.stn').removeClass('on');
        $('.stn.maumData').addClass('on');	 
        new numberCounter('.maumData_fgr01', 4700000);
        new numberCounter('.maumData_fgr02', 1787);
        new numberCounter('.maumData_fgr03', 1356);        
        maumDataVisible = true;
    }else if(!checkVisible2($('.stn.maumData')) && direction == -1){
        $('.stn.maumData').removeClass('on');
        maumDataVisible = false;
    }
    if(checkVisible2($('.stn.maumData')) && !maumDataVisible && direction == -1){
        console.log('maumData');

        $('.stn').removeClass('on');
        $('.stn.maumData').addClass('on');	 
        new numberCounter('.maumData_fgr01', 4700000);
        new numberCounter('.maumData_fgr02', 1787);
        new numberCounter('.maumData_fgr03', 1356);        
        maumDataVisible = true;
    }else if(!checkVisible2($('.stn.maumData')) && direction == -1){
        $('.stn.maumData').removeClass('on');
        maumDataVisible = false;
    }
}
sectionFigureAni();

// 스크롤 영역 감지
function checkVisible(elm, eval) {
    eval = eval || 'object visible';
    var viewportHalfHeight = $(window).height() / 2,
        scrolltop = $(window).scrollTop(),
        elementHalfHeight = $(elm).outerHeight() / 2,
        offsetY = $(elm).offset().top + (elementHalfHeight / 2);
        // offsetY = $(elm).offset().top;

        // console.log(viewportHalfHeight, offsetY)
    
    // if(eval == 'object visible') return ((offsetY < (viewportHalfHeight + scrolltop)) && (offsetY > (scrolltop - elementHalfHeight)));
    if(eval == 'object visible') return ((offsetY < (viewportHalfHeight + scrolltop)) && (offsetY > (scrolltop - elementHalfHeight)));
    if(eval == 'above') return ((offsetY < (viewportHalfHeight + scrolltop)));
}

function checkVisible2(elm, eval) {
    eval = eval || 'object visible';
    var viewportHeight = $(window).height() / 2,
        scrolltop = $(window).scrollTop(),
        elementHeight = $(elm).outerHeight(),
        offsetY = $(elm).offset().top - elementHeight,
        positionY = $(elm).position().top;

        // console.log(offsetY, positionY)
    
    if(eval == 'object visible') return ((offsetY < (viewportHeight + scrolltop)) && (offsetY > (scrolltop - elementHeight)));
    if(eval == 'above') return ((offsetY < (viewportHeight + scrolltop)));
}

