// MINDsLab UX/UI. NBR. 20210915

var aiccVisible = false,
    smartxVisible = false,
    minutesVisible = false,
    cloudApiVisible = false,
    maumDataVisible = false;

$(window).scroll(function(){
    sectionFigureAni();
});

// 각 영역 수치 애니메이션
function sectionFigureAni(){
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
            console.log('이것은 한글'); 
            
            if(this.count < this.target_count){
                this.timer = setTimeout(function(){self.counter();}, 40);
            }else{
                clearTimeout(this.timer);
                this.targetFigure.innerHTML =  this.targetText;
                console.log(this.targetText)
            }           
        }else if((typeKor.test(this.targetText))){
            console.log('이것은 한글'); 
            
            if(this.count < this.target_count){
                this.timer = setTimeout(function(){self.counter();}, 40);
            }else{
                clearTimeout(this.timer);
                this.targetFigure.innerHTML =  this.targetText;
                console.log(this.targetText)
            }   
        }
        else if((typeNum.test(this.targetNum))){
            console.log('이것은 숫자');

            if(this.count < this.target_count){
                this.timer = setTimeout(function(){self.counter();}, 20);
            }else{
                clearTimeout(this.timer);
            }
        }
    };

    // 각 수치 롤링 애니메이션 - 문자
    (function($){
        $.fn.shuffleLetters = function(prop){		
            var options = $.extend({
                "step"		: 10,   // How many times should the letters be changed
                "fps"		: 15,   // Frames Per Second
                "text"		: '', 			
                "callback"	: function(){}
            },prop)
            
            return this.each(function(){			
                var el = $(this),
                    str = '';

                if(el.data('animated')){
                    return true;
                }               
                el.data('animated',true);
                            
                if(options.text){
                    str = options.text.split('');
                }
                else{
                    str = el.text().split('');
                }
                
                var types = [],
                    letters = [];
                
                for(var i = 0; i < str.length; i++){				
                    var ch = str[i];				
                    letters.push(i);
                }               
                el.html('');			
		
                (function shuffle(start){							
                    var i,
                        len = letters.length, 
                        strCopy = str.slice(0);
                        
                    if(start > len){										
                        el.data('animated',false);
                        options.callback(el);
                        return;
                    }
                    
                    for(i = Math.max(start,0); i < len; i++){                       
                        if( i < start+options.step){
                            strCopy[letters[i]] = randomChar(types[letters[i]]);
                        }
                        else{
                            strCopy[letters[i]] = '';
                        }
                    }                   
                    el.text(strCopy.join(''));
                    
                    setTimeout(function(){					
                        shuffle(start + 1);					
                    }, 1000 / options.fps);               
                })(-options.step);
            });
        };
    })(jQuery);
	
    // shuffle 시킬 랜덤 문자
	function randomChar(type){
		var pool = '1234567890';	
		var arr = pool.split('');
		return arr[Math.floor(Math.random() * arr.length)];
	}

    // AICC 영역
    if(checkVisible($('.stn.aicc')) && !aiccVisible){		        
        new numberCounter('.aicc_fgr01', 768000);
        new numberCounter('.aicc_fgr02', 3600000);
        new numberCounter('.aicc_fgr03', 1000, '1억');
        new numberCounter('.aicc_fgr04', 1000, '1천만');
        // $('.aicc_fgr03').shuffleLetters('1억');
        // $('.aicc_fgr04').shuffleLetters('1천만');
        new numberCounter('.aicc_fgr05', 2300000);
        
        aiccVisible = true;
    }

    // smart X 영역
    if(checkVisible($('.stn.smartX')) && !smartxVisible){
        // $('.smartX_fgr01').shuffleLetters('수천개');
        // $('.smartX_fgr02').shuffleLetters('백만대');
        // $('.smartX_fgr03').shuffleLetters('2만여개');
        new numberCounter('.smartX_fgr01', 1000, '수천개');		
        new numberCounter('.smartX_fgr02', 1000, '백만대');		
        new numberCounter('.smartX_fgr03', 1000, '2만여개');		
        new numberCounter('.smartX_fgr04', 2000);		
        
        smartxVisible = true;
    }
    
    // maum minutes 영역
    if(checkVisible($('.stn.minutes')) && !minutesVisible){
        new numberCounter('.minutes_fgr01', 400000);
        new numberCounter('.minutes_fgr02', 276000);
        new numberCounter('.minutes_fgr03', 29000);
        
        minutesVisible = true;
    }

    // cloud API 영역
    if(checkVisible($('.stn.cloudApi')) && !cloudApiVisible){
        new numberCounter('.cloudApi_fgr01', 10000);
        new numberCounter('.cloudApi_fgr02', 1000, '수십만');
        // $('.cloudApi_fgr02').shuffleLetters('수십만');
        new numberCounter('.cloudApi_fgr03', 4500000);
        new numberCounter('.cloudApi_fgr04', 3600000);
        new numberCounter('.cloudApi_fgr05', 1000);
        
        cloudApiVisible = true;
    }

    // maum DATA 영역
    if(checkVisible($('.stn.maumData')) && !maumDataVisible){
        new numberCounter('.maumData_fgr01', 4700000);
        new numberCounter('.maumData_fgr02', 1787);
        new numberCounter('.maumData_fgr03', 1356);
        
        maumDataVisible = true;
    }
}
sectionFigureAni();

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
