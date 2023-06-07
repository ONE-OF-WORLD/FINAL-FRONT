import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const Comment = ({ feeduserImg, comment, feedId, update }) => {
  const [newComment, setNewComment] = useState('');
  const [ismodify, setIsmodify] = useState(0);

  const handleComment = e => {
    e.preventDefault();
    const { value, name, id } = e.target;
    if (id) {
      setNewComment(name);
      setIsmodify(Number(id));
    } else {
      setNewComment(value);
    }
  };

  const handleCommentSubmit = e => {
    if (
      localStorage.getItem('token') &&
      localStorage.getItem('nickname') !== 'null'
    ) {
      const headers = {
        Authorization: localStorage.getItem('token'),
      };
      const { id, name } = e.target;
      e.preventDefault();
      const submitNewcomment = {
        content: newComment,
      };
      setNewComment('');
      if (name === 'delete') {
        axios
          .delete(`http://192.168.0.205:8000/comment/${id}`, { headers })
          .then(response => {
            update();
          })
          .catch(err => console.error(err));
      } else if (Number(ismodify) !== 0) {
        axios
          .patch(
            `http://192.168.0.205:8000/comment/${ismodify}`,
            submitNewcomment,
            { headers }
          )
          .then(response => {
            update();
          })
          .catch(err => console.error(err));
        setIsmodify(0);
      } else {
        axios
          .post(
            `http://192.168.0.205/postings/${feedId}/comment`,
            submitNewcomment,
            { headers }
          )
          .then(response => {
            update();
          })
          .catch(err => console.error(err));
      }
    } else {
      alert('로그인이 필요합니다 !');
    }
  };
  return (
    <section>
      <CommetCount>
        댓글 <span>{comment ? comment.length : 0}</span>
      </CommetCount>
      <CommentBox>
        <UserImg src={feeduserImg} alt={feeduserImg} />
        <CommentFrom onSubmit={handleCommentSubmit}>
          <CommetInput
            placeholder="칭찬과 격려의 댓글은 작성자에게 큰 힘이 됩니다 :)"
            onChange={handleComment}
            value={newComment}
          ></CommetInput>
          <CommetButton type="submit" disabled={newComment ? false : true}>
            등록
          </CommetButton>
        </CommentFrom>
      </CommentBox>
      {comment &&
        comment.map(({ id, user_name, user_img, content, date }) => {
          return (
            <CommentBox key={id}>
              <UserImg src={feeduserImg} />
              <div>
                <CommentMessage>
                  <CommetCount commetUserName={true}>{user_name}</CommetCount>
                  <span>{content}</span>
                </CommentMessage>
                <CommetFooter>
                  <FooterButton as="time">{date}</FooterButton>
                  <FooterButton>답글 달기</FooterButton>
                  <FooterButton>신고</FooterButton>
                  <FooterButton name={content} onClick={handleComment} id={id}>
                    수정
                  </FooterButton>
                  <FooterButton
                    name="delete"
                    onClick={handleCommentSubmit}
                    id={id}
                  >
                    삭제
                  </FooterButton>
                </CommetFooter>
              </div>
            </CommentBox>
          );
        })}
    </section>
  );
};

export default Comment;

const FooterButton = styled.button`
  margin: 0px 10px;
  background: none;
  border: none;
  color: inherit;
  padding: 0;
  font-size: 13px;
  cursor: pointer;
`;

const CommentBox = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 10px;
`;

const CommentFrom = styled.form`
  display: flex;
  flex: 1 1 0px;
  position: relative;
  max-width: 100%;
  border: 1px solid #dbdbdb;
  border-radius: 4px;
`;
const CommetInput = styled.input`
  width: 100%;
  min-height: 38px;
  border: none;
  color: #424242;
  margin: 0;
  padding: 8px 15px 9px;
  font-size: 15px;
  word-wrap: break-word;
  box-sizing: border-box;
`;

const UserImg = styled.img`
  display: inline-block;
  width: 30px;
  height: 30px;
  border-radius: 100%;
  margin: 0px 10px 0px 5px;
  border: 1px solid gray;
`;

const CommetButton = styled.button`
  margin: 0 7.5px;
  padding: 7px;
  min-width: 9%;
  color: #a3e4f8;
  font-size: 15px;
  font-weight: 700;
  border: none;
  background: none;
  cursor: ${({ disabled }) => (disabled ? '' : 'pointer')};
`;

const CommetCount = styled.h1`
  font-weight: 700;
  color: #000;
  margin: ${({ commetUserName }) =>
    commetUserName ? '10px 10px 10px' : '20px 0px 0px 15px'};
`;

const CommentMessage = styled.p`
  display: flex;
  align-items: center;
`;

const CommetFooter = styled.footer`
  color: #757575;
  font-size: 13px;
  font-weight: 700;
`;
