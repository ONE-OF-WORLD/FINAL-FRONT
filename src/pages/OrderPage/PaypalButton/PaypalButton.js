import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import PaypalExpressBtn from 'react-paypal-express-checkout';
import axios from 'axios';

const PaypalButton = props => {
  let history = useHistory();
  const { price, productId } = props;
  console.log(typeof price, typeof productId);
  const onSuccess = payment => {
    alert('구매해 주셔서 감사합니다!');
    const headers = { Authorization: localStorage.getItem('token') };
    axios
      .post(
        'http://192.168.0.205:8000/users/purchase-history',
        {
          product_id: Number(productId),
          price: price,
          payerID: payment.payerID,
          paymentID: payment.paymentID,
          paymentToken: payment.paymentToken,
        },
        {
          headers,
        }
      )
      .then(res => console.log(res));
    history.push('/mypage');
  };

  const onCancel = data => {
    alert('결제가 취소 되었습니다!');
    console.log('The payment was cancelled!', data);
  };
  const onError = err => {
    alert('시스템 에러가 발생 했습니다!');
    console.log('Error!', err);
  };
  let env = 'sandbox';
  let currency = 'USD';
  let total = price / 1000;

  const client = {
    sandbox:
      'Aet-9GcHe07xgEcXk6yXU2zzf7x6js8i9NQYIcn1pXFUgGfOsGB9XDCf7-O_M41JGyMvOLmmI4CUgCa0',
    production: 'sb-6enos6208826@business.example.com',
  };

  return (
    <PaypalExpressBtn
      env={env}
      client={client}
      currency={currency}
      total={total}
      onError={onError}
      onSuccess={onSuccess}
      onCancel={onCancel}
    />
  );
};

export default PaypalButton;
