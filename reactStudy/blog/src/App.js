import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {

  let [글제목, 글제목변경] =  useState(['남자 코트 추천', '강남 맛집 추천', '주간 영화 순위']);
  let [좋아요, 좋아요변경] = useState(0);
  let [showModal, setShowModal] = useState(false);
  let [클릭한제목, 클릭한제목변경] = useState(0);
  let [입력값, 입력값변경] = useState('');  // 빈따옴표는 초기값

  // 리액트에서 많이 쓰는 반복문
  // function 반복UI(){
  //   var array = [];

  //   for(var i = 0; i < 3; i++){
  //     array.push(<div>안녕</div>);
  //   }
  //   return array;
  // }

  function changText(){
    // state는 직접 수정할 수 없기 때문에 newArray라는 변수에 복사본을 저장. *spread 연산자 사용
    var newArray = [...글제목];
    // newArray의 0번째 데이터를 '여자 코트 추천'으로 변경.
    newArray[0] = '여자 코트 추천';
    // 글제목변경() 함수 안에 넣어서 글제목 state를 변경.
    글제목변경(newArray);   
  }

  function 오름차순정렬(){
    var newArray = [...글제목].sort();
    글제목변경(newArray);
  }

  function 내림차순정렬(){
    var newArray = [...글제목];

    newArray.sort(function(a, b){
      if(a < b) return 1;
      if(a > b) return -1;
      if(a === b) return 0;
    });
    글제목변경(newArray);
  }

  return (
    <div className="App">
      <div className="black_nav">
        <div>개발 Blog</div>
      </div>
      <button onClick={ changText }>수정버튼</button>
      <button onClick={ 오름차순정렬 }>오름차순 정렬버튼</button>
      <button onClick={ 내림차순정렬 }>내림차순 정렬버튼</button>
      {/* <div className="list">
        <h3>{ 글제목[0] } <span onClick={ ()=>{ 좋아요변경(좋아요 + 1) } }>👍</span> { 좋아요 }</h3>
        <p>2월 17일 발행</p>
        <hr/>
      </div>
      <div className="list">
        <h3>{ 글제목[1] }</h3>
        <p>2월 17일 발행</p> 
        <hr/>
      </div>
      <div className="list">
        <h3>{ 글제목[2] }</h3>
        <p>2월 17일 발행</p>
        <hr/>
      </div> */}

      {/* { 반복UI() } */}

      <button onClick={ ()=>{setShowModal(!showModal)} }>modal버튼</button>
      {
        showModal === true
        ? <Modal 글제목={ 글제목 } 클릭한제목={ 클릭한제목 }></Modal>
        : null
      }
      <br/><br/>

      {/* map() 함수를 사용한 반복문 */}  
      {
        글제목.map(function(a, i){
          return (
            // 반복문을 사용한 요소에는 꼭 key를 적으라고 권장함 *미기재 시 콘솔 에러 뜸
            <div className="list" key={ i }>
              <h3 onClick={ ()=>{ 클릭한제목변경(i) } }>{ a } <span onClick={ ()=>{ 좋아요변경(좋아요 + 1) } }>👍</span> { 좋아요 }</h3>
              <p>2월 18일 발행</p> 
              <hr/>
            </div>
          )
        })
      }

      {/* 게시물 추가 기능 */}
      <div className="publish">
        <input type="text" onChange={ (e)=>{ 입력값변경(e.target.value) } } />
        <button onClick={ ()=>{
          var arrayCopy = [...글제목];
          arrayCopy.unshift(입력값);
          글제목변경(arrayCopy)
        } }>저장</button>
      </div>

      <Profile></Profile>

      {/* <input type="text" onChange={ (e)=>{ 입력값변경(e.target.value) } } /> */}
    </div>
  );
}

// [Component 유의사항]
// - 반복 사용되는 마크업, 자주 변경되는 UI, 다른 페이지
// - 이름은 대문자로 시작
// - return()안에 마크업은 태그하나로 묶어야함 *의미 없는 div 사용을 지양하고 싶다면 Fragment 사용
// - state 사용 시 복잡해질 수 있음 *상위 component에서 만든 state 사용 시 props 문법 이용해야함
function Modal(props){
  return (
    <div className="modal"> 
      <h2>제목 : { props.글제목[props.클릭한제목] }</h2>
      <p>날짜</p>
      <p>상세내용</p>
    </div>
  )
}

// [class를 이용한 예전 문법]
// - class : 변수/함수 보관하는 덩어리 같은 놈
// - extends : 오른쪽에 있는 놈의 성질을 물려받는 놈
// - constructor : class의 변수/초기값 저장할 때 쓰는 놈
// - state는 constructor 안에 작성
class Profile extends React.Component {
  constructor(){
    super();
    this.state = { name : 'Kim', age : 30 }
  }  

  changeName = () => {
    this.setState({ name : 'Park' })
  }

  render(){
    return(
      <div>
        <h3>프로필입니다.</h3>
        <p>저는 { this.state.name }입니다.</p>
        <button onClick={ this.changeName }>버튼</button>
      </div>
    )
  }
}

export default App;
