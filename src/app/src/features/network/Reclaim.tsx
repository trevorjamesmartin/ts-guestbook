import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../memory/hooks';
import { useParams } from 'react-router-dom';
import { Container, Spinner } from 'reactstrap';
import { reclaimAsync, selectors as authSelectors } from '../auth/authSlice';
const { selectStatus } = authSelectors;

function Reclaim(props: any) {
  const { returnTo } = useParams();
  const { username } = props.username;
  const [waiting, setWaiting] = useState(0);
  const status = useAppSelector(selectStatus);
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
    <Container className="centered-spinner-container">
      <Spinner />
      {status}
    </Container>
  )
}

export default Reclaim;