import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../memory/hooks';
import { useParams } from 'react-router-dom';
import { Col, Container, Row, Spinner } from 'reactstrap';
import { reclaimAsync, selectors as authSelectors } from '../auth/authSlice';
import { selectors as profileSelectors } from '../profile/profileSlice';
const { selectStatus } = authSelectors;
const { selectProfile } = profileSelectors;

function Reclaim(props: any) {
  const { returnTo } = useParams();
  const { username } = props.username;
  const [waiting, setWaiting] = useState(0);
  const status = useAppSelector(selectStatus);
  const profile = useAppSelector(selectProfile);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (waiting === 0) {
      setWaiting(Date.now());
      dispatch(reclaimAsync({ username }))
      console.log('calling reclaim', returnTo);
      setTimeout(() => {
        setWaiting(0);
        window.location.replace(returnTo || "/");
      }, 3000);
    }
  })

  return (
    <Container className='flex column align-items-center text-center'>
      <Row xs="1">
        <Col>
          <img className="profile-image-limited"
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src = "/user.png";
            }}
            src={profile.avatar} />
        </Col>
      </Row>
      <Row xs="1">
        <Col>
          <p>{status}</p>
        </ Col>
      </Row>
      <Row xs="1">
        <Col>
          <Spinner />
        </ Col>
      </Row>

      <div>

      </div>
      <div className=''></div>


    </Container>
  )
}

export default Reclaim;