import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../memory/hooks';
import { useParams } from 'react-router-dom';
import { Col, Container, Row, Spinner } from 'reactstrap';
import { selectors as authSelectors } from '../auth/authSlice';
import { selectors as profileSelectors } from '../profile/profileSlice';
const { selectStatus } = authSelectors;
const { selectProfile } = profileSelectors;

function Delay(props: any) {
  const { timeout } = props;
  const [waiting, setWaiting] = useState(0);
  const status = useAppSelector(selectStatus);
  const profile = useAppSelector(selectProfile);

  useEffect(() => {
    if (waiting === 0) {
      setWaiting(Date.now());      
      setTimeout(() => {
        setWaiting(0);
      }, Number(timeout));
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

export default Delay;