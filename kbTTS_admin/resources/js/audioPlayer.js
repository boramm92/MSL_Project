/* MINDsLab. NBR. 20211214 */
$(document).ready(function(){
    var audio = document.querySelector('.audio'),
        playerBar = $('.player_bar'),
        playerSliderBar = $('.player_bar .slider_bar'),
        playBtn = $('.btn_play'),
        pauseBtn = $('.btn_play.pause'),
        current = $('.player_time.current'),
        duration = $('.player_time.duration');

    // 재생, 일시정지 
    function togglePlay() {        
        $(this).toggleClass('pause');

        if($(this).is('.pause')){
            audio.play();
            $(this).find('span').text('일시 정지');
        }else{
            audio.pause();
            $(this).find('span').text('재생');
        }
    }

    // 비디오 시간 세팅
    function timeFormat(seconds){
        var m = Math.floor(seconds / 60) < 10
            ? '0' + Math.floor(seconds / 60)
            : Math.floor(seconds / 60);
        var s = Math.floor(seconds - m * 60) < 10
            ? '0' + Math.floor(seconds - m * 60)
            : Math.floor(seconds - m * 60);
        return m + ':' + s;
    }

    // 재생중 바 업데이트
    function updatebar(x){
        position = x - playerSliderBar.offset().left;
        percentage = 100 * position / playerBar.width();
        if(percentage > 100){
            percentage = 100;
        }
        if(percentage < 0){
            percentage = 0;
        }
        playerSliderBar.css('width', percentage + '%');
        audio.currentTime = audio.duration * percentage / 100;
    }

    // 비디오 시간 초기입력
    audio.addEventListener('loadedmetadata', function(){
        current.text(timeFormat(0));
        duration.text(timeFormat(audio.duration));
    });

    // 재생 버튼 클릭 시
    playBtn.on('click', togglePlay);

    // 비디오 시간 업데이트
    audio.addEventListener('timeupdate', function(){
        current.text(timeFormat(audio.currentTime));
        duration.text(timeFormat(audio.duration));
        var currentPos = audio.currentTime;
        var maxduration = audio.duration;
        var perc = 100 * audio.currentTime / audio.duration;

        playerSliderBar.css('width', perc + '%');
        if(perc == 100){
            playBtn.removeClass('pause');
        }
    });

    // 비디오 바 드래그 시
    var timeDrag = false;

    playerBar.on('mousedown', function(e){
        timeDrag = true;
        updatebar(e.pageX);
    });
    $(document).on('mouseup', function(e){
        if(timeDrag){
            timeDrag = false;
            updatebar(e.pageX);
        }
    });
    $(document).on('mousemove', function(e){
        if(timeDrag){
            updatebar(e.pageX);
        }
    });    
});