import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Feeds from './Feeds';
import MainAside from './MainAside/MainAside';
import axios from 'axios';

const Main = () => {
  const [feedData, setFeedData] = useState([]);
  const [pagenation, setPagenation] = useState(1);
  const [HAS_NEXT, setHAS_NEXT] = useState(true);
  const [followinguser, setFollowinguser] = useState([]);
  useEffect(() => {
    getData();
    followListUpdate();
  }, []);

  const followListUpdate = () => {
    const headers = { Authorization: localStorage.getItem('token') };
    axios
      .get('http://192.168.0.205:8000/users/follow', {
        headers,
      })
      .then(res => {
        setFollowinguser(res.data.response);
      });
  };

  const update = () => {
    if (
      localStorage.getItem('token') &&
      localStorage.getItem('nickname') !== 'null'
    ) {
      const headers = {
        Authorization: localStorage.getItem('token'),
      };
      axios
        .get(`http://192.168.0.205:8000/postings/feed/private?page=1`, {
          headers,
        })
        .then(response => {
          setFeedData(response.data.POSTING_FEED);
        })
        .catch(err => console.error(err));
    } else {
      axios
        .get(`http://192.168.0.205:8000/postings/feed/public?page=1`)
        .then(response => {
          setHAS_NEXT(response.data.HAS_NEXT);

          setFeedData(response.data.POSTING_FEED);
        })
        .catch(err => console.error(err));
    }
  };

  const getData = () => {
    console.log('sdf', feedData, pagenation);
    if (feedData.length === 0 || HAS_NEXT) {
      if (
        localStorage.getItem('token') &&
        localStorage.getItem('nickname') !== 'null'
      ) {
        const headers = {
          Authorization: localStorage.getItem('token'),
        };
        axios
          .get(
            `http://192.168.0.205:8000/postings/feed/private?page=${pagenation}`,
            { headers }
          )
          .then(response => {
            feedData.length === 0
              ? setFeedData(response.data.POSTING_FEED)
              : setFeedData(prev => {
                  return [...prev, ...response.data.POSTING_FEED];
                });
            setPagenation(prev => prev + 1);
          })
          .catch(err => console.error(err));
      } else {
        axios
          .get(
            `http://192.168.0.205:8000/postings/feed/public?page=${pagenation}`
          )
          .then(response => {
            setHAS_NEXT(response.data.HAS_NEXT);
            feedData.length === 0
              ? setFeedData(response.data.POSTING_FEED)
              : setFeedData(prev => {
                  return [...prev, ...response.data.POSTING_FEED];
                });
            setPagenation(prev => prev + 1);
          })
          .catch(err => console.error(err));
      }
    }
  };
  return (
    <>
      <MainContainer>
        <Feeds
          followListUpdate={followListUpdate}
          feedData={feedData}
          update={update}
          getData={getData}
          next={HAS_NEXT}
        />
        <MainAside followinguser={followinguser} />
      </MainContainer>
    </>
  );
};
export default Main;

const MainContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 1000px;
`;
