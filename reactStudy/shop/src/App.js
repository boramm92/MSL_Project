import React, {useState} from 'react';
import { Navbar, Container, Nav, NavDropdown, Jumbotron, Button } from 'react-bootstrap';
import './App.css';
import Data from './data.js';
import Detail from './Detail.js';
import { Link, Route, Switch } from 'react-router-dom';

function App() {
  // 데이터는 최상위 컴포넌트에서 사용하는 것이 보편적
  let [shoes, setShoes] = useState(Data);

  return (
    <div className="App">
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="#home">ShoeShop</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/detail">Detail</Nav.Link>
              <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Switch>
        <Route exact path="/">
          <Jumbotron className="background">
            <h1>20% Season Off</h1>
            <p>
              This is a simple hero unit, a simple jumbotron-style component for calling
              extra attention to featured content or information.
            </p>
            <p>
              <Button variant="primary">Learn more</Button>
            </p>
          </Jumbotron>

          <div className="container">
            <div className="row">
              {  
                shoes.map(function(a, i){
                return (
                  <Product shoes={shoes[i]} i={i} key={i}/>
                )
                })
              }
            </div>
          </div>
        </Route>
        
        {/* /detail/:id의 콜론은 아무 문자나 받겠다는 url 작명법 */}
        {/* - 콜론 뒤에 맘대로 작명 */}
        {/* - 여러개 사용 가능 */}
        <Route path="/detail/:id">
          <Detail shoes={shoes}></Detail>
        </Route>
        {/* <Route path="/" component={ Modal }></Route> */}    

        <Route path="/:id">
          <div>아무거나 적었을 때 이거 보여줌</div>
        </Route>
      </Switch>
    </div>
  );
}

// 1. component로 만들어 첨부하기
// 2. component에 데이터 바인딩 완료하기
// 3. component를 반복문 돌리기

function Product(props){
  return (
    <div className="col-md-4">
      <img src={ 'https://codingapple1.github.io/shop/shoes' + (props.i+ 1) + '.jpg' } width="100%" />
      <h4>{ props.shoes.title }</h4>
      <p>{ props.shoes.content } & { props.shoes.price }</p>
    </div>
  )
}

export default App;
