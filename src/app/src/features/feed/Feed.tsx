import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../memory/hooks";

import { postsStore, BlogPost, selectors as postsSelectors, getPostsAsync, submitPostAsync, actions as postsActions } from '../posts/postsSlice';
import { getFeedAsync, selectors as feedSelectors, actions as feedActions, Food } from './feedSlice';
import { selectors as authSelectors } from '../auth/authSlice'

import { usersAsync, selectors as userSelectors } from '../users/userSlice';


import {
  Form, FormGroup, Label, Input, Button,
  Card, CardBody, CardHeader, CardImg
} from 'reactstrap';
const { selectFeed } = feedSelectors;
const { selectList } = userSelectors;
const { selectToken } = authSelectors;

const { clear } = feedActions;
const { selectCurrent } = postsSelectors;
const { setCurrent } = postsActions;

const LiteralFood = (props: Partial<Food>) => {
  return (
    <Card key={props.id} className="blog-post">
      <CardHeader>{props.name} ({props.username || "You wrote"})</CardHeader>
      <CardBody>
        <span className="title">{props.title}</span>
        <p className="content">{props.content}</p>
        <span className="tags">{props.tags}</span>
      </CardBody>
    </Card>
  )
}

function Feed() {
  const { food: socialFood, status } = useAppSelector(selectFeed);
  const token = useAppSelector(selectToken);
  const authorized = token && token.length > 4;

  const [socialFeed, setSocialFeed] = useState([...socialFood])
  const dispatch = useAppDispatch();
  const currentPost: BlogPost = useAppSelector(selectCurrent);
  useEffect(() => {
    dispatch(getFeedAsync());

  }, []);
  const handleSubmitForm = (e: any) => {
    e.preventDefault();
    console.log(currentPost);
    dispatch(submitPostAsync());
    setTimeout(() => {
      dispatch(getFeedAsync());
    }, 500);
  }
  const handleChange = (e: any) => {
    let name: string = e.currentTarget.name;
    let value: any = e.target.value;
    dispatch(setCurrent({ [name]: value }));
  }
  return (<div className="Posts">
    {authorized ?
      <>
        <Form onSubmit={handleSubmitForm} className="blog-post">
          {/* <Input value={currentPost.title} onChange={handleChange} name="title" type="text" placeholder="title: subject" /> */}
          {/* <Input value={currentPost.tags} onChange={handleChange} name="tags" type="text" placeholder="tags: general,random,blog" /> */}
          <Input placeholder="What's happening?" type="textarea" value={currentPost?.content} onChange={handleChange} name="content" />
          <Button>post</Button>
        </Form>
        <ul>
          {socialFood.map((f: Partial<Food>) => LiteralFood(f))}
        </ul>
      </> :
      <>
      <h2>good times</h2>
      <p>login to continue</p>
      <p>first time here? Register for a new account.</p>
      </>
    }
  </div>)
}
export default Feed;
