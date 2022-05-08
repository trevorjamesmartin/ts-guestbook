import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../memory/hooks";
import { selectors as socialSelectors, acceptFriendRequestAsync, rejectFriendRequestAsync } from '../social/friendSlice';
import { Button, Card, CardBody, CardHeader, CardImg } from 'reactstrap';
const { selectRequestsRecieved } = socialSelectors;

const SocialRequest = (props: Partial<any>) => {
  const dispatch = useAppDispatch();
  const { connect_id, username, name, avatar, email, dob } = props;
  const handleAcceptConnect = (e:any) => {
    e.preventDefault();
    dispatch(acceptFriendRequestAsync(connect_id));
  }
  return (
    <Card key={username} className="card card-product-grid card-sm">
      <CardImg src={avatar || "/user.png"} className="social-request-avatar" />
      <CardHeader>({username || "You"}) wants to connect</CardHeader>
      <CardBody>
        <p>incoming friend request from {username}</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis aliquid beatae voluptatum. Ut quidem perferendis provident accusantium veritatis eos praesentium esse vero, consequatur error sit pariatur ea tempora culpa. Sunt?</p>
        <span className="email">{email}</span>
        <p className="name">{name}</p>
      </CardBody>
      <div className="bottom-wrap"> 
        <Button color="primary" onClick={handleAcceptConnect}>Accept</Button>
        <div className="price-wrap"> <Button color="danger">Reject</Button> </div>
      </div>
    </Card>
    
  )
}

function ConnectRequests() {
  const friendRequests = useAppSelector(selectRequestsRecieved);
  return (<div className="Posts">
    <ul>
      {friendRequests.map((fr: Partial<any>) => SocialRequest(fr))}
    </ul>
  </div>)
}
export default ConnectRequests;
