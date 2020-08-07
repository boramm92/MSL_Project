<!-- script [boram] -->
<script type="text/javascript">
    $(document).ready(function(){
        // 방문 불가 설정 달력 calendar
        var calendarEl = document.getElementById('calendar');
        var calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            initialDate: new Date(),
            selectable: false,
            contentHeight: 'auto',
            locale : 'ko',
            header: {
                left: 'title',
                right: 'prev, next'
            },
            views: {
                dayGridMonth: {
                    titleFormat: {
                        year: 'numeric',
                        month: 'numeric'
                    },
                },
            },
        });
        calendar.render();

        // 날짜 숫자만 추출
        function dayExtractNum(){
            var dayLabel = $('.fc-daygrid-day-number');

            dayLabel.each(function(index, dayLabel){
                var dayNum = $(this).text();
                dayNum = dayNum.replace('일', '');
                console.log(dayNum);
                $(this).html(dayNum);
            });
        }dayExtractNum();

        // 시간 선택 박스 width와 동일한 height 주기
        var timeBoxwidth = $('.time_lst li').width();
        $('.time_lst li').height(timeBoxwidth);

        // 스케줄 활성/비활성 버튼 팝업
        $('.btn_scdl_disable label').on('click', function(){
            if( $('.btn_scdl_disable input').prop('checked') === true){
                $('body').addClass('lyr_backdrop');
                $('#schedule_activate').css('display', 'block');
                setTimeout(function() {
                    $('#schedule_activate').addClass('on') //레이어 오픈 효과 적용
                }, 100);
            }else{
                $('body').addClass('lyr_backdrop');
                $('#schedule_disable').css('display', 'block');
                setTimeout(function() {
                    $('#schedule_disable').addClass('on') //레이어 오픈 효과 적용
                }, 100);
            };
        });

        // 레이어 닫기버튼 클릭
        $('.lyr_close').on('click', function(){
            $('.lyr_pop').css('display', 'none');
            $('.lyr_pop').removeClass('on');
            $('body').removeClass('lyr_backdrop');

           //  setTimeout(function(){
           //     $('body').removeClass('lyr_backdrop');
           // }, 100);
        });

        // 요일 선택 시 활성화
        $('.week_lst li').on('click', function(){
            $('.week_lst li').removeClass('on');
            $(this).addClass('on');
        });

        // 시간 선택 시 활성화
        $('.time_lst li').on('click', function(){
            $(this).toggleClass('on');
        });

        function handleScheduleTouchEvent(){
            var startX = 0;
            var moveX = 0;

            $('.time_lst li').on('touchstart', function(e){
                startX = e.originalEvent.touches[0].clientX;
                // console.log(startX)
                // e.preventDefault()
                // alert('터치시작');
            });

            $(document).on('touchmove', function(e){
                moveX = e.originalEvent.touches[0].clientX - startX;
                console.log('touchmove');
                $('.time_lst li').on('touchenter', function(){
                    console.log('touchenter');
                });
                // console.log({startX, moveX})
                // console.log(document.elementFromPoint(touch.x, touch.y))
                // e.preventDefault()
                // alert('터치시작');
            });
        }
        handleScheduleTouchEvent()

        // 스케줄 저장 버튼 터치 이벤트
        $('.btm_box button').on('touchstart', function(){
            $(this).addClass('on');
        });
        $('.btm_box button').on('touchend', function(){
            $(this).removeClass('on');
        });

        // 일자 선택 박스 width와 동일한 height 주기
        var dateBoxwidth = $('.fc-daygrid th').width();
        $('.fc-day').height(dateBoxwidth);

        // 달력 넘기기 버튼 클릭 시
        $('.fc-button').on('click', function(){
            // 일자 선택 박스 width와 동일한 height 주기
            var dateBoxwidth = $('.fc-daygrid th').width();
            $('.fc-day').height(dateBoxwidth);
            // 달력 선택 일자 활성화
            $('.fc-scrollgrid-sync-table tbody .fc-day').on('click', function(){
                $(this).addClass('on');
            });
        });

        // 공통 tap list 열기/닫기
        function handleTapList() {
            var setBtn = $('.set_btn_box li');
            var setCont = $('.set_board > div');

            setCont.hide();
            setCont.eq(0).show();

            setBtn.on('click', function () {
                var target = $(this);
                var index = target.index();
                setBtn.removeClass('on');
                target.addClass('on');
                setCont.css('display', 'none');
                setCont.eq(index).css('display', 'block');
                });
            }
        handleTapList();

        // 달력 선택 일자 활성화
        $('.fc-scrollgrid-sync-table tbody .fc-day').on('click', function(){
            $(this).toggleClass('on');
        });
    });

    $(window).resize(function(){
        // 시간 선택 박스 width와 동일한 height 주기
        var timeBoxwidth = $('.time_lst li').width();
        $('.time_lst li').height(timeBoxwidth);

        // 일자 선택 박스 width와 동일한 height 주기
        var dateBoxwidth = $('.fc-daygrid th').width();
        $('.fc-day').height(dateBoxwidth);
    });
</script>
