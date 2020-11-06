
let audio_recorder;
let audio_context;
let audio_stream;
let sampling_rate = 16000;

let record_callback___start = null;
let record_callback___end = null;
let record_callback___cancel = null;

$(document).ready(function() {

    /* 녹음 종료 */
    playBtn.addEventListener('click', function(e) {
        // e.preventDefault();
        stopRecording();
        exportRecordData();
        closeRecordPop();

        console.log("=========================================> stop record");
    });

    /* 녹음 취소 */
    $('#pop_mic .pop_close').on('click', function () {
        stopRecording();
        clearAudio();
        closeRecordPop();

        if(record_callback___cancel != null) record_callback___cancel();
    });

});

function setRecordCallback(start_callback, end_callback, cancel_callback) {
    record_callback___start = start_callback;
    record_callback___end = end_callback;
    record_callback___cancel = cancel_callback;
}

function onClickRecord(){
    showRecordPop();

    startRecording();

    if(record_callback___start != null) record_callback___start();
}

function showRecordPop(){
    $('#pop_mic').fadeIn();
}

function closeRecordPop(){
    $('#pop_mic').fadeOut(300);
    $('body').css({
        'overflow': ''
    });
}



function setReadyAudioAPI(){
    try {
        // webkit shim
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
        window.URL = window.URL || window.webkitURL;

        audio_context = new AudioContext();
        console.log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));

    } catch (e) {
        alert("마이크를 사용할 수 없습니다.");
        closeRecordPop();
    }

    navigator.getUserMedia({audio: true}, onRecordingReady, function(e) {
        console.log('No live audio input: ' + e);
        alert("마이크를 사용할 수 없습니다.");
        closeRecordPop();
    });

}

function onRecordingReady(stream) {
    audio_stream = stream;
    let input = audio_context.createMediaStreamSource(stream);
    audio_recorder = new Recorder(input);
}

function startRecording() {
    audio_recorder && audio_recorder.record();
}

function stopRecording() {
    audio_recorder && audio_recorder.stop();
    audio_stream.getAudioTracks()[0].stop();
}

function clearAudio(){
    audio_recorder.clear();
}



function exportRecordData() {
    let AudioFormat = "audio/wav";

    audio_recorder && audio_recorder.exportMonoWAV(function (blob) {

/*======================= 여기 수정하시면 됩니다!! ============================= */

        // if(callbackAudiaRecord != null) callbackAudiaRecord('audio', blob);

        // let sample1SrcUrl = URL.createObjectURL(blob);
        // $("#AudioSource_TTS").attr("src", sample1SrcUrl);
        // $("#AudioPlayer_TTS")[0].pause();
        // $("#AudioPlayer_TTS")[0].load();
        // $("#AudioPlayer_TTS")[0].oncanplaythrough = $("#AudioPlayer_TTS")[0].play();
        // $("#AudioPlayer_TTS").off('ended').on('ended', function () {
        //     console.log("test~~~~~");
        // });

        // #AudioPlayer_TTS 오디오 필요 없으면 landingMain_Logic.jsp의 html 맨 아래쪽 오디오 제거!!

        if(record_callback___end != null) record_callback___end(blob);
/*============================================================================ */

        setReadyAudioAPI();
    }, (AudioFormat || "audio/wav"), sampling_rate);
}
