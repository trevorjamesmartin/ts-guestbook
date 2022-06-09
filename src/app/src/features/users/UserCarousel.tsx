import React, { useCallback, useEffect, useState } from 'react';
import { Spinner, Carousel, CarouselItem, CarouselControl, Card, CardBody, CardImg, CardText, CardTitle } from 'reactstrap';
import { useAppSelector, useAppDispatch } from '../../memory/hooks';
// import { selectors as friendSelectors } from '../social/friendSlice';

import { usersAsync, selectors as userSelectors } from './userSlice';

import { useSearchParams } from 'react-router-dom';
// import { selectors as socketSelectors } from '../network/socketSlice';
// const { selectFriendList, selectRequestsRecieved } = friendSelectors;
// const selectAvailableUsers = socketSelectors.selectUserlist;

const { selectList } = userSelectors;

export default function UserCarousel(params: any) {
  const socket = params.socket;
  const [searchParams,] = useSearchParams();
  const dispatch = useAppDispatch();
  // const friendList = useAppSelector(selectFriendList);
  // const friendRequests = useAppSelector(selectRequestsRecieved);
  // const availableUsers = useAppSelector(selectAvailableUsers);

  const userlist: any = useAppSelector(selectList);
  const [activeIndex, setActiveIndex] = useState(0);
  const [items, setItems] = useState<object[]>([{}]);
  const [state, setState] = useState({
    lastLoaded: 0,
    page: searchParams.get('page')
  });
  const [current,] = useState<any>(undefined);
  const [showSpinner, setShowSpinner] = useState(false);

  const bulkRefresh = useCallback(() => {
    const lastLoaded = Date.now();
    const page = searchParams.get('page');
    setState({ lastLoaded, page });
    dispatch(usersAsync({ socket, page, limit: 200 }));
  }, [dispatch, searchParams, socket]);

  useEffect(() => {
    setShowSpinner(true);
    const delta = (Date.now() - state.lastLoaded);
    if (delta > 15000) {
      bulkRefresh();
    }
    const ulist = userlist?.pages ? userlist.pages.map((u: any, i: number) => {
      return {
        altText: u.name || u.username,
        caption: u.username,
        key: i + 1,
        src: u.avatar
      }
    }) : [];
    setItems(ulist);
    setShowSpinner(false);
  }, [userlist.pages, searchParams, bulkRefresh, state.lastLoaded]);

  const handleNext = () => {
    let nextPage = (activeIndex + 1) % userlist.pages.length;
    setActiveIndex(nextPage)
  }
  const handlePrev = () => {
    let nextPage;
    if (activeIndex === 0) {
      nextPage = userlist.pages.length - 1;
    } else {
      nextPage = activeIndex - 1;
    }
    setActiveIndex(nextPage)
  }
  const renderCard = (u?: any, i?: number | undefined) => {
    if (activeIndex === -2 || showSpinner) {
      return <Card>
        <CardBody>
          <div className='spinner-carousel'>
            <Spinner />
          </div>
          <CardText style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <p>loading...</p>
          </CardText>
        </CardBody>
      </Card>
    }
    if (!u || i === undefined) {
      u = current;
    } else {
      u = userlist.pages[i];
    }
    return <Card>
      <CardTitle
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0.5rem'
        }}
      >{u.username}</CardTitle>
      <CardBody>
        <CardImg
          className='carousel-image'
          alt={u.username}
          src={u.avatar}
        />
        <CardText style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <p>{u.name}</p>
          {/* {availableUsers.includes(userlist.pages[i]?.username) ? "true" : "false"} */}
        </CardText>
      </CardBody>
    </Card>
  }
  return <Carousel
    className="carousel carousel-dark carousel-fade carousel-custom"
    activeIndex={activeIndex}
    next={handleNext}
    previous={handlePrev}
  >
    {items?.map((u: any, i: number) => {
      // const requestedConnect = friendRequests.find((req: any) => req.username === u.username);
      // const isOnline = availableUsers.includes(u.username);
      // const isFriend = friendList.find((friend: any) => friend.username === u.username);
      return <CarouselItem
        key={i}
        onExited={function noRefCheck() { }}
        onExiting={function noRefCheck() { }}
      >
        {renderCard(u, i)}
      </CarouselItem>
    }) || <h2>loading...</h2>}
    <CarouselControl
      disabled={!userlist?.previous?.page}
      direction="prev"
      directionText="Previous"
      onClickHandler={handlePrev}
    />
    <CarouselControl
      disabled={!userlist?.next?.page}
      direction="next"
      directionText="Next"
      onClickHandler={handleNext}
    />
  </Carousel>
}