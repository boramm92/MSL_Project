
function clearChats() {
    $('.chat_area').empty();
}


function addMessage_Bot(message) {
    let resultHTML = message.replace("$$NL$$", "<br>");
    resultHTML = '<li class="bot_text">' + message + '</li>';
    $('.chat_area').append(resultHTML);


    scrolldown();
    console.log("Bot Message => ", resultHTML);
}

function addMessage_User(message) {
    $('.chat_area').append(
        '<li class="custom_text">' + message + '</li>'
    );

    scrolldown();
}

function addButtons(items) {
// <li class="bot_tag">
//         <ul>
//         <li><a class="tag" href="#none" data-display="서비스 소개" data-intent="서비스 소개">서비스 소개</a></li>
//     <li><a class="tag" href="#none" data-display="회사 소개" data-intent="회사 소개">회사 소개</a></li>
//     <li><a class="tag" href="#none" data-display="가격" data-intent="가격">가격</a></li>
//     <li><a class="tag" href="#none" data-display="사용법" data-intent="사용법">사용법</a></li>
//     <li><a class="tag" href="#none" data-display="마음에이아이가 뭐예요?" data-intent="마음에이아이가 뭐에요?">마음에이아이가 뭐에요?</a></li>
//     </ul>
//     </li>

    let contents = "<li class=\"bot_tag\"> <ul>";
    for(let xx = 0; xx < items.length; xx++) {
        contents += '<li><a class="tag" href="#none" data-display="' + items[xx] + '" data-intent="' + items[xx] + '" onclick="onClick_Tag(\'' + items[xx] + '\')">' + items[xx] + '</a></li>';
    }
    contents += "</ul></li>";
    $('.chat_area').append(contents);
}

function onClick_Tag(keyword) {
    addMessage_User(keyword);
    activeFlow(FLOW___TEXT_INPUT);
    mvpHandlers[FLOW___TEXT_INPUT].start(keyword);
    stopAudio();
}

function scrolldown() {
    $(".chat_area").scrollTop($(".chat_area")[0].scrollHeight);
}


/* ===================================================================================================================== */
// AI 말하기
/* ===================================================================================================================== */

function displayAIMessage(message) {
    $('.info_box').empty();


    $('.info_box').html(message.replace(/<br><br>/gi, "<br>"));
}



/* ===================================================================================================================== */
//
/* ===================================================================================================================== */

function clearFlowUi() {
    $('.engin_bot').empty();
}

function addFlowUi(flow, flow_no) {
    let contents = '';
    let id = "" + flow_no;

    /* FLOW LAYER 추가 */
    contents = '<div class="cont_box clearfix" id="FlowLayer_' + id + '" style="scroll-behavior: smooth;"></div>';
    $('.engin_bot').append(contents);

    /* 각 노드 등록 */
    for(let xx = 0; xx < flow.nodeList.length; xx++) {
        addNodeUi(flow.nodeList[xx], flow_no, xx);
    }
}

function addNodeUi(node, flow_no, node_no) {
    let contents = '';
    let parent_id = "" + flow_no;
    let my_id = "" + flow_no + "_" + node_no;
    let engine = engines[node.engineId];

    /* node layer 추가 */
    contents = "<div id='NodeLayer_" + my_id + "' class='api_set clearfix ' style='opacity:0.7;'> </div>";
    $('#FlowLayer_' + parent_id).append(contents);

    /* 입력 추가 */
    if(node_no == 0) {
        addInputTypeUi(engine, my_id);
    }

    /* 엔진 추가 */
    contents = "  <div class='api_show' id='FlowNode_Engine_" + my_id + "'>\
                      <div class='api_bot'>\
                          <span id=''> " + engine.name + " </span>\
                                   <img src='" + url___mvp_maker + engine.iconPath  + "' title=''>\
                          <div class='spinner'><strong class='fas fa-spinner'></strong></div>\
                      </div>\
                  </div>"
    $('#NodeLayer_' + my_id).append(contents);

    /* 출력 추가 */
    addOutputTypeUi(engine, my_id);
}

function addInputTypeUi(engine, my_id) {
    let input;
    if(engine.inputType == 'text') input = 'textbox';
    else if(engine.inputType == 'audio') input = 'audiobox';

    contents = "<div class='input_show' id='FlowNode_Input_" + my_id +"'>\
                    <div class='input " + input  + " 1 '><span>입력값</span>\
                        <p>" + engine.inputType + "</p>\
                    </div>\
                </div>";

    $('#NodeLayer_' + my_id).append(contents);
}

function addOutputTypeUi(engine, my_id) {
    let output;
    if(engine.outputType == 'text') output = 'textbox';
    else if(engine.outputType == 'audio') output = 'audiobox';

    contents = "<div class='output_show' id='FlowNode_Output_" + my_id + "'>\
                      <div class='output " + output + " blue'><span>결과값</span>\
                          <p>" + engine.outputType + "</p>\
                      </div>\
                  </div>";

    $('#NodeLayer_' + my_id).append(contents);
}


function showFlowUi(flow_no) {
    $('#FlowLayer_' + flow_no).show();
}

function hideFlowUi(flow_no) {
    $('#FlowLayer_' + flow_no).hide();
}

function activeEngineUi(flow_no, node_no) {
    if(flow_no < 0 || node_no < 0) return;

    $('#FlowNode_Engine_' + flow_no + "_" + node_no).addClass('api_progress');

    // $('#FlowLayer_' + flow_no).animate({scrollTop: $('#FlowLayer_' + flow_no).top}, node_no*50);
    $('#FlowLayer_' + flow_no).scrollTop(node_no*50);
}

function inactiveEngineUi(flow_no, node_no) {
    if(flow_no < 0 || node_no < 0) return;

    $('#FlowNode_Engine_' + flow_no + "_" + node_no).removeClass('api_progress');
}

function activeResultUi(flow_no, node_no) {
    if(flow_no < 0 || node_no < 0) return;

    $('#FlowNode_Output_' + flow_no + "_" + node_no).addClass('active');
}

function inactiveResultUi(flow_no, node_no) {
    if(flow_no < 0 || node_no < 0) return;

    $('#FlowNode_Output_' + flow_no + "_" + node_no).removeClass('active');
}
