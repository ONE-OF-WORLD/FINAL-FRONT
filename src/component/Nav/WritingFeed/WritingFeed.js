import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import DraggableButtonInCard from './PostImgtag';

const WriteFeed = ({ onOffModal }) => {
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [place, setPlace] = useState([]);
  const [preview, setPreview] = useState('');
  const [buttonData, setButtonData] = useState([]);

  const handleButtonData = position => {
    if (!position) {
      setButtonData([]);
    } else {
      setButtonData(prev => {
        return [...prev, position];
      });
    }
  };

  const uploadFeed = () => {
    if (!content || !file || !place) {
      alert('내용을 모두 입력해주세요!!!');
      return;
    }
    let tagData;
    if (buttonData.length !== 0) {
      let a = '';
      let b = '';
      for (let i = 0; i < buttonData.length; i++) {
        a = `{"xx" : ${buttonData[i].xx}, "yy" : ${buttonData[i].yy},"product_id" : ${buttonData[i].product_id}},`;
        b += a;
      }
      tagData = `{"tags":[${b.slice(0, -1)}]}`;
    } else {
      tagData = `{"tags":[]}`;
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('content', content);
    formData.append('design_type', place);
    formData.append('list', tagData);

    const headers = {
      Authorization: localStorage.getItem('token'),
    };

    axios
      .post('http://192.168.0.205:8000/posting', formData, { headers })
      .then(response => {
        onOffModal('write');
        window.location.reload();
      })
      .catch(err => console.error(err));
  };
  const uploadFile = e => {
    e.preventDefault();
    let file = e.target.files[0];
    setFile(file);
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = e => {
      setPreview(e.target.result);
    };
  };
  const handleTextarea = e => {
    const newContent = e.target.value;
    setContent(newContent);
  };
  const selectType = e => {
    setPlace(e.target.value);
  };
  return (
    <Wrapper>
      <Topbar>
        <ContentContainer>
          <li>
            <Content>사진</Content>
          </li>
        </ContentContainer>
      </Topbar>
      <BottomContainer>
        <BottomContents>
          {preview ? (
            <DraggableButtonInCard
              handleButtonData={handleButtonData}
              url={preview}
              buttonData={buttonData}
            ></DraggableButtonInCard>
          ) : (
            <ImageUpload>
              <ButtonContents>
                <UploadIcon src="./images/camera.png" alt="camera" />
                <UploadTitle htmlFor="files">사진 올리기</UploadTitle>
                <UploadDescription htmlFor="files">
                  (*최대 1장까지)
                </UploadDescription>
                <input
                  id="files"
                  type="file"
                  accept="image/*"
                  onChange={e => uploadFile(e)}
                  style={{ display: 'none' }}
                />
              </ButtonContents>
            </ImageUpload>
          )}

          <ArticleContainer>
            <SelectSpace onChange={selectType}>
              <option value="0">공간(필수)</option>
              <option value="원룸">원룸</option>
              <option value="거실">거실</option>
              <option value="침실">침실</option>
              <option value="주방">주방</option>
              <option value="욕실">욕실</option>
            </SelectSpace>
            <FeedTextArea
              placeholder="내용을 입력하세요."
              defaultValue=""
              onChange={handleTextarea}
            />
            <div>
              <PostButton onClick={uploadFeed}>올리기</PostButton>
            </div>
          </ArticleContainer>
        </BottomContents>
      </BottomContainer>
    </Wrapper>
  );
};

export default WriteFeed;

const Wrapper = styled.div`
  background-color: white;
  padding: 50px;
`;

const Topbar = styled.div`
  border-top: 1px solid lightgray;
  border-bottom: 1px solid lightgray;
`;
const ContentContainer = styled.ul`
  display: flex;
  padding-left: 50px;
`;
const Content = styled.button`
  width: 100%;
  padding: 20px 5px 10px;
  padding-bottom: 13px;
  margin-right: 10px;
  font-size: 15px;
  border-top: none;
  border-right: none;
  border-left: none;
  background: none;
  font-style: inherit;
  font-variant: inherit;
  font-stretch: inherit;
  font-family: inherit;
  font-weight: bold;
  font-size: 17px;
  line-height: 21px;
  cursor: pointer;
  border-bottom: 3px solid rgb(53, 197, 240);
  &:hover {
    color: rgb(53, 197, 240);
  }
`;
const BottomContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 100px;
`;
const BottomContents = styled.div`
  display: flex;
  margin: 0 auto;
`;
const ImageUpload = styled.button`
  width: 630px;
  margin-right: 30px;
  border: 1px dotted #9aa1a7;
  background: #f6f8fa;
  font: inherit;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #f5f5f5;
    border: 1px dotted black;
  }
`;
const ArticleContainer = styled.article`
  display: flex;
  flex-direction: column;
`;
const ButtonContents = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const UploadIcon = styled.img`
  width: 50px;
`;
const UploadTitle = styled.label`
  color: rgb(130, 140, 148);
  font-weight: bold;
  font-size: 15px;
  line-height: 22px;
  &:hover {
    cursor: pointer;
  }
`;
const UploadDescription = styled.label`
  color: rgb(130, 140, 148);
  font-size: 12px;
  line-height: 20px;
  &:hover {
    cursor: pointer;
  }
`;
const SelectSpace = styled.select`
  width: 400px;
  height: 40px;
  border: 1px solid lightgray;
  cursor: default;
  &:hover {
    background-color: #f6f8fa;
  }
`;
const FeedTextArea = styled.textarea`
  width: 400px;
  height: 145px;
  margin-top: 5px;
  padding-top: 15px;
  padding-left: 20px;
  border: 1px solid lightgray;
  overflow: hidden;
  overflow-wrap: break-word;
  cursor: text;
  &:hover {
    background-color: #f6f8fa;
  }
`;
const PostButton = styled.button`
  text-align: right;
  margin-top: 10px;
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
`;
