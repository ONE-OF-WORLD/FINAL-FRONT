import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SideImg from './SideImg';
import DetailInfo from './DetailInfo';
import styled from 'styled-components';
import { useParams } from 'react-router';
const DetailPage = () => {
  const [data, setData] = useState({});
  const product = useParams();

  useEffect(() => {
    axios
      .get(`http://192.168.0.205:8000/products/${product.id}/detail`)
      .then(res => {
        setData(res.data);
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <Wrap>
      <SideImg data={data} />
      <DetailInfo data={data} productId={product.id} />
    </Wrap>
  );
};
const Wrap = styled.main`
  display: flex;
  width: 1136px;
  margin: 170px auto;
`;

export default DetailPage;
