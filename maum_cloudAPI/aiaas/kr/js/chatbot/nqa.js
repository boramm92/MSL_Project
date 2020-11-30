//chatting info setting
var deviceId = '';
var chatNm = '';
var $textArea = $('.chatbot_box .chat_btm .textArea');

$(document).ready(function (){
	// 날짜, 요일 시간 정의
	var year  = new Date().getFullYear();  //현재 년도
	var month = new Date().getMonth()+1;  //현재 월
	var date  = new Date().getDate();  //현재 일
	var week  = new Array('일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일');	  //요일 정의
	var thisWeek  = week[new Date().getDay()];	//현재 요일

	var ampm = new Date().getHours() >= 12 ? '오후' : '오전';
	var	thisHours = new Date().getHours() >=13 ?  new Date().getHours()-12 : new Date().getHours(); //현재 시
	var	thisMinutes = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes(); //현재 분
	var NowTime = thisHours + ':' + thisMinutes;

	
	$('#cahtbotWrap').each(function(){
		var cahtbotWrapHeight = $('#cahtbotWrap').height();	
		$('.chatbot_box .chat_mid').css({
			'height': Math.round(cahtbotWrapHeight-145)
		});
	});	
	

	// 오늘 날짜 입력
	$('.talkLst li.newDate span').each(function(){
		$(this).append(year + '년 ' + month +'월 ' + date +'일 ' + thisWeek);
	});	

	// 첫멘트 시간
	$('.chatbot_box .chat_mid .talkLst li.bot .cont:last-child').append('<em class="date"><strong>' + ampm + '</strong>' + NowTime + '</em>');

	// 내용있을 시 스크롤 최하단
	scrollFunc();

	// 채팅입력 (Enter)
	$textArea.keyup(function (event) {
		if (event.keyCode === 13){
			$('#btn_chat').trigger('click');
		}
	});

	// 추천질문 (text 출력)
	$('.info_btnBox li button').on('click', function() {
		var recomQust = $(this).text();

		$textArea.val(recomQust);
		$('#btn_chat').trigger('click');
		
		$('.chatbot_box .bot_infoBox').css({
			'display':'none'
		});
		$('.chatbot_box .talkLst').css({
			'display':'block'
		});

		$textArea.val('');
		scrollFunc();

		
	});
	

	// 채팅입력 (text 출력)
	$('#btn_chat').on('click', function() {
		// textarea 텍스트 값 및 엔터처리
		var inputTxt = $textArea.val();
		var textValue = inputTxt.replace(/(?:\r\n|\r|\n)/g, '');

		// 채팅창에 text 출력
		if(inputTxt.replace(/\s/g,"").length === 0){
			// text가 없으면 실행 
		} else {
			// text가 있으면 실행
			sendTalk(textValue);
			$('.chatbot_box .chat_mid .talkLst').append(
				'<li class="user">' +
					'<span class="cont">' +
						'<em class="txt">' + textValue + '</em>' +
						'<em class="date"><strong>' + ampm + '</strong>' + NowTime + '</em>' +
					'</span>' +
				'</li>'
			);
			$('.chatbot_box .bot_infoBox').css({
				'display':'none'
			});
			$('.chatbot_box .talkLst').css({
				'display':'block'
			});
			$textArea.val('');
			scrollFunc();

		}		
	});

});


function sendTalk(talkMessage) {
	talkMessage = talkMessage.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, " ");

	// console.log("talk deviceId: "+deviceId);
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
			// console.log(data);
			var ampm = new Date().getHours() >= 12 ? '오후' : '오전';
			var	thisHours = new Date().getHours() >=13 ?  new Date().getHours()-12 : new Date().getHours(); //현재 시
			var	thisMinutes = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes(); //현재 분
			var NowTime = thisHours + ':' + thisMinutes;


			var result = data.directive.payload.response.speech.utter;

			if(data.directive.payload.response.cards[0] !== undefined){

				if(Object.keys(data.directive.payload.response.cards[0]).length === 0){
					// console.log("NQA 버튼 無");

					$('#'+chatNm+' .chat_mid .talkLst').append(
						'<li class="bot">'+
							'<span class="thumb"><img src="' + document.getElementById('thumb').value + '" alt="chatbot"></span>'+
							'<span class="cont">'+
								'<em class="txt">' + result + '</em>'+
							'</span>'+
						'</li>'
					);
				} else{
					// console.log("버튼 有");
					var btn_items = data.directive.payload.response.cards[0].select.items;
					var btn_html = "";
					for(var i=0; i < btn_items.length; i++){
						btn_html += '<li value="'+ btn_items[i].title +'" onclick="btnTextToTalk($(this).attr(\'value\'), $(this))">' + btn_items[i].selectedUtter + '</li>';
					}

					if(result.search('Match :') !== -1){
						result = "아래 버튼 중 선택해주세요.";
					}

					$('#'+chatNm+' .chat_mid .talkLst').append(
						'<li class="bot">'+
							'<span class="thumb"><img src="' + document.getElementById('thumb').value + '" alt="chatbot"></span>'+
							'<span class="cont">'+
								'<em class="txt">' + result + '</em>'+
							'</span>'+
							'<div class="hashbox">'+
								'<ul>'+
									btn_html+
								'</ul>'+
							'</div>'+
						'</li>'
					);
				}
			}

			else{
				// console.log("버튼 無");
				$('#'+chatNm+' .chat_mid .talkLst').append(
					'<li class="bot">'+
                        '<span class="thumb"><img src="' + document.getElementById('thumb').value + '" alt="chatbot"></span>'+
                    	'<span class="cont">'+
                        '<em class="txt">' + result + '</em>'+
                    	'</span>'+
                	'</li>'
				);
			}

			$('#'+chatNm+' .chat_mid .talkLst .bot:last-child .cont:last-child').append(
				'<em class="date"><strong>' + ampm + '</strong>' + NowTime + '</em>'
			);

			// 내용있을 시 스크롤 최하단
			scrollFunc();

		}, error: function(err) {
			console.log("chatbot SendTalk error! ", err);
		}
	});
}

function scrollFunc(){
	var $chat_mid = $('.chatbot_box .chat_mid');
	$chat_mid.scrollTop($chat_mid[0].scrollHeight);
}


function btnTextToTalk(recomQust, element) {
	element.addClass('on');
	$textArea.val(recomQust);
	$('#btn_chat').trigger('click');

	$('.chatbot_box .bot_infoBox').css({'display':'none'});
	$('.chatbot_box .talkLst').css({'display':'block'});

	$textArea.val('');
	scrollFunc();
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
	var randomstring = '';
	for (var i = 0; i < string_length; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum, rnum + 1);
	}
	return randomstring;
}


$(window).resize(function (){
	$('#cahtbotWrap').each(function(){
		var cahtbotWrapHeight = $('#cahtbotWrap').height();	
		$('.chatbot_box .chat_mid').css({
			'height': Math.round(cahtbotWrapHeight-145),
		});
	});	
});	



