import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { SVG } from '../sgv';
import Modal from '../Modal/Modal';
import WriteFeed from './WritingFeed/WritingFeed';

const Nav = () => {
  const { Kakao } = window;
  let history = useHistory();
  const [login, setLogin] = useState(false); //버튼 제어
  const [loginMenu, setLoginMenu] = useState(false); //모달창 제어
  const [isSignup, setIsSignup] = useState(false); //회원가입 모달창 제어 (독립)
  const [modalWrite, setModalWrite] = useState(false); //글쓰기 모달창 제어 (독립)
  const [userInfo, setUserInfo] = useState({
    userId: 0,
    nickname: '',
    email: '',
  });

  useEffect(() => {
    if (
      localStorage.getItem('token') &&
      localStorage.getItem('nickname') !== 'null'
    ) {
      setLogin(true);
    }
  }, []);

  const handlelogout = () => {
    setLogin(false);
    setLoginMenu(false);
    setIsSignup(false);
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('nickname');
    localStorage.removeItem('email');
    window.location.replace('/');
  };

  const handleSignup = ({ target }) => {
    const { value } = target;
    setUserInfo(props => {
      return { ...props, nickname: value };
    });
    localStorage.setItem('nickname', value);
    setLogin(true);
  };

  const handlelogin = async () => {
    Kakao.Auth.login({
      scope: 'profile_nickname , account_email',
      persistAccessToken: false,
      success: async function (response) {
        const res = await axios.post(
          'http://192.168.0.205:8000/users/signin',
          {
            access_token: response.access_token,
          }
        );
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userId', res.data.user_id);
        localStorage.setItem('nickname', res.data.nickname);
        localStorage.setItem('email', res.data.email);
        console.log(res.data.nickname);
        if (res.data.nickname == null) {
          setIsSignup(true);
          console.log('asd');
        } else {
          setLogin(true);
        }
        setUserInfo({
          userId: res.data.user_id,
          nickname: res.data.nickname,
          email: res.data.email,
        });
      },
      fail: function (error) {
        console.log(error);
        alert('로그인에 실패했습니다.');
      },
    });
  };

  ///////

  const onOffModal = name => {
    if (name === 'mypage') {
      setLoginMenu(!loginMenu);
    } else if (name === 'write') {
      localStorage.getItem('token') &&
      localStorage.getItem('nickname') !== 'null'
        ? setModalWrite(!modalWrite)
        : alert('로그인 후 이용 부탁합니다');
    }
    if (name === 'signup') {
      setIsSignup(false);

      const options = axios.post(
        `http://192.168.0.205:8000/users/${userInfo.userId}/nickname`,
        { nickname: userInfo.nickname }
      );
    }
  };
  return (
    <NavContainer>
      <Navcontent>
        <Logo onClick={() => history.push('/')}>
          <img src="./images/house64.png" alt="homestagramLogo" />
          <span>Homestagram</span>
        </Logo>
        <ButtonBox>
          <Circle>
            <IconStyle src="./images/ribbon.png" alt="ribbonIcon" />
          </Circle>
          <Circle>
            <IconStyle src="./images/ring.png" alt="ringIcon" />
          </Circle>
          {!login ? (
            <IconStyle
              name="kakao"
              onClick={handlelogin}
              src="/images/kakao_login_medium.png"
              alt="카카오"
            />
          ) : (
            <Circle name="smile">
              <IconStyle
                src="./images/smile.png"
                alt="smileIcon"
                onClick={() => onOffModal('mypage')}
              />
              {loginMenu && (
                <Modal id="mypage" name="mypage" onOffModal={onOffModal}>
                  <Button
                    onClick={() => {
                      history.push('/mypage');
                      setLoginMenu(false);
                    }}
                  >
                    마이페이지
                  </Button>
                  <Button onClick={handlelogout}>로그아웃</Button>
                </Modal>
              )}
            </Circle>
          )}
          {isSignup && (
            <Modal id="signup" name="write" onOffModal={onOffModal}>
              <Button name="signupTitle" size="18px">
                Homestagram 환영합니다
              </Button>
              <Button
                as="input"
                size="13px"
                placeholder="별명을 입력하세요"
                onChange={handleSignup}
              />
              <Button size="13px" onClick={() => onOffModal('signup')}>
                회원가입 하기
              </Button>
            </Modal>
          )}
          {SVG.NAV_MYPAGE}

          <WriteButton onClick={() => onOffModal('write')}>글쓰기</WriteButton>
          {SVG.NAV_WRITE}
          {modalWrite && (
            <Modal id="write" name="write" onOffModal={onOffModal}>
              <WriteFeed onOffModal={onOffModal}></WriteFeed>
            </Modal>
          )}
        </ButtonBox>
      </Navcontent>
    </NavContainer>
  );
};

export default Nav;

const IconStyle = styled.img`
  color: palevioletred;
  font-size: 1em;
  margin-left: ${props => (props.name === 'kakao' ? '30px' : '')};
  border: ${props => (props.alt === '로그아웃' ? '2px solid black' : 'none')};
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: center;
  background-color: #fff;
  border-bottom: 0.1px solid #ededed;

  font-family: 'Noto Sans KR', 'Apple SD Gothic Neo', '맑은 고딕',
    'Malgun Gothic', sans-serif;
`;

const Navcontent = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 60px;
  margin: 0 auto;
  max-width: 1800px;
  height: 80px;
`;

const Logo = styled.button`
  display: flex;
  align-items: center;
  border: none;
  background-color: white;
  img {
    width: 50px;
    padding-right: 10px;
  }
  span {
    font-size: 25px;
    font-weight: bold;
  }
`;

const ButtonBox = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 60px;
  padding: 10px 0px 10px 600px;
`;

const Circle = styled.div`
  display: flex;
  position: ${props => (props.name === 'smile' ? 'relative' : '')};
  border-radius: 50%;
  align-items: center;
  margin-left: 30px;
  &:hover {
    border: 3px solid #32c6f0;
  }
`;

const WriteButton = styled.button`
  padding: 10px;
  margin-left: 30px;
  border: none;
  border-radius: 5px;
  font-weight: 800;
  color: white;
  background-color: #32c6f0;
  &:hover {
    background-color: #08addb;
  }
`;

const Button = styled.button`
  display: block;
  width: 100%;
  margin: 0;
  padding: ${({ name }) =>
    name === 'signupTitle' ? '30px 60px' : '10px 14px 11px'};
  box-sizing: border-box;
  border: none;
  color: ${({ name }) => (name === 'signupTitle' ? '#fff' : '#424242')};
  font-size: ${({ size }) => size || '15px'};
  font-weight: ${({ name }) => (name === 'signupTitle' ? '600' : '')};
  line-height: 21px;
  text-align: ${({ name }) => (name === 'signup' ? 'center' : 'left')};
  cursor: pointer;
  border-radius: 2px;
  background: ${({ name }) => (name === 'signupTitle' ? '#32c6f0' : '#fff')};
  &:hover {
    background-color: ${({ name }) =>
      name === 'signupTitle' ? '#32c6f0' : '#ededed'};
  }
`;
