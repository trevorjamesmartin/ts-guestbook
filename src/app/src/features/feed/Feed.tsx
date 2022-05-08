import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../memory/hooks";

import { postsStore, BlogPost, selectors as postsSelectors, getPostsAsync, submitPostAsync, actions as postsActions } from '../posts/postsSlice';
import { getFeedAsync, selectors as feedSelectors, actions as feedActions, Food } from './feedSlice';
import { selectors as profileSelectors } from '../profile/profileSlice';
import { selectors as authSelectors } from '../auth/authSlice'

import { usersAsync, selectors as userSelectors } from '../users/userSlice';

import {
  Form, FormGroup, Label, Input, Button,
  Card, CardBody, CardHeader, CardImg, CardText, Container, Row
} from 'reactstrap';
const { selectProfile } = profileSelectors;
const { selectFeed } = feedSelectors;
const { selectList } = userSelectors;
const { selectToken } = authSelectors;

const { clear } = feedActions;
const { selectCurrent } = postsSelectors;
const { setCurrent } = postsActions;

const LiteralFood = (props: Partial<Food>) => {
  const profile = useAppSelector(selectProfile);
  const findAvatar = () => {
    if (props.avatar) {
      return props.avatar;
    }
    return profile.avatar || "/user.png";
  }
  return (
    // <Card key={props.id} className="card card-product-grid card-sm">
    <Card key={props.id} className="blog-post card-sm card-product-grid">
      <Container>
        <Row xs="3" >
          <CardImg src={findAvatar()} className="shout-out-avatar" />
          <CardText className="shouter-username">@{props.username || "You"}</CardText>
          <CardText className="shouter-timestamp">{props.posted_at}</CardText>
        </Row>
        <Row xs="1">
          <CardText className="shouter-name">{props.name}</CardText>
        </Row>
        <CardBody>
          {/* <span className="title">{props.title}</span> */}
          <CardText className="content">{props.content}</CardText>
          {/* <span className="tags">{props.tags}</span> */}
        </CardBody>
      </Container>
    </Card>
  )
}

function Feed() {
  const navigate = useNavigate();
  const { food: socialFood, status } = useAppSelector(selectFeed);
  const token = useAppSelector(selectToken);
  const authorized = token && token.length > 4;
  const shoutOut: any = useRef();
  const dispatch = useAppDispatch();
  const currentPost: BlogPost = useAppSelector(selectCurrent);
  useEffect(() => {
    if (authorized) {
      dispatch(getFeedAsync());
    } else {
      navigate('/login')
    }
  }, []);
  const handleSubmitForm = (e: any) => {
    e.preventDefault();
    console.log(currentPost);
    dispatch(submitPostAsync());
    setTimeout(() => {
      dispatch(getFeedAsync());
    }, 500);
    shoutOut.current.focus();
  }
  const handleChange = (e: any) => {
    let name: string = e.currentTarget.name;
    let value: any = e.target.value;
    dispatch(setCurrent({ [name]: value }));
  }
  return (<div className="Posts">
    {authorized ?
      <>
        <Form onSubmit={handleSubmitForm}>
          <FormGroup>
          <Label for="shout-out">What's happening?</Label>
          <Input id="shout-out" ref={shoutOut} className="shout" placeholder="..." type="textarea" value={currentPost?.content} onChange={handleChange} name="content" />
          <Button className="shout-out btn-primary">shout</Button>
          </FormGroup>
        </Form>
        <ul>
          {socialFood.map((f: Partial<Food>) => LiteralFood(f))}
        </ul>
      </> :
      <><Label>ok then</Label></>
    }
  </div>)
}
export default Feed;
