// MINDsLab. UX/UI Team. YMJ. 20180613

//chatting info setting
var CHATBOT = '';
var deviceId = '';
var chatNm = '';
$(document).ready(function (){
	// 날짜, 요일 시간 정의	
	var year  = new Date().getFullYear();  //현재 년도
	var month = new Date().getMonth()+1;  //현재 월
	var date  = new Date().getDate();  //현재 일
	var week  = new Array('일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일');	  //요일 정의
	var thisWeek  = week[new Date().getDay()];	//현재 요일


	// 오늘 날짜 입력
	$('.talkLst li.newDate span').each(function(){
		$(this).append(year + '년 ' + month +'월 ' + date +'일 ' + thisWeek);
	});	

	// 첫멘트 시간
	$('.chatbot_box .chat_mid .talkLst li.bot .cont:last-child').append('<em class="date"><strong>' + getAmPm() + '</strong>' + getTime() + '</em>');

	// 내용있을 시 스크롤 최하단
	$('.chatbot_box .chat_mid').scrollTop($('.chatbot_box .chat_mid')[0].scrollHeight);
	
	// 채팅입력 (Enter)
	$('.chatbot_box .chat_btm .textArea').keyup(function (event) {
		if (event.keyCode === 13){
			$('#btn_chat').trigger('click');
		}
	});

	// 추천질문 (text 출력)
	$('.info_btnBox li button').on('click', function() {
		var recomQust = $(this).text();

		$('.chatbot_box .chat_btm .textArea').val(recomQust);
		$('#btn_chat').trigger('click');

		$('.chatbot_box .bot_infoBox').css({
			'display':'none'
		});
		$('.chatbot_box .talkLst').css({
			'display':'block'
		});

		var winWidth = $(window).width();
		if ( winWidth < 760) {
		$('#cahtbotWrap').each(function(){
			var cahtbotWrapHeight = $('#cahtbotWrap').height();
			$('.chatbot_box .chat_mid').css({
				'height': Math.round(cahtbotWrapHeight-130),
			});
		});
		} else {
			$('#cahtbotWrap').each(function(){
				var cahtbotWrapHeight = $('#cahtbotWrap').height();
				$('.chatbot_box .chat_mid').css({
					'height': Math.round(cahtbotWrapHeight-145),
				});
			});
		}
		$('.chatbot_box .chat_btm .textArea').val('');
		$('.chatbot_box .chat_mid').scrollTop($('.chatbot_box .chat_mid')[0].scrollHeight);

	});

	// 채팅입력 (text 출력)
	$('.btn_chat').on('click', function() {
		var $chatTextArea = $('#'+chatNm+' .chat_btm .textArea');

		// textarea 텍스트 값 및 엔터처리
		var textValue = $chatTextArea.val().trim().replace(/(?:\r\n|\r|\n)/g, '<br>');

		$chatTextArea.prop('disabled', true);

		// 채팅창에 text 출력
		if( $chatTextArea.val().replace(/\s/g,"").length === 0){
			// text가 없으면 실행 
		} else {
			// text가 있으면 실행
			$('#'+chatNm+' .chat_mid .talkLst').append(
				'<li class="user"> '+
				'<span class="cont"> '+
				'<em class="txt">' + textValue + '</em> '+
				'<em class="date"><strong>' + getAmPm() + '</strong>' + getTime() + '</em> '+
				'</span> '+
				'</li>'
			);

			sendTalk(textValue);

			$('.chatbot_box .bot_infoBox').css({
				'display':'none'
			});
			$('.chatbot_box .talkLst').css({
				'display':'block'
			});
			$('#'+chatNm+' .chat_btm .textArea').val('');
			var winWidth = $(window).width();
			if ( winWidth < 760) {
				$('#cahtbotWrap').each(function(){
					var cahtbotWrapHeight = $('#cahtbotWrap').height();
					$('.chatbot_box .chat_mid').css({
						'height': Math.round(cahtbotWrapHeight-130),
					});
				});
			} else {
				$('#cahtbotWrap').each(function(){
					var cahtbotWrapHeight = $('#cahtbotWrap').height();
					$('.chatbot_box .chat_mid').css({
						'height': Math.round(cahtbotWrapHeight-145),
					});
				});
			}
			$('#'+chatNm+' .chat_mid').scrollTop($('#'+chatNm+' .chat_mid')[0].scrollHeight);
		}
	});

});

function btnTextToTalk(recomQust) {
	$('.chatbot_box .chat_btm .textArea').val(recomQust);
	$('#btn_chat').trigger('click');

	$('.chatbot_box .bot_infoBox').css({
		'display':'none',
	});
	$('.chatbot_box .talkLst').css({
		'display':'block',
	});

	$('.chatbot_box .chat_btm .textArea').val('');
	$('.chatbot_box .chat_mid').scrollTop($('.chatbot_box .chat_mid')[0].scrollHeight);
}

function sendTalk(talkMessage) {
	//로딩 UI 추가
	$('#'+chatNm+' .chat_mid .talkLst').append(
		'<li class="bot">'+
			'<span class="thumb"><img src="' + document.getElementById('thumb').value + '" alt="chatbot_img"></span>'+
			'<span class="cont">'+
				'<em class="txt">'+
					'<span class="chatLoading">'+
						'<strong class="chatLoading_item01"></strong>'+
						'<strong class="chatLoading_item02"></strong>'+
						'<strong class="chatLoading_item03"></strong>'+
					'</span>'+
				'</em> '+
			'</span> '+
		'</li>'
	);

    talkMessage = talkMessage.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, " ");
    
	console.log("talk deviceId: "+deviceId);
	// console.log('session id : ', document.getElementById('SESSION_ID').value);
	$.ajax({
		url: 'https://aicc-prd1.maum.ai:9980/api/v3/dialog/textToTextTalk',
		async: true,
		type: 'POST',
		headers: {
			"Content-Type": "application/json",
			"m2u-auth-internal": "m2u-auth-internal"
			//"Authorization": document.getElementById('AUTH_ID').value
		},
		data: JSON.stringify({
              "payload": {"utter": talkMessage, "lang": "ko_KR"},
              "device": {
                "id": deviceId,
                "type": "WEB",
                "version": "0.1",
                "channel": "ADMINWEB"
              },
              "location": {"latitude": 10.3, "longitude": 20.5, "location": "mindslab"},
              "authToken": document.getElementById('AUTH_ID').value
         }),
		dataType: 'json',
		success: function(data) {
//			 console.log(data);

			// textArea disabled 해제 & 로딩 UI 제거
			$('#'+chatNm+' .chat_btm .textArea').prop('disabled', false);
			$('#'+chatNm+' .chat_mid .talkLst li.bot:last-child').remove();

            var result = data.directive.payload.response.speech.utter;
            console.log(result);
			$('#'+chatNm+' .chat_mid .talkLst').append(
				'<li class="bot">'+
				'<span class="thumb"><img src="' + document.getElementById('thumb').value + '"></span>'+
				'<span class="cont"> '+
				'<em class="txt">' + result + '</em> '+
				'</span> '+
				'</li>'
			);

            // 이미지
            if (result.image) {
                $('.chatbot_box .chat_mid .talkLst .bot:last-child .cont').append(result.image);
            }
            // 썸네일
            if (result.thumbnail) {
                $('.chatbot_box .chat_mid .talkLst .bot:last-child .cont').append(result.thumbnail);
            }
            // 세로버튼
            if (result.v_btn) {
                $('.chatbot_box .chat_mid .talkLst .bot:last-child .cont').append(result.v_btn);
            }
            // 가로버튼
            if (result.h_btn) {
                $('.chatbot_box .chat_mid .talkLst .bot:last-child .cont').append(result.h_btn);
            }

            $('#'+chatNm+' .chat_mid .talkLst .bot:last-child .cont:last-child').append(
                '<em class="date"><strong>' + getAmPm() + '</strong>' + getTime() + '</em>'
            );

            // 내용있을 시 스크롤 최하단
            $('#'+chatNm+' .chat_mid').scrollTop($('#'+chatNm+' .chat_mid')[0].scrollHeight);

		}, error: function(err) {
			$('#'+chatNm+' .chat_btm .textArea').prop('disabled', false);
			console.log("chatbot SendTalk error! ", err);
		}
	});
}

function chatOpen(chatbot) {
	deviceId = 'MAUM_'+ this.randomString();
	$.ajax({
		url: 'https://aicc-prd1.maum.ai:9980/api/v3/dialog/open',
		async: false,
		type: 'POST',
		headers: {
			"Content-Type": "application/json",
			"m2u-auth-internal": "m2u-auth-internal"
		},
		data: JSON.stringify({
			"payload": {
				"utter": "UTTER1",
				"chatbot": chatbot,
				"skill": "SKILL1"
			},
			"device": {
				"id": deviceId ,
				"type": "WEB",
				"version": "0.1",
				"channel": "ADMINWEB"
			},
			"location": {"latitude": 10.3, "longitude": 20.5, "location": "mindslab"},
			"authToken": document.getElementById('AUTH_ID').value
		}),
		dataType: 'json',
		success: function(data) {
//			console.log(data);
//			console.log("deviceId: "+deviceId);


			//document.getElementById('AUTH_ID').value = data.directive.payload.authSuccess.authToken;
			//console.log(document.getElementById('AUTH_ID').value);
			console.log('open success!')
			// openDialogService(chatbot);
		}, error: function(err) {
			console.log("chatbot Login error! ", err);
		}
	});
}

function  randomString() {
	const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
	const string_length = 15;
	let randomstring = '';
	for (let i = 0; i < string_length; i++) {
		let rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum, rnum + 1);
	}
	return randomstring;
}

function getAmPm(){
	return new Date().getHours() >= 12 ? '오후' : '오전';
}
function getTime(){
	var	thisHours = new Date().getHours() >=13 ?  new Date().getHours()-12 : new Date().getHours(); //현재 시
	var	thisMinutes = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes(); //현재 분
	return thisHours + ':' + thisMinutes;
}


function closeDialogService() {
console.log("close");
console.log("close deviceId: "+deviceId);

	$.ajax({
		url: 'https://aicc-prd1.maum.ai:9980/api/v3/dialog/close',
		async: true,
		type: 'POST',
		headers: {
			"Content-Type": "application/json",
			"m2u-auth-internal": "m2u-auth-internal"
		},
		data: JSON.stringify({
            "device": {
                "id": deviceId,
                "type": "WEB",
                "version": "0.1",
                "channel": "ADMINWEB"
            },
            "location": {"latitude": 10.3, "longitude": 20.5, "location": "mindslab"},
            "authToken": document.getElementById('AUTH_ID').value
		}),
		dataType: 'json',
		success: function(data) {
			console.log(data);
		}, error: function(err) {
			console.log("chatbot Close Dialog error! ", err);
		}
	});

}


// parse og meta tag when they exist
function make_utter_obj(data) {
    // console.log(data.utter);
    $.ajax({
        url: '/process_utter',
        async: true,
        type: 'GET',
        // headers: {
        //     "Content-Type": "application/json",
        // },
        data: {
            "utter_text": data.utter,
        },
        dataType: 'json',
        success: function(data) {
            // console.log(data);
            return data;
        }, error: function(err) {
            console.log("parse HTML error! ", err);
        }
    });

}



//parse og meta tag when they exist
function aaaaaa(text) {
    // console.log(data.utter);
    $.ajax({
        url: 'http://10.122.66.135:8080/maum.brain.hmd.HmdClassifier/GetClassByText',
        async: true,
        type: 'POST',
        headers: {
            "Content-Type": "application/grpc-web"
        },
        data: JSON.stringify({
			"texzt": text,
		}),
        dataType: 'json',
        success: function(data) {
            // console.log(data);
            return data;
        }, error: function(err) {
            console.log("parse HTML error! ", err);
        }
    });

}