import React from 'react';
import styled from 'styled-components';
import axios from 'axios';

const FeedName = ({
  feeduserId,
  alt,
  postedDate,
  follow,
  update,
  feedUserName,
  feeduserImg,
  followListUpdate,
}) => {
  const handleFollow = () => {
    if (
      localStorage.getItem('token') &&
      localStorage.getItem('nickname') !== 'null'
    ) {
      const headers = {
        Authorization: localStorage.getItem('token'),
      };

      axios
        .post(
          'http://192.168.0.205:8000/users/follow',
          { user_id: feeduserId },
          { headers }
        )
        .then(response => {
          console.log(response);
          update();
          followListUpdate();
        })
        .catch(err => console.error(err));
    } else {
      alert('로그인이 필요합니다 : )');
    }
  };
  return (
    <FeedNameContainer>
      <FeedUser>
        <UserImg alt={alt} src={feeduserImg} />
        <FeedUserInfo>
          <p>{feedUserName}</p>
          <Date>{postedDate}</Date>
        </FeedUserInfo>
      </FeedUser>
      {localStorage.getItem('nickname') !== feedUserName && (
        <Button onClick={handleFollow} follow={follow}>
          {follow ? '팔로잉' : '팔로우'}
        </Button>
      )}
    </FeedNameContainer>
  );
};
const Button = styled.button`
  padding: 7px 18px;
  margin-right: 18px;
  border: ${({ follow }) => (follow ? '1px solid lightgray' : 'none')};
  border-radius: 5px;
  font-weight: 800;
  color: ${({ follow }) => (follow ? 'lightgray' : 'white')};
  background-color: ${({ follow }) => (follow ? 'white' : '#32c6f0')};
  &:hover {
    background-color: ${({ follow }) => (follow ? '#32c6f0' : '#08addb')};
    color: ${({ follow }) => (follow ? 'white' : '')};
    opacity: ${({ follow }) => (follow ? '0.5' : '')};
    border: ${({ follow }) => (follow ? '1px solid #32c6f0' : 'none')};
  }
`;

const FeedNameContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const FeedUser = styled.div`
  display: flex;
  padding: 4px;
  margin: 10px;
  align-items: center;
  white-space: nowrap;
  font-weight: 700;
`;

const FeedUserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;
const Date = styled.p`
  margin-top: 4px;
  color: rgb(117, 117, 117);
  font-size: 11px;
  line-height: 15px;
`;
const UserImg = styled.img`
  display: inline-block;
  width: 40px;
  height: 40px;
  border-radius: 100%;
  margin-right: 10px;
  border: 1px solid gray;
`;

export default FeedName;
