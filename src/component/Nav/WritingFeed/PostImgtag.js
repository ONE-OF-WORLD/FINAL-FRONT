import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import Modal from '../Modal/Modal';
import styled from 'styled-components';
import axios from 'axios';

const DraggableButtonInCard = ({ url, handleButtonData, buttonData }) => {
  const [position, setPosition] = useState({
    id: 0,
    xx: 0,
    yy: 0,
    product_id: 0,
  });
  const [plusAndSubmit, setPlusAndSubmit] = useState(true);
  const [purchaseProduct, setPurchaseProduct] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState([
    {
      id: 0,
      thumbnail: '',
      name: '',
      price: '',
    },
  ]);
  const [targetbutton, setTargetbutton] = useState(0);
  const [productsListModal, setProductsListModal] = useState(false);

  useEffect(() => {
    const headers = {
      Authorization: localStorage.getItem('token'),
    };
    axios
      .get('http://192.168.0.205:8000/users/purchase-history', { headers })
      .then(response => {
        setPurchaseProduct(response.data.RESPONSE);
      })
      .catch(err => console.error(err));
  }, []);

  const dragButton = data => {
    setPosition(prev => {
      return {
        ...prev,
        xx: data.x,
        yy: data.y,
      };
    });
  };

  const cancelPlusButton = ({ target }) => {
    if (target.name === 'totalCencel') {
      handleButtonData(0);
      setPlusAndSubmit(true);
    } else {
      if (target.name === 'goBack') {
        setProductsListModal(!productsListModal);
      }
      setPosition(prev => {
        return {
          ...prev,
          id: position.id - 1,
          product_id: 0,
        };
      });
      setPlusAndSubmit(!plusAndSubmit);
    }
  };

  const plusbutton = ({ target }) => {
    if (target.name === 'plus') {
      setProductsListModal(!productsListModal);
      setPosition(prev => {
        return { ...prev, id: position.id + 1 };
      });
      setPlusAndSubmit(!plusAndSubmit);
    } else if (position.xx === 0 && position.yy === 0) {
      alert('태그버튼을 옮겨주세요');
    } else {
      handleButtonData(position);
      setPosition(prev => {
        return { ...prev, xx: 0, yy: 0 };
      });
      setPlusAndSubmit(!plusAndSubmit);
    }
  };

  const aboutProduct = ({ target }) => {
    if (Number(target.id) !== 0) {
      const targetProduct = buttonData.filter(data => {
        return data.id === Number(target.id);
      });
      setSelectedProduct(
        purchaseProduct.filter(({ id }) => {
          return id === targetProduct[0].product_id;
        })
      );
    }
    setTargetbutton(target.id);
  };

  const stop = e => {
    e.stopPropagation();
  };

  const button =
    buttonData &&
    buttonData.map(({ id, xx, yy, product_id }) => {
      return (
        <div onClick={stop} key={id + xx}>
          <Draggable
            disabled={true}
            key={id}
            defaultPosition={{ x: xx, y: yy }}
          >
            <Button id={id} onClick={aboutProduct}>
              +
            </Button>
          </Draggable>
          {id === Number(targetbutton) && (
            <Draggable
              disabled={true}
              defaultPosition={{ x: xx + 12, y: yy + 12 }}
            >
              <HoverButton>
                <ProductImg src="./images/img.jpg" />
                <ProductInfo>
                  <Product name="productName">
                    {selectedProduct[0].name}
                  </Product>
                  <Product>{selectedProduct[0].price}</Product>
                </ProductInfo>
                <div>
                  <Select>선택</Select>
                </div>
              </HoverButton>
            </Draggable>
          )}
        </div>
      );
    });

  const onOffModal = id => {
    if (id !== 'products') {
      setPosition(prev => {
        return {
          ...prev,
          product_id: id,
        };
      });
      setProductsListModal(!productsListModal);
    }
  };

  let purchaseProductCount = purchaseProduct ? purchaseProduct.length : 0;

  return (
    <DraggableContainer>
      <ImgTagcontainer id={0} onClick={aboutProduct} url={url}>
        {!plusAndSubmit && (
          <Draggable
            bounds="parent"
            onDrag={(e, data) => dragButton(data)}
            defaultPosition={{ x: 0, y: 0 }}
          >
            <Button onClick={stop}>+</Button>
          </Draggable>
        )}
        {button}
        {productsListModal && (
          <Modal name="products" id="products" onOffModal={onOffModal}>
            <ProductButton title="title">
              {purchaseProductCount === 0
                ? '구매하신 목록이 없습니다 !'
                : '구매 목록 중 상품을 선택해주세요'}
            </ProductButton>

            {purchaseProduct &&
              purchaseProduct.map(
                ({ product_id, product_image, product, price }) => {
                  return (
                    <ProductButton
                      onClick={() => onOffModal(product_id)}
                      key={product_id}
                    >
                      <ProductImg src={product_image} />
                      <ProductInfo>
                        <Product name="productName">{product}</Product>
                        <Product>{price}원</Product>
                      </ProductInfo>
                      <div>
                        <Select>선택</Select>
                      </div>
                    </ProductButton>
                  );
                }
              )}
            <ProductButton name="goBack" onClick={cancelPlusButton}>
              돌아가기
            </ProductButton>
          </Modal>
        )}
      </ImgTagcontainer>
      <TagButtonBox>
        {plusAndSubmit ? (
          <TagButton name="plus" onClick={plusbutton}>
            추가하기
          </TagButton>
        ) : (
          <TagButton name="sumit" onClick={plusbutton}>
            등록하기
          </TagButton>
        )}
        {!plusAndSubmit && (
          <TagButton name="cencel" onClick={cancelPlusButton}>
            취소하기
          </TagButton>
        )}
        <TagButton name="totalCencel" onClick={cancelPlusButton}>
          태그 전부 삭제
        </TagButton>
      </TagButtonBox>
    </DraggableContainer>
  );
};

export default DraggableButtonInCard;
const TagButtonBox = styled.div`
  display: flex;
  padding: 10px;
`;
const TagButton = styled.button`
  margin: 10px;
  padding: 11px 45px 12px;
  border-radius: 4px;
  color: rgb(255, 255, 255);
  background-color: rgb(53, 197, 240);
  font-size: 16px;
  font-weight: bold;
  line-height: 22px;
  border: none;
  cursor: pointer;
  &:hover {
    background-color: rgb(100, 200, 255);
  }
  &:hover {
    color: rgb(53, 197, 240);
  }
`;
const DraggableContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 630px;
  margin-right: 30px;
  border: 1px dotted #9aa1a7;
  background: #f6f8fa;
  font: inherit;
  border-radius: 5px;
  cursor: pointer;
`;

const ImgTagcontainer = styled.div`
  position: relative;
  height: 400px;
  width: 630px;
  border-radius: 5px;
  background-image: ${({ url }) => `url(${url})`};
  background-size: 100%;
  cursor: pointer;
`;

const ProductButton = styled.button`
  display: flex;
  position: ${props => (props.type ? 'absolute' : '')};
  width: 100%;
  align-items: center;
  margin: 0px;
  padding: 6px 16px;
  color: ${props => (props.title ? '#35c5f0' : '')};
  background: white;
  border-style: none;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    background-color: #ededed;
  }
`;

const HoverButton = styled.button`
  display: flex;
  position: absolute;
  align-items: center;
  width: 280px;
  margin: 0px;
  padding: 6px 16px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 6px 0px;
  background-color: rgba(255, 255, 255, 0.86);
  border-style: none;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  z-index: 10000;
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 15px;
  border-radius: 22px;
  box-sizing: border-box;
  text-align: left;
  cursor: pointer;
`;

const Select = styled.div`
  text-align: center;
  padding: 6px 15px;
  line-height: 20px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  background-color: #35c5f0;
`;

const Product = styled.div`
  font-weight: 700;
  color: #424242;
  font-size: ${props => (props.name ? '13px' : '11px')};
  font-weight: ${props => (props.name ? '700' : '400')};
  line-height: 19px;
`;

const ProductImg = styled.img`
  width: 70px;
  height: 70px;
  margin-right: 15px;
  border: 0.3px solid #35c5f0;
  border-radius: 20px;
`;

const Button = styled.button`
  position: absolute;

  width: 24px;
  height: 24px;
  color: white;
  border-radius: 50%;
  border: none;
  background-color: #36c5f1;
`;
