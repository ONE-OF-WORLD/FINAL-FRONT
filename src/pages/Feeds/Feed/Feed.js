import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import FeedName from './FeedName/FeedName';
import PostedTag from './postedTags/PostedTag';
import Comment from './Commet/Comment';

const Feed = ({ feedInfo, update, feeduserImg, followListUpdate }) => {
  const {
    feedUserName,
    feeduserId,
    content,
    alt,
    src,
    bookmark,
    follow,
    designType,
    postedDate,
    tags,
    comment,
    feedId,
  } = feedInfo;

  const [isClickedTag, setIsClickedTag] = useState(0);
  const [isShown, setIsShown] = useState(false);
  const [isBookmark, setIsBookmark] = useState(false);

  useEffect(() => {
    setIsBookmark(bookmark);
  }, []);

  const stop = e => {
    e.stopPropagation();
  };

  const aboutProduct = ({ target }) => {
    setIsClickedTag(target.id);
  };

  const clickedBookmark = () => {
    if (localStorage.getItem('nickname') !== 'null') {
      axios({
        method: 'post',
        url: `http://192.168.0.205/postings/${feedId}/bookmark`,

        headers: { Authorization: localStorage.getItem('token') },
      })
        .then(res => {
          setIsBookmark(prev => !prev);
        })
        .catch(err => console.log(err));
    } else {
      alert('로그인 해주세요');
    }
  };
  const postedTags =
    tags &&
    tags.map(
      ({
        id,
        xx,
        yy,
        product_title,
        product_price,
        thumbnail_url,
        product_id,
      }) => {
        return (
          <PostedTag
            key={id}
            id={id}
            xx={xx}
            yy={yy}
            product_id={product_id}
            product_title={product_title}
            product_price={product_price}
            thumbnail_url={thumbnail_url}
            stop={stop}
            aboutProduct={aboutProduct}
            isClickedTag={isClickedTag}
          ></PostedTag>
        );
      }
    );

  return (
    <FeedContainer id={0} onClick={aboutProduct}>
      <FeedName
        feeduserId={feeduserId}
        feedUserName={feedUserName}
        alt={alt}
        feeduserImg={feeduserImg}
        postedDate={postedDate}
        designType={designType}
        update={update}
        followListUpdate={followListUpdate}
        follow={follow}
      />
      <FeedImg
        onMouseEnter={() => setIsShown(true)}
        onMouseLeave={() => setIsShown(false)}
        url={src}
      >
        {isShown && postedTags}
      </FeedImg>
      <ContentAndBookmark>
        <Content>{content}</Content>
        <Bookmark
          onClick={clickedBookmark}
          src={
            isBookmark
              ? './images/checked_bookmarks.png'
              : './images/ribbon.png'
          }
        ></Bookmark>
      </ContentAndBookmark>
      <Comment
        feeduserImg={feeduserImg}
        comment={comment}
        feedId={feedId}
        update={update}
      />
    </FeedContainer>
  );
};

const ContentAndBookmark = styled.div`
  display: flex;
  justify-content: space-between;
`;
const Bookmark = styled.img`
  width: 30px;
  height: 30px;
  margin: 30px 20px 10px 15px;
`;
const Content = styled.div`
  margin: 30px 0px 10px 15px;
  font-size: 15px;
  line-height: 28px;
  color: rgb(66, 66, 66);
  overflow-wrap: break-word;
`;
const FeedContainer = styled.article`
  display: flex;
  flex-direction: column;
  width: 630px;
  margin-top: 60px;
  background-color: white;
  border: 1px solid rgba(var(--b6a, 219, 219, 219), 1);
`;

const FeedImg = styled.div`
  position: relative;
  height: 400px;
  width: 625px;
  background-image: ${({ url }) => `url(${url})`};
  background-size: 100%;
  cursor: pointer;
`;

export default Feed;
