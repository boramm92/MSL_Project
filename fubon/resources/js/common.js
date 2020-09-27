/* MINDsLab. NBR. 20200902 */

// 공통 스크립트
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

    // 체크박스 전체 선택 기능
    $("input[type=checkbox]").on('click', function() {
        $('input[name=\''+this.id+'\']').not(this).prop('checked', this.checked);
        $('#'+this.name).prop('checked', $('input[name=\''+this.name+'\']').length ===                  $('input[name=\''+this.name+'\']').filter(':checked').length);
    });

    // 데이터 테이블스에서 input 체크가 정상적으로 되지 않아 작성된 코드
    // 전체 선택 클릭 시 (dataTables_scrollHead에서 상태를 받아와서 DTFC_Cloned에 적용)
    $('.all_chk').on('click', $('.dataTables_scrollHead'), function(){
        var thisName = $(this).attr('name');
        var check = $(this).prop('checked');
        var $this = $('.DTFC_Cloned .all_chk[name=\''+thisName+'\']');
        var $childCheck = $('.each_chk[name=\''+thisName+'\']');

        if ( check == false ) { // 전체선택 체크가 false이면 자식들도 false
            $this.prop('checked', false);
            $childCheck.prop('checked', false);
        } else { // 전체선택 체크가 true이면 자식들도 true
            $this.prop('checked', true);
            $childCheck.prop('checked', true);
        }
    });

    // 개별 체크박스 클릭 시 (dataTables_scrollBody에서 상태를 받아와서 DTFC_Cloned에 적용)
    $('.each_chk').on('click', $('.dataTables_scrollBody'), function(){
        var $thisCheckbox = $(this);
        var thisName = $thisCheckbox.attr('name');
        var thisId = $thisCheckbox.attr('id');
        var $this = $('.DTFC_Cloned .each_chk[id=\''+thisId+'\']');
        var check = $thisCheckbox.prop('checked');

        if ( check == false ) {
            $this.prop('checked',false);
        } else {
            $this.prop('checked', true);
        }

        var checkboxes = $('.DTFC_Cloned .each_chk[name=\''+thisName+'\']');
        var $allCheck = $('.DTFC_Cloned .all_chk[name=\''+thisName+'\']');
        var length = checkboxes.length;

        // 자식 중 체크 false가 있으면 전체선택 false
        for (var i=0; i<checkboxes.length; i++) {
            if ( checkboxes[i].checked == false ) {
              $allCheck.prop('checked', false);
              return;
            }
        }
        // 자식 중 체크 false가 없으면 전체선택 true
        $allCheck.prop('checked', true);
    });
});
