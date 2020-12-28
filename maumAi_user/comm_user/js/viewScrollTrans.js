// JavaScript Document

//scroll event
var wrapOffset = $('#wrap').offset();    

//scroll(위치확인)
if ($(window).scrollTop() > wrapOffset.top) {
    $('#wrap').addClass('transform');
}
if ($(window).scrollTop() > 260) {
    $('#wrap').addClass('trans');
}
//scroll(maum_sta변형)
$(window).scroll(function () {
    if ($(window).scrollTop() > wrapOffset.top) {
        $('#wrap').addClass('transform');
    } else {
        $('#wrap').removeClass('transform');
    }
});
//scroll(maum_sta변형)
$(window).scroll(function () {
    if ($(window).scrollTop() > 260) {
        $('#wrap').addClass('trans');
    } else {
        $('#wrap').removeClass('trans');
    }
});
