/*
** maum.ai 어시스턴트
*/


/* 플로우는 세 종류의 셋으로 구성된다. */
const FLOW___TTS = 0;
const FLOW___TEXT_INPUT = 1;
const FLOW___VOICE_INPUT = 2;
let flows = new Array();
let mvpHandlers = new Array();

let active_flow_no;

/* 보안 되어야 할 정보 */
const API_ID = "belsnake";
const API_KEY = "1361c4d017e84ec6836c0bb7e1230c62";


/* 시작 할 때, TTS로 재생할 인트로 메세지 */
const INTRO_MESSAGE = 'maum.ai는 마인즈랩의 다양한 엔진들을 경험해보고 사용이 가능한 인공지능 플랫폼입니다.';


/* 초기화: 빠른 로딩 */
(function () {
    if(url___mvp_maker == 'https://stg-builder.maum.ai') {
        loadFlow(flows, FLOW___TTS, 12);
        loadFlow(flows, FLOW___TEXT_INPUT, 13);
        loadFlow(flows, FLOW___VOICE_INPUT, 14);
    }
    else if(url___mvp_maker == 'https://builder.maum.ai') {
        loadFlow(flows, FLOW___TTS, 17);
        loadFlow(flows, FLOW___TEXT_INPUT, 18);
        loadFlow(flows, FLOW___VOICE_INPUT, 19);
    }
    else {
        loadFlow(flows, FLOW___TTS, 1014);
        loadFlow(flows, FLOW___TEXT_INPUT, 1015);
        loadFlow(flows, FLOW___VOICE_INPUT, 1016);
    }



})();



/* 초기화: 사전 로딩된 데이타를 기반으로 초기화 작업 */
$(document).ready(function () {
    mvpHandlers[FLOW___TTS] = new mvpClientHandler(API_ID, API_KEY, flows[FLOW___TTS]);
    mvpHandlers[FLOW___TTS].setOnAfterEngine(onAfterEngine_TTS);
    mvpHandlers[FLOW___TTS].setOnBeforeEngine(onBeforeEngine);

    mvpHandlers[FLOW___TEXT_INPUT] = new mvpClientHandler(API_ID, API_KEY, flows[FLOW___TEXT_INPUT]);
    mvpHandlers[FLOW___TEXT_INPUT].setOnAfterEngine(onAfterEngine_Sully);
    mvpHandlers[FLOW___TEXT_INPUT].setOnBeforeEngine(onBeforeEngine);

    mvpHandlers[FLOW___VOICE_INPUT] = new mvpClientHandler(API_ID, API_KEY, flows[FLOW___VOICE_INPUT]);
    mvpHandlers[FLOW___VOICE_INPUT].setOnAfterEngine(onAfterEngine_Sully);
    mvpHandlers[FLOW___VOICE_INPUT].setOnBeforeEngine(onBeforeEngine);
    mvpHandlers[FLOW___VOICE_INPUT].setOnError(onError);

    setRecordCallback(cbStartRecord, cbEndRecord, null);

    $('#Input_User').focus(focusInput);
    $('#Input_User').keyup(enterInput);
});

/* 사용자 입력에 Focus-In 되었을 때 */
function focusInput() {
    activeFlow(FLOW___TEXT_INPUT);
}

/* 사용자 입력에 Focus-In 되었을 때 */
function enterInput(e) {
    if(e.keyCode != 13) return;

    stopAudio();
    if($('#Input_User').val().trim().length == 0) return;

    addMessage_User($('#Input_User').val().trim());
    mvpHandlers[FLOW___TEXT_INPUT].start($('#Input_User').val().trim());
    $('#Input_User').val('');
}


/*
** 페이지 시작:
**     - 차후엔 ready() 시에 호출 (지금은 봇선택 화면과 동일한 페이지임)
*/
function startMaumAI() {
    clearChats();
    clearFlowUi();

    mvpHandlers[FLOW___TTS].start(INTRO_MESSAGE);

    addFlowUi(flows[FLOW___TEXT_INPUT], FLOW___TEXT_INPUT);
    addFlowUi(flows[FLOW___TTS], FLOW___TTS);
    addFlowUi(flows[FLOW___VOICE_INPUT], FLOW___VOICE_INPUT);

    activeFlow(FLOW___TEXT_INPUT);
    // activeEngineUi(FLOW___TTS, 0);

    introMessage();
}

function introMessage() {
    addMessage_Bot("maum.ai에 대해 궁금하신가요?");

    let intro_keywords = [ '서비스 소개', '회사 소개', '가격', '사용법', '마음에이아이가 뭐예요?'];
    addButtons(intro_keywords);
}

function activeFlow(flow_no) {
    hideFlowUi(FLOW___TTS);
    hideFlowUi(FLOW___TEXT_INPUT);
    hideFlowUi(FLOW___VOICE_INPUT);

    showFlowUi(flow_no);
    for(let xx = 0; xx < flows[flow_no].nodeList.length; xx++) {
        inactiveEngineUi(flow_no, xx);
        inactiveResultUi(flow_no, xx);
    }

    active_flow_no = flow_no;
}

/* ===================================================================================================================== */
// AI SPEECH
/* ===================================================================================================================== */

function speechAI(message, audio) {
    if(message != null) displayAIMessage(message);

    if(audio == null) {
        mvpHandlers[FLOW___TTS].start(message);
    }
    else {
        let sample1SrcUrl = URL.createObjectURL(audio);
        $("#AudioSource_TTS").attr("src", sample1SrcUrl);
        $("#AudioPlayer_TTS")[0].pause();
        $("#AudioPlayer_TTS")[0].load();
        $("#AudioPlayer_TTS")[0].oncanplaythrough = $("#AudioPlayer_TTS")[0].play();
    }

}


/* ===================================================================================================================== */
// 음성 입력
/* ===================================================================================================================== */

function cbStartRecord() {
    activeFlow(FLOW___VOICE_INPUT);
    stopAudio();
}

/* 녹음된 blob data */
function cbEndRecord(data) {
    mvpHandlers[FLOW___VOICE_INPUT].start(data);
}

/* ===================================================================================================================== */
// 오디오 제어
/* ===================================================================================================================== */

function stopAudio() {
    mvpHandlers[FLOW___TTS].cancel();
    $("#AudioPlayer_TTS")[0].pause();
}



/* ===================================================================================================================== */
// TTS FLOW 용 이벤트
/* ===================================================================================================================== */

function onAfterEngine_TTS(handler, node_index, data_type, data) {
    console.log("=======================================> onAfterEngine_TTS");
    console.dir(data);

    let sample1SrcUrl = URL.createObjectURL(data);
    $("#AudioSource_TTS").attr("src", sample1SrcUrl);
    $("#AudioPlayer_TTS")[0].pause();
    $("#AudioPlayer_TTS")[0].load();
    $("#AudioPlayer_TTS")[0].oncanplaythrough = $("#AudioPlayer_TTS")[0].play();

    inactiveEngineUi(active_flow_no, node_index);
    activeResultUi(active_flow_no, node_index);

    $('#Input_User').focus();
}


/* ===================================================================================================================== */
// 설리봇 FLOW 용 이벤트
/* ===================================================================================================================== */

function onAfterEngine_Sully(handler, node_index, data_type, data) {
    console.log("=================================================> onAfterEngine_Sully");
    console.dir(handler.flow.nodeList[node_index]);
    console.dir(data);

    if(handler.flow.nodeList[node_index].engineName == '음성인식') {
        console.log("음식인식 결과: [", data, "]");

        if(data.trim().length == 0) {
            console.log("음식인식 결과가 없어서, 처리를 취소합니다.");
            handler.cancel();   // 원래는 내부적으로 에러 처리되어야 함.

            speechAI('인식된 메세지가 없습니다.', null);
            return;
        }
        addMessage_User(data);
    }
    else if(handler.flow.nodeList[node_index].engineName == '챗봇') {
        console.log("설리의 대답 =======================================> ", data);
        let replace_text = data.replace(/[$][$]NL[$][$]/gi, "<BR>");
        let split_text = replace_text.split('$$');
        console.log("replace = ", replace_text);
        addMessage_Bot(split_text[0]);

        displayAIMessage(split_text[0]);
    }
    else if(handler.flow.nodeList[node_index].engineName == '음성생성') {
        speechAI(null, data)
    }

    inactiveEngineUi(active_flow_no, node_index);
    activeResultUi(active_flow_no, node_index);
}

function onBeforeEngine(handler, node_index, data_type, data) {
    inactiveEngineUi(active_flow_no, node_index-1);
    activeEngineUi(active_flow_no, node_index);
}

function  onError(handler) {

}