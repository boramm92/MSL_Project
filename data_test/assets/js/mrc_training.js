$(document).ready(function() {
    var questionList   = []
    var questionSet    = {}
    var answerList     = []
    var isQuestionEdit = false;
    var editIndex;
    /*
     * [answerState can have three values]
     * 0: nothing selected
     * 1: start selected
     * 2: both selected
     */
    var answerState = 0;
    var answerStart;
    var answerEnd;
    var displayAll = false;

    // =========following code block auto-inserts sample json (for demo)=============

    var param = {'text': 'text'};
    param = JSON.stringify(param);
    $.ajax({
        type: 'POST',
        url: '/parse_input_text/',
        data: param,
        datatype: 'json',
        error: function(xhr, status, error) {
            console.log(xhr);
            alert('[에러] 문단 파싱에 실패했습니다.');
        },
        success: function(data) {
            $("#parsed_article").text('');
            answerStart   = '';
            answerEnd     = '';
            jsonObject    = JSON.parse(data);
            contextMorph  = jsonObject["morps"];
            text          = jsonObject["text"];
            startIndices  = {};
            var i;
            for (i in contextMorph) {
                start = contextMorph[i]["start"];
                morph = contextMorph[i]["morp"].split("/")[0];
                if (startIndices[start]) {
                    startIndices[start].push(morph);
                } else {
                    startIndices[start] = [morph];
                }
            }
            var iter;
            var start = 0;
            for (iter in startIndices) {
                if (iter !== "0") {
                    morph        = text.substring(start, iter);
                    morphElement = "<span class = source_text id=m_" + start + ">" + morph + "</span>";
                    $("#parsed_article").append(morphElement);
                }
                start = iter;
            }
            $("#parsed_article").css("color", "black");
            $("#parsed_article").children().each(function(idx, morph) {
                $(morph).click(function() {
                    if (answerState === 0) {
                        answerStart = $(morph).attr('id');
                        answerState = 1;
                    } else if (answerState ===1) {
                        currStartMorph = $("#"+answerStart);
                        startIndex     = parseInt(currStartMorph.attr("id").split("_")[1]);
                        selectedMorph  = $(morph);
                        selectedIndex  = parseInt(selectedMorph.attr("id").split("_")[1]);
                        if (startIndex === selectedIndex) {
                            answerStart = '';
                            answerState = 0;
                        } else if (startIndex > selectedIndex) {
                            answerStart = $(morph).attr('id');
                            answerState = 1;
                        } else {
                            answerEnd   = $(morph).attr('id');
                            answerState = 2;
                        }
                    } else if (answerState ===2) {
                        answerStart = $(morph).attr('id');
                        answerEnd   = '';
                        answerState = 1;
                    }
                    highlightAnswer();
                    displayAnswer();
                });
            });
            $("#mrc_qa_wrap").css('display', 'block');
        }
    });

// ==================#question_box====================
    $(document).on("click", ".question_del_btn", function () {
        q_id = $("#question_list").find(".chosen").index();
        if (questionList[q_id]) {
            answerText       = $("#answer_whole").find(".answer_part1").text();
            answerList[q_id] = [answerStart, answerEnd, answerState, answerText];
        }
        $(".question").removeClass('chosen');
        var delete_confirm = confirm('질문 그룹을 삭제하시겠습니까?');
        if (!delete_confirm) {
            return false;
        }
        var index = $(this).parent().index();
        questionList.splice(index, 1);
        answerList.splice(index, 1);
        var element_num = $(".question").length;
        if (element_num > 4) {
            var i;
            for (i = element_num - 1; i >= 4; i --) {
                $(".question").eq(i).remove();
            }
        }
        if (questionList.length > 4) {
            var i;
            for (i = 0; i < questionList.length - 4; i ++) {
                $("#question_list").append('<li class="question"><p></p><button class="question_edit_btn">Edit</button><button class="question_del_btn">Del</button></li>');
            }
        }
        $.each($(".question"), function(index, val) {
            $(val).find("p").text('');
            $(val).find(".question_edit_btn").css('display', 'none');
            $(val).find(".question_del_btn").css('display', 'none');
        });
        $.each(questionList, function(index, val) {
            $(".question").eq(index).find("p").text(val.main_question);
            $(".question").eq(index).find(".question_edit_btn").css('display', 'block');
            $(".question").eq(index).find(".question_del_btn").css('display', 'block');
        });
    });
    $(document).on("click", ".question_edit_btn", function() {
        isQuestionEdit = true;
        editIndex      = $(this).parent().index();
        document.getElementById("question_modal").style.display = "block";
        $("#main_question_item").val(questionList[editIndex].main_question);
        $(".sub_question_item").val('');
        $.each(questionList[editIndex].sub_question, function(index, val) {
            $(".sub_question_item").eq(index).val(val);
        });
        $(".sub_question_item").removeAttr('placeholder');
        $(".sub_question_item")[questionList[editIndex].sub_question.length].placeholder = '비슷한 질문을 기입해주세요';
        $("#loading_gif").hide();
    });

    $("#question_add_btn").click(function() {
        document.getElementById("question_modal").style.display = "block";
        $("#main_question_item").val('');
        $(".sub_question_item").val('');
        $(".sub_question_item").removeAttr('placeholder');
        $(".sub_question_item")[0].placeholder = '비슷한 질문을 기입해주세요';
        $("#loading_gif").hide();
    });

    $(".close").click(function() {
        document.getElementById("question_modal").style.display = "none";
        $(".article_item").removeClass('chosen');
    });

    $(".sub_question_item").on("change paste keyup", function() {
        $.each($(".sub_question_item"), function(key, val) {
            if (val.placeholder === '비슷한 질문을 기입해주세요') {
                val.placeholder = '';
            }
        });
        $.each($(".sub_question_item"), function(key, val) {
            if (val.value === '') {
                val.placeholder = '비슷한 질문을 기입해주세요';
                return false;
            }
        });
    });
    $("#submit_question_set").click(function() {
        questionSet = {}
        questionSet.main_question = $("#main_question_item")[0].value;
        questionSet.sub_question  = []
        $.each($(".sub_question_item"), function(key, val) {
            if (val.value !== '') {
                questionSet.sub_question.push(val.value);
            }
        });
        if (isQuestionEdit) {
            questionList[editIndex] = questionSet;
            isQuestionEdit          = false;
        } else {
            questionList.push(questionSet);
            answerList.push(['', '', 0, '']);
        }
        var element_num = $(".question").length;
        if (element_num > 4) {
            var i;
            for (i = element_num - 1; i >= 4; i --) {
                $(".question").eq(i).remove();
            }
        }
        if (questionList.length > 4) {
            var i;
            for (i = 4; i < questionList.length; i ++) {
                $("#question_list").append('<li class="question"><p></p><button class="question_edit_btn">Edit</button><button class="question_del_btn">Del</button></li>');
            }
        }
        var last;
        $.each(questionList, function(index, val) {
            $(".question").eq(index).find("p").text(val.main_question);
            $(".question").eq(index).find(".question_edit_btn").css('display', 'block');
            $(".question").eq(index).find(".question_del_btn").css('display', 'block');
            last = index;
        });
        $("#question_list").find(".question")[last].click();
        document.getElementById("question_modal").style.display = "none";
    });
    $(document).on("click", ".question", function() {
        q_id = $("#question_list").find(".chosen").index();
        if (questionList[q_id]) {
            answerText       = $("#answer_whole").find(".answer_part1").text();
            answerList[q_id] = [answerStart, answerEnd, answerState, answerText];
        }
        $(".question").removeClass('chosen');
        $(this).toggleClass('chosen');
        q_id = $(this).index();
        if (questionList[q_id]) {
            if (answerList[q_id]) {
                answerStart = answerList[q_id][0];
                answerEnd   = answerList[q_id][1];
                answerState = answerList[q_id][2];
                highlightAnswer();
                displayAnswer();
            } else {
                answerStart = '';
                answerEnd   = '';
                answerState = 0;
                highlightAnswer();
                displayAnswer();
            }
            answerText = $("#answer_whole").find(".answer_part1").text();
            answerList[q_id] = [answerStart, answerEnd, answerState, answerText];
        }  else {
            answerStart = '';
            answerEnd   = '';
            answerState = 0;
            highlightAnswer();
            displayAnswer();
        }
    });
// ==================================================

// ==============#answer_box: adjust=================
    $("#start_adjust_left").click(function() {
        if (answerStart !== '') {
            currStartMorph = $("#"+answerStart);
            if (currStartMorph.prev().prop("tagName") === "SPAN") {
                answerStart = currStartMorph.prev().attr("id");
                highlightAnswer();
                displayAnswer();
            }
        }
    });
    $("#start_adjust_right").click(function() {
        if (answerStart !== '') {
            currStartMorph = $("#"+answerStart);
            startIndex     = parseInt(currStartMorph.attr("id").split("_")[1]);
            if (currStartMorph.next().prop("tagName") === "SPAN") {
                if (answerEnd !== '') {
                    curr_end_morph = $("#"+answerEnd);
                    end_index      = parseInt(curr_end_morph.attr("id").split("_")[1]);
                    if (startIndex < end_index) {
                        answerStart = currStartMorph.next().attr("id");
                        highlightAnswer();
                        displayAnswer();
                    }
                } else {
                    answerStart = currStartMorph.next().attr("id");
                    highlightAnswer();
                    displayAnswer();
                }
            }
        }
    });
    $("#end_adjust_left").click(function() {
        if (answerEnd !== '') {
            curr_end_morph = $("#"+answerEnd);
            end_index      = parseInt(curr_end_morph.attr("id").split("_")[1]);
            if (curr_end_morph.prev().prop("tagName") === "SPAN") {
                if (answerStart !== '') {
                    currStartMorph = $("#"+answerStart);
                    startIndex     = parseInt(currStartMorph.attr("id").split("_")[1]);
                    if (startIndex<end_index) {
                        answerEnd = curr_end_morph.prev().attr("id");
                        highlightAnswer();
                        displayAnswer();
                    }
                } else {
                    answerEnd = curr_end_morph.prev().attr("id");
                    highlightAnswer();
                    displayAnswer();
                }
            }
        }
    });
    $("#end_adjust_right").click(function() {
        curr_end_morph = $("#"+answerEnd);
        if (curr_end_morph.next().prop("tagName") === "SPAN") {
            answerEnd = curr_end_morph.next().attr("id");
            highlightAnswer();
            displayAnswer();
        }
    });
// ===================================================

// ==============#answer_box: display=================
    function highlightAnswer() {
        $("#parsed_article").find("span").css("color", "black");
        if (answerState === 1) {
            curr_morph = $("#" + answerStart);
            curr_morph.css("color", "#007eff");
        } else if (answerState === 2) {
            curr_morph = $("#" + answerStart);
            curr_morph.css("color", "#007eff");
            while(curr_morph.attr("id") !== answerEnd) {
                curr_morph = curr_morph.next();
                curr_morph.css("color", "#007eff");
            }
        }
    }
    function displayAnswer() {
        $("#answer_whole").text('');
        $("#answer_morph").text('');
        if (answerState !== 0) {
            morph_count     = 0;
            curr_morph      = $("#" + answerStart);
            answer_index    = curr_morph.attr("id").split("_")[1]
            morphElement_aw = "<span class = answer_part1 id=aw_" + answer_index + ">" + curr_morph.text() + "</span>";
            morphElement    = "<span class = answer_part2 id=a_" + answer_index + ">" + curr_morph.text() + "</span>";
            $("#answer_whole").append(morphElement_aw);
            $("#answer_morph").append(morphElement);
            $("#answer_whole").css("text-align", "center");
            $("#answer_morph").css("text-align", "center");

            morph_count += 1;
            if (answerEnd !== '') {
                while (curr_morph.attr("id") !== answerEnd) {
                    curr_morph      = curr_morph.next();
                    answer_index    = curr_morph.attr("id").split("_")[1]
                    morphElement_aw = "<span class = answer_part1 id=aw_" + answer_index + ">" + curr_morph.text() + "</span>";
                    split_element   = "<span class = answer_part2 id=s_" + answer_index + "> / </span>";
                    morphElement    = "<span class = answer_part2 id=a_" + answer_index + ">" + curr_morph.text() + "</span>";
                    $("#answer_whole").append(morphElement_aw);
                    $("#answer_morph").append(split_element + morphElement);
                    morph_count += 1;
                }
                $("#answer_whole").css("text-align", "center");
                $("#answer_morph").css("text-align", "center");
            }
            if (!displayAll) {
                if (morph_count > 4) {
                    $("#answer_whole").css("text-align", '');
                    $("#answer_morph").css("text-align", '');
                    $(".answer_part1").css("display", "none");
                    $(".answer_part2").css("display", "none");

                    curr_morph   = $("#" + answerStart);
                    answer_index = curr_morph.attr("id").split("_")[1];
                    $("#aw_" + answer_index).css("display", '');
                    $("#s_" + answer_index).css("display", '');
                    $("#a_" + answer_index).css("display", '');

                    answer_index    = curr_morph.next().attr("id").split("_")[1];
                    var ellipsisDiv = "<div class='ellipsis'>...</div>"
                    $("#aw_" + answer_index).css("display", '');
                    $("#aw_" + answer_index).after(ellipsisDiv);
                    $("#s_" + answer_index).css("display", '');
                    $("#a_" + answer_index).css("display", '');
                    $("#a_" + answer_index).after(ellipsisDiv);

                    curr_morph   = $("#" + answerEnd);
                    answer_index = curr_morph.attr("id").split("_")[1];
                    $("#aw_"+answer_index).css("display", '');
                    $("#s_"+answer_index).css("display", '');
                    $("#a_"+answer_index).css("display", '');

                    answer_index2 = curr_morph.prev().attr("id").split("_")[1];
                    $("#aw_" + answer_index2).css("display", '');
                    $("#a_" + answer_index2).css("display", '');
                    $("#aw_" + answer_index + ",#aw_" + answer_index2).wrapAll('<div style="float:right" />');
                    $("#a_" + answer_index + ", #a_" + answer_index2 + ", #s_" + answer_index + ", #s_" + answer_index2 ).wrapAll('<div style="float:right" />');
                }
            } else {
                if (morph_count > 4) {
                    $("#answer_whole").css("text-align", '');
                    $("#answer_morph").css("text-align", '');
                    $(".answer_part2").css("display", "none");

                    curr_morph   = $("#" + answerStart);
                    answer_index = curr_morph.attr("id").split("_")[1];
                    $("#aw_" + answer_index).css("display", '');
                    $("#s_" + answer_index).css("display", '');
                    $("#a_" + answer_index).css("display", '');

                    answer_index    = curr_morph.next().attr("id").split("_")[1];
                    var ellipsisDiv = "<div class='ellipsis'>...</div>"
                    $("#aw_" + answer_index).css("display", '');
                    $("#s_" + answer_index).css("display", '');
                    $("#a_" + answer_index).css("display", '');
                    $("#a_" + answer_index).after(ellipsisDiv);

                    curr_morph   = $("#" + answerEnd);
                    answer_index = curr_morph.attr("id").split("_")[1];
                    $("#aw_" + answer_index).css("display", '');
                    $("#s_" + answer_index).css("display", '');
                    $("#a_" + answer_index).css("display", '');

                    answer_index2 = curr_morph.prev().attr("id").split("_")[1];
                    $("#aw_" + answer_index2).css("display", '');
                    $("#a_" + answer_index2).css("display", '');
                    $("#a_" + answer_index + ", #a_" + answer_index2 + ", #s_" + answer_index + ", #s_" + answer_index2 ).wrapAll('<div style="float:right" />');
                }
            }
        }
    }
    $("#answer_all").click(function() {
        if (!displayAll) {
            displayAll = true;
            $("#answer_all").text("답변 줄여 보기");
            $(".answer_whole").css('line-height', '20px');
            $(".answer_whole").css('overflow-y', 'scroll');
            if(answerStart !== '') {
                displayAnswer();
                highlightAnswer();
            }
        } else{
            displayAll = false;
            $("#answer_all").text("답변 전체 보기");
            $(".answer_whole").css('line-height', '70px');
            $(".answer_whole").css('overflow-y', '');
            if(answerStart !== '') {
                displayAnswer();
                highlightAnswer();
            }
        }
    });

    $("#submit_qa").click(function() {
        q_id = $("#question_list").find(".chosen").index();
        if (questionList[q_id]) {
            answerText       = $("#answer_whole").find(".answer_part1").text();
            answerList[q_id] = [answerStart, answerEnd, answerState, answerText];
        }
        var answerSubmit = []
        var answerEmpty  = []
        for (i in answerList) {
            if(answerList[i][3] === ""){
                answerEmpty.push(i);
            }
            answerSubmit.push(answerList[i][3]);
        }
        var qa = {'question': questionList, 'answer': answerSubmit};
        if (questionList.length === 0) {
            alert('질문을 추가해주세요');
        } else if (answerEmpty.length > 0) {
            alert('답변이 선택되지 않은 질문이 있습니다');
        } else {
            alert(JSON.stringify(qa));
        }
    });
// =============================================
});
