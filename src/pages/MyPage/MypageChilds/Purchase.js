import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Purchase = () => {
  const [items, setItems] = useState([]);
  useEffect(() => {
    const headers = { Authorization: localStorage.getItem('token') };
    axios
      .get('http://192.168.0.205:8000/users/purchase-history', {
        headers,
      })
      .then(res => {
        setItems(res.data.RESPONSE);
      });
  }, []);

  return (
    <>
      <PurchaseBox>
        <DateTitle>주문일자</DateTitle>
        <NameTitle>상품명</NameTitle>
        <PriceTitle>결제금액</PriceTitle>
        <ButtonBox>배송현황</ButtonBox>
      </PurchaseBox>
      <ul>
        {items &&
          items.map((item, index) => (
            <PurchaseList key={index}>
              <PurchaseDate>{item.date}</PurchaseDate>
              <ProductName>{item.product}</ProductName>
              <ProductPrice>
                {Number(item.price).toLocaleString()}원
              </ProductPrice>
              <Button>조회</Button>
            </PurchaseList>
          ))}
      </ul>
    </>
  );
};

const PurchaseBox = styled.div`
  display: flex;
  border-top: 2px solid ${props => props.theme.gray};
  border-bottom: 2px solid ${props => props.theme.gray};
`;

const DateTitle = styled.span`
  width: 180px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-weight: 700;
  border-right: 1px solid ${props => props.theme.lightg};
`;

const NameTitle = styled.span`
  width: 360px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-weight: 700;
  border-right: 1px solid ${props => props.theme.lightg};
`;

const PriceTitle = styled.span`
  width: 180px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-weight: 700;
  border-right: 1px solid ${props => props.theme.lightg};
`;

const ButtonBox = styled.span`
  width: 150px;
  height: 50px;
  line-height: 50px;
  font-weight: 700;
  text-align: center;
`;

const PurchaseList = styled.li`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 50px;
  font-size: 18px;
  border-bottom: 1px solid #d6d6d6;
`;

const PurchaseDate = styled.div`
  width: 180px;
  text-align: center;
`;

const ProductName = styled.div`
  width: 340px;
  text-align: center;
  margin-left: 20px;
`;
const ProductPrice = styled.div`
  width: 180px;
  text-align: center;
`;
const Button = styled.button`
  width: 150px;
  text-align: center;
  background-color: transparent;
  border: none;
  cursor: pointer;
`;
export default Purchase;
