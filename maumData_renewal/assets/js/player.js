/* MINDsLab. NBR. 20210604 */
$(document).ready(function(){
    var video = document.querySelector('.video'),
        playerBar = $('.player_bar'),
        playerSliderBar = $('.player_bar .slider_bar'),
        playerBufferBar = $('.player_bar .buffer_bar'),
        playBtn = $('.btn_play'),
        pauseBtn = $('.btn_play.pause'),
        rewindBtn = $('.btn_rewind'),
        fastFowardBtn = $('.btn_fastFoward'),
        volumeBtn = $('.btn_volume'),
        volumeBar = $('.volume_bar'),
        volumeSliderBar = $('.volume_bar .slider_bar'),
        current = $('.player_time .current'),
        duration = $('.player_time .duration'),
        speedBtn = $('.btn_speed'),
        repeatBtn = $('.btn_repeat');

    // play, pause button func
    function togglePlay() {
        var method = video.paused ? 'play' : 'pause'; // 비디오 재생 상태에 따른 메소드 호출
        video[method]();
        $(this).toggleClass('pause');
    }

    // volume update func
    function updateVolume(x, vol) {
        if(vol){
            percentage = vol * 100;
        }else{
            position = x - volumeBar.offset().left;
            percentage = 100 * position / volumeBar.width();
        }

        if(percentage > 100){
            percentage = 100;
        }

        if(percentage < 0){
            percentage = 0;
        }

        // update volume bar and video volume
        volumeSliderBar.css('width', percentage + '%');
        video.volume = percentage / 100;

        if(video.volume == 0){
            volumeBtn.removeClass('down').addClass('mute');
        }else if(video.volume > 0.5){
            volumeBtn.removeClass('mute').removeClass('down');
        }else{
            volumeBtn.removeClass('mute').addClass('down');                
        }
    }

    // video time format func
    function timeFormat(seconds){
        var m = Math.floor(seconds / 60) < 10
            ? '0' + Math.floor(seconds / 60)
            : Math.floor(seconds / 60);
        var s = Math.floor(seconds - m * 60) < 10
            ? '0' + Math.floor(seconds - m * 60)
            : Math.floor(seconds - m * 60);
        return m + ':' + s;
    }

    function startBuffer(){
        current_buffer = video.buffered.end(0);
        max_duration = video.duration;
        perc = 100 * current_buffer / max_duration;
        playerBufferBar.css('width', perc + '%');

        if(current_buffer < max_duration){
            setTimeout(startBuffer, 500);
        }
    }

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
        video.currentTime = video.duration * percentage / 100;
    }

    video.addEventListener('loadedmetadata', function(){
        current.text(timeFormat(0));
        duration.text(timeFormat(video.duration));
        updateVolume(0, 1);
        setTimeout(startBuffer, 150);
    });

    // Video Play
    playBtn.on('click', togglePlay);

    // Video duration timer
    video.addEventListener('timeupdate', function(){
        current.text(timeFormat(video.currentTime));
        duration.text(timeFormat(video.duration));
        var currentPos = video.currentTime;
        var maxduration = video.duration;
        var perc = 100 * video.currentTime / video.duration;
        playerSliderBar.css('width', perc + '%');
    });

    // Video Bar Drag
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

    // Volume Bar Drag
    var volumeDrag = false;

    volumeBar.on('mousedown', function(e){
        volumeDrag = true;
        video.muted = false;
        volumeBtn.removeClass('mute');
        updateVolume(e.pageX);
    }); 
    $(document).on('mouseup', function(e){
        if(volumeDrag){
            volumeDrag = false;
            updateVolume(e.pageX);
        }
    }) 
    $(document).on('mousemove', function(e){
        if(volumeDrag){
            updateVolume(e.pageX);
        }
    });

    // Volume Drag
    volumeBtn.on('click', function(){
        video.muted = !video.muted;
        $(this).toggleClass('mute');
        if(video.muted){
            volumeSliderBar.css('width', 0);
        }else{
            volumeSliderBar.css('width', video.volume * 100 + '%');
        }
    });

    repeatBtn.on('click', function(){
        $(this).toggleClass('on');

        if($(this).is('on')){
            // video.removeAttribute(loop);
        }else{
            video.prop('loop', true);
        }
    }); 
});

  

