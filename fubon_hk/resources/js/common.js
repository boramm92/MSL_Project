/* MINDsLab. NBR. 20200902 */

// 공통 스크립트
// 스크롤바 width 사이즈 구하기 - 스크롤 테이블의 브라우저 호환성때문에 필요
function getScrollBarWidth() {
    var inner = document.createElement('p');
    inner.style.width = "100%";
    inner.style.height = "200px";

    var outer = document.createElement('div');
    outer.style.position = "absolute";
    outer.style.top = "0px";
    outer.style.left = "0px";
    outer.style.visibility = "hidden";
    outer.style.width = "200px";
    outer.style.height = "150px";
    outer.style.overflow = "hidden";
    outer.appendChild (inner);

    document.body.appendChild (outer);
    var w1 = inner.offsetWidth;
    outer.style.overflow = 'scroll';
    var w2 = inner.offsetWidth;
    if (w1 == w2) w2 = outer.clientWidth;

    document.body.removeChild (outer);
    return (w1 - w2);
};

jQuery.event.add(window,"load",function(){
    $(document).ready(function(){
    	// gnb 메뉴 script
        function gnbShowSlide() {
            // 대메뉴 마우스오버 시 중메뉴 슬라이드 다운으로 보여짐
            $('.gnb > li').hover(function(){
                $(this).find('.sub').stop().slideToggle(200);
                $(this).toggleClass('active');
                $('.third').slideUp();
            });

            // 소메뉴가 존재하는 중메뉴에 화살표 추가됨
            if($('.third').length){
                $('.third').parents('li').addClass('down');
            }

            // 중메뉴 클릭 시 소메뉴 슬라이드 다운으로 보여짐
            $('.sub a').on('click', function(e){
                e.stopPropagation();
                $(this).parents('.sub').css('height', 'auto');
                $(this).next().slideToggle(200);
            });
        }
        gnbShowSlide();

    	// AMR 200915 탭 이벤트
    	// var tabData = [];
    	var tabData = [{'label': 'STT 대상'}]; //탭 데이터 임의로 넣음

    	renderTabList(); //탭 생성 (탭데이터 내용 기반)
    	handleActiveTab(0); //첫번째 탭 액티브 디자인적용

    	// 메뉴 클릭 시 탭 생성
    	$('.sub > li a').on('click', function(){
    		if ( $(this).parent().hasClass('down') ) return; //2depth 메뉴(.down)는 탭 생성 안함

    		var thisMenu = $(this);
    		var tabName = thisMenu.text();
    		var label = {'label': tabName};
    		var temp = '';

    		var thisArr = tabData.findIndex(function(data){ return data.label === tabName }); //이미 탭에 있는 메뉴를 클릭하는지 확인

    		//이미 탭에 있는 메뉴일 경우 해당 탭 보여주기
    		if ( thisArr > -1 ) {
    			var thisTop = $('.tab_list li').eq(thisArr).position().top;
    			handleActiveTab(thisArr); //해당 탭 액티브 디자인적용
    			moveTabList(thisTop); //해당 탭으로 뷰 이동
    			return;
    		}

    		//탭에 없는 메뉴일 경우 탭 데이터 업데이트
    		tabData.push(label);

    		//탭 드롭다운 메뉴
    		if ( tabData.length > 5 ) {
    			$('.tab_title').addClass('dropOn'); //탭이 6개 이상이면 드롭다운 메뉴 보이기
    		} else {
    			$('.tab_title').removeClass('dropOn'); //탭이 6개 미만이면 드롭다운 메뉴 가리기
    		}

    		renderTabList(); //탭 생성
    		handleActiveTab(length-1); //만든 탭 액티브 디자인적용

    		var thisTop = $('.tab_title li:last-child').position().top; //만든 탭 포지션
    		moveTabList(thisTop); //만든 탭으로 뷰 이동
    	});

    	//탭 액티브 디자인적용
    	function handleActiveTab(index){
    		$('.tab_list li').removeClass('active');
    		$('.dropdown_list li').removeClass('active');

    		$('.tab_list li').eq(index).addClass('active');
    		$('.dropdown_list li').eq(index).addClass('active');
    	}

    	// 탭 생성
    	function renderTabList(){
    		var length = tabData.length;

    		//탭 리스트 비우기
    		$('.tab_list').empty();
    		$('.dropdown_list').empty();

    		for (var i=0; i<length; i++) {
    			//탭 그리기
    			$('.tab_list').append('<li><a href="#none">' + tabData[i]['label'] + '</a><a href="#none" class="btn_close" title="탭삭제버튼"></a></li>');
    			$('.dropdown_list').append('<li><a href="#none">' + tabData[i]['label'] + '</a></li>');
    		}

    		// tab_list 에서 탭 클릭
    		$('.tab_list li').on('click', function(){
    			var thisEl = $('.tab_list li');
    			var thisList = $(this);
    			var thisIndex = thisEl.index(thisList);
    			handleActiveTab(thisIndex); //해당 탭 액티브 디자인적용
    		});

    		// tab_dropdown 에서 탭 클릭
    		$('.tab_dropdown li').on('click', function(){
    			var thisEl = $('.tab_dropdown li');
    			var thisList = $(this);
    			var thisIndex = thisEl.index(thisList);
    			handleActiveTab(thisIndex); //해당 탭 액티브 디자인적용

    			var thisTop = $('.tab_title li').eq(thisIndex).position().top;
    			moveTabList(thisTop); //해당 탭으로 뷰 이동
    		});

    		// 탭 닫기 버튼 클릭
    		$('.tab_title .btn_close').on('click', function(e){
    			var thisTitle = $(this).parent('li').text(); //닫을 탭
    			var thisArr = tabData.findIndex(function(data){ return data.label === thisTitle }); //닫을 탭 확인

    			e.stopPropagation(); //버블링 막는 방어코드
    			closeTabList(thisArr); //탭 닫기
    		});
    	}

    	//탭 닫기
    	function closeTabList(arrIndex) {
    		var tabActive = $('.tab_list li').index($('.tab_list li.active'));
    		var tabLength = (tabData.length) - 1;

    		if (arrIndex > -1) tabData.splice(arrIndex,1); //tabData에서 탭 삭제

    		renderTabList();

    		if ( tabLength === 0 ) {
    			$('.tab_content').empty();
    			return;
    		}

    		// 탭 액티브 디자인적용 유지
    		if ( arrIndex < tabActive ) handleActiveTab(tabActive-1)
    		else if ( arrIndex > tabActive ) handleActiveTab(tabActive)
    		else if ( arrIndex === tabLength ) handleActiveTab(tabLength-1)
    		else handleActiveTab(tabActive)

    		var activeTop = $('.tab_title li.active').position().top; //액티브 유지된 탭
    		moveTabList(activeTop); //액티브 유지된 탭으로 뷰 이동
    	}

    	// 탭으로 뷰 이동
    	function moveTabList(thisTop){
    		var height = $('.tab_title li').height();
    		var index = thisTop/height;
    		$('.tab_list').css({'top': -(height * index) + 'px'});
    	}

    	// 탭 드롭다운 열기
    	$('.tab_dropdown .btn_open').on('click', function(){
    		$('.dropdown_list').toggleClass('active');
    	});

    	// 탭 전체삭제 클릭
    	$('#btn_tab_dlt').on('click', function(){
    		tabData = [];
    		renderTabList();
    		$('.tab_content').empty();
    	});
    	// AMR 200915 탭 이벤트

        // 공통 레이어 팝업
    	$('.btn_lyr_open').on('click',function(){
            var popHref = $(this).attr('href');

            // popup open
            $('body').addClass('lyr_bg_dim');
            $(popHref).css({'display': 'block'});

            // popup close
            $('.btn_lyr_confirm, .btn_lyr_cplt, .btn_lyr_close, .lyr_bg_dimmed').on('click',function(){
                $('body').removeClass('lyr_bg_dim');
                $('.lyrBox').css({'display': 'none'});
            });
        });

        // 공통 클립보드 레이어 팝업
        $('.btn_clipboard').on('click',function(){
            $('body').append(' \
                <div id="lyr_clipboard" class="lyrBox lyr_notify">\
                    <div class="lyr_ct"> \
                        <p class="massage">복사되었습니다.</p> \
                    </div> \
                </div> \
            ');
            $('#lyr_clipboard').show();

            setTimeout(function(){
                $('.lyr_notify').addClass('lyr_hide').delay(300).queue(function(){$(this).remove();});
            }, 400);
        });

        // 공통 저장완료 레이어 팝업
        $('.btn_lyr_save').on('click',function(){
            var thisLayer = $(this).parents('.lyrBox').attr('id');
            var thisLayerHref = $('#' + thisLayer);
            $(thisLayerHref).css({'display': 'none'});

            $('body').append(' \
                <div class="lyrBox lyr_notify">\
                    <div class="lyr_ct"> \
                        <p class="massage">저장 되었습니다.</p> \
                    </div> \
                </div> \
            ');
            $('.lyr_notify').show();

            setTimeout(function(){
                $('.lyr_notify').addClass('lyr_hide').delay(300).queue(function(){$(this).remove();});
                $('body').removeClass('lyr_bg_dim');
            }, 600);
        });

    	// select 스크롤 커스텀
        function customScrollSelectBox(){
            var SelectBoxScroll = $('.sltBox.custom select');
            SelectBoxScroll.each(function (i, select){
                if (!$(this).next().hasClass('slt_scroll')) {
                    $(this).after('<div class="slt_scroll wide ' + ($(this).attr('class') || '') + '" tabindex="0"><span class="current_option"></span><div class="list"><ul></ul></div></div>');
                    var dropdown = $(this).next();
                    var options = $(select).find('option');
                    var selected = $(this).find('option:selected');
                    dropdown.find('.current_option').html(selected.data('display-text') || selected.text());
                    options.each(function (j, o) {
                        var display = $(o).data('display-text') || '';
                        dropdown.find('ul').append('<li class="option ' + ($(o).is(':selected') ? 'selected' : '') + '" data-value="' + $(o).val() + '" data-display-text="' + display + '">' + $(o).text() + '</li>');
                    });
                }
            });

            // Open/close
            $(document).on('click', '.slt_scroll', function(e){
                if($(e.target).hasClass('dd-searchbox')){
                    return;
                }
                $('.slt_scroll').not($(this)).removeClass('open');
                $(this).toggleClass('open');
                if ($(this).hasClass('open')){
                    $(this).find('.option').attr('tabindex', 0);
                    $(this).find('.selected').focus();
                }else{
                    $(this).find('.option').removeAttr('tabindex');
                    $(this).focus();
                }
            });

            // select 박스 외 영역 클릭 시 닫기
            $(document).on('click', function(e){
                if ($(e.target).closest('.slt_scroll').length === 0) {
                    $('.slt_scroll').removeClass('open');
                    $('.slt_scroll .option').removeAttr('tabindex');
                }
                e.stopPropagation();
            });

            // Option 클릭 시 text 가져오기
            $(document).on('click', '.slt_scroll .option', function(e){
                $(this).closest('.list').find('.selected').removeClass('selected');
                $(this).addClass('selected');
                var text = $(this).data('display-text') || $(this).text();
                $(this).closest('.slt_scroll').find('.current_option').text(text);
                $(this).closest('.slt_scroll').prev('select').val($(this).data('value')).trigger('change');
            });

            // Keyboard events
            $(document).on('keydown', '.slt_scroll', function (e) {
                var focused_option = $($(this).find('.list .option:focus')[0] || $(this).find('.list .option.selected')[0]);
                // Space or Enter
                //if (event.keyCode == 32 || event.keyCode == 13) {
                if (e.keyCode == 13) {
                    if ($(this).hasClass('open')) {
                        focused_option.trigger('click');
                    } else {
                        $(this).trigger('click');
                    }
                    return false;
                    // Down
                } else if (e.keyCode == 40) {
                    if (!$(this).hasClass('open')) {
                        $(this).trigger('click');
                    } else {
                        focused_option.next().focus();
                    }
                    return false;
                    // Up
                } else if (e.keyCode == 38) {
                    if (!$(this).hasClass('open')) {
                        $(this).trigger('click');
                    } else {
                        var focused_option = $($(this).find('.list .option:focus')[0] || $(this).find('.list .option.selected')[0]);
                        focused_option.prev().focus();
                    }
                    return false;
                    // Esc
                } else if (e.keyCode == 27) {
                    if ($(this).hasClass('open')) {
                        $(this).trigger('click');
                    }
                    return false;
                }
            });
        }
        customScrollSelectBox();

        // input:text[numberOnly] 숫자만 입력가능
        $('input:text[numberOnly]').on('keyup', function(){
            $(this).val($(this).val().replace(/[^0-9]/gi,""));
        });

        // 콜키 입력박스 숫자, 특수문자(_)만 가능제한
        $('input.callKey').on('keyup', function(){
            $(this).val($(this).val().replace(/[^0-9_]/gi,""));
        });

    	// 초기화 버튼 클릭 시 검색조건 초기화
        $('.btn_reset').on('click', function(){
            $('.srchArea input').val('');
            $('.srchArea .slt_scroll .list .option').removeClass('selected');
            $('.srchArea .slt_scroll .list .option:first-child').addClass('selected');

            var optionSelected = $('.srchArea .slt_scroll .list .option.selected');
            optionSelected.each(function(){
                var optionText = $(this).text();
                $('.current_option').text(optionText);
            });
        });

        // 테이블 내 조회 또는 설정 버튼 클릭 시 해당 목록 하이라이트
        $('.btn_check, .btn_set').on('click', function(){
            $(this).parent('tbody').find('tr').removeClass('active');
            $(this).parent('tr').addClass('active');
        });

        // 팝업 하단 닫기버튼 클릭 시 새창팝업 닫힘
        $('.pop_btm .btnBox .btn_close').on('click', function(){
            opener.$('.tbl_include_btn tbody tr').removeClass('active');    // 20.10.10 추가
            window.open('about:blank', '_self').close();
        });

        // 팝업 상단 닫기버튼 클릭 시 상위페이지 라인 하이라이팅 제거 (20.10.10 추가)
        onbeforeunload = function(){
            opener.$('.tbl_include_btn tbody tr').removeClass('active');
        }

        // 설정 영역 내 테이블 상단 수정버튼 클릭 시 저장, 삭제, 취소버튼 보여주기
        $('.btn_change_group .btn_edit').on('click', function(){
            $(this).hide();
            $(this).siblings('.btn_edit_show').css('display', 'inline-block');
        });
        // 설정 영역 내 테이블 상단 취소버튼 클릭 시 수정버튼 보여주기
        $('.btn_change_group .btn_cancel, .btn_change_group .btn_cplt').on('click', function(){
            $(this).parent('.btn_change_group').find('.btn_edit_show').css('display', 'none');
            $(this).parent('.btn_change_group').find('.btn_edit').show();
        });

        // 스크롤 테이블 목록 특정갯수 초과일때 스크롤바 추가되면서 어긋나는 테이블 레이아웃 맞춰주기
        function handleScrollTableHeader(){
            $('.tbl_scroll').each(function (){
                // 3개일때
                if( $(this).hasClass('three_line') && $(this).find('tr').length > 3 ) {
                    $(this).siblings('.tbl_hd').css({'padding-right': getScrollBarWidth() + 'px'});
                // 5개일때
                }else if( $(this).hasClass('five_line') && $(this).find('tr').length > 5 ) {
                        $(this).siblings('.tbl_hd').css({'padding-right': getScrollBarWidth() + 'px'});
                // 10개일때
                }else if( $(this).hasClass('ten_line') && $(this).find('tr').length > 10 ) {
                        $(this).siblings('.tbl_hd').css({'padding-right': getScrollBarWidth() + 'px'});
                }
            });
        };
        handleScrollTableHeader();

        // 테이블 내 조회 또는 추가 버튼 클릭 시 하단 설정 테이블 영역 보여주며 handleScrollTableHeader 실행
        $('.btn_check, .btn_add').on('click', function(){
            $('.setArea').show();

            // 스크롤 테이블 특정갯수 초과일때 스크롤바 추가되면서 어긋나는 테이블 레이아웃 맞춰주기
            handleScrollTableHeader();
        });
    });
});
