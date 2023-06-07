import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
// import { flexBox } from '../../styles/Mixin';

const Follow = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const headers = { Authorization: localStorage.getItem('token') };
    axios
      .get('http://192.168.0.205:8000/users/follow', {
        headers,
      })
      .then(res => {
        setUsers(res.data.response);
      });
  }, []);
  return (
    <ul>
      {users &&
        users.map(user => (
          <List key={user.id}>
            <ProfileBox>
              <div>
                <ProfileImg
                  src="https://ojsfile.ohmynews.com/STD_IMG_FILE/2010/0809/IE001224096_STD.jpg"
                  alt="profileimg"
                />
                <UserName>{user.nickname}</UserName>
              </div>
              <FolloserNumber>
                팔로워 {Math.floor(Math.random() * 10)}명
              </FolloserNumber>
            </ProfileBox>
          </List>
        ))}
    </ul>
  );
};

const List = styled.li`
  width: 100%;
  border-bottom: 1px solid ${props => props.theme.gray};
`;
const ProfileBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 800px;
  padding: 30px 0;
  margin: 0 auto;

  div {
    display: flex;
    align-items: center;
  }
`;

const ProfileImg = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 20px;
`;
const UserName = styled.span`
  font-size: 22px;
  font-weight: 800;
`;
const FolloserNumber = styled.span`
  font-size: 17px;
`;
export default Follow;
