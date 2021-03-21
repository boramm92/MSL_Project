(() => {
    let yOffset = 0;    // window.pageYOffset 대신 쓸 변수
    let prevScrollHeight = 0;   // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
    let currentScene = 0;   // 현재 활성화된(눈 앞에 보고있는) 씬(scroll_section)

    const sceneInfo = [
        {
            // #scroll_section01
            type: 'sticky',
            heightNum: 5,      //브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll_section01')
            }
        },
        {
            // #scroll_section02
            type: 'normal',
            heightNum: 5,      //브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll_section02')
            }
        },
        {
            // #scroll_section03
            type: 'sticky',
            heightNum: 5,      //브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll_section03')
            }
        },
        {
            // #scroll_section04
            type: 'sticky',
            heightNum: 5,      //브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll_section04')
            }
        }
    ];

    function setLayout(){
        // 각 스크롤 섹션의 높이 세팅
        for(let i = 0; i < sceneInfo.length; i++){
            sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
            sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
        }
    };
   
    function scrollLoop(){
        for(let i = 0; i < currentScene; i++){
            prevScrollHeight += sceneInfo[i].scrollHeight;
        }
        if(yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight){
            currentScene++;
        }
        if(yOffset < prevScrollHeight){
            currentScene--;
        }
        console.log(currentScene)
    };

    window.addEventListener('resize', setLayout);
    window.addEventListener('scroll', () => {
        yOffset = window.pageYOffset;
        scrollLoop();
    });

    setLayout();
})();
