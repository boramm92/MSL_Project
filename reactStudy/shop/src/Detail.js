import React, {useState} from 'react';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';

let Box = styled.div`
    padding:20px;
`;

let Title = styled.h4`
    font-size:25px;
    color:${ props => props.color }
`;


function Detail(props){
    // 라우터의 useParams 훅
    let { id } = useParams();
    let selectProduct = props.shoes.find(function(product){
        return product.id == id
    });

    let history = useHistory();

    return (
      <div className="container">
        <Box>
            <Title>Detail</Title>
            <Title color={ 'red' }>Detail</Title>
            <Title color='blue'>Detail</Title>
        </Box>
        <div className="row">
          <div className="col-md-6">
            <img src="https://codingapple1.github.io/shop/shoes1.jpg" width="100%" />
          </div>
          <div className="col-md-6 mt-4">
            <h4 className="pt-5">{ selectProduct.title }</h4>
            <p>{ selectProduct.content }</p>
            <p>{ selectProduct.price }</p>
            <button className="btn btn-danger">주문하기</button> 
            {/* 이전 페이지로 이동할 경우 */}
            <button className="btn btn-danger" onClick={ ()=>{ history.goBack(); } }>뒤로가기</button> 
            {/* 특정 페이지로 이동할 경우 */}
            {/* <button className="btn btn-danger" onClick={ ()=>{ history.push('/이동할경로'); } }>뒤로가기</button>  */}
          </div>
        </div>
      </div>
    )
}

export default Detail;