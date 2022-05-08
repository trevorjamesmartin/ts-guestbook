import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../memory/hooks";

// import { BlogPost, selectors as postsSelectors, getPostsAsync, submitPostAsync, actions as postsActions } from './postsSlice';
import { getFeedAsync, selectors as feedSelectors, actions as feedActions, Food } from './feedSlice';

// import { selectors as profileSelectors, getProfileAsync } from '../profile/profileSlice';
import { usersAsync, selectors as userSelectors } from '../users/userSlice';


import {
  Form, FormGroup, Label, Input, Button,
  Card, CardBody, CardHeader, CardImg
} from 'reactstrap';
const { selectFeed } = feedSelectors;
const { selectList } = userSelectors;
const { clear } = feedActions;

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
  const [socialFeed, setSocialFeed] = useState([...socialFood])
  const dispatch = useAppDispatch();
  // const currentPost = useAppSelector(selectCurrent);
  useEffect(() => {
    dispatch(getFeedAsync());
    console.log(status, socialFeed);
  }, []);
  const handleSubmitForm = (e: any) => {
    e.preventDefault();
    // console.log(currentPost);
    // dispatch(submitPostAsync());
  }
  const handleChange = (e: any) => {
    // let name: string = e.currentTarget.name;
    // let value: any = e.target.value;
    // dispatch(setCurrent({ [name]: value }));
  }
  return (<div className="Posts">
    {/* <Form onSubmit={handleSubmitForm} className="blog-post">
            <Input value={currentPost.title} onChange={handleChange} name="title" type="text" placeholder="title: subject" />
            <Input value={currentPost.tags} onChange={handleChange} name="tags" type="text" placeholder="tags: general,random,blog" />
            <Input placeholder="What's happening?" type="textarea" value={currentPost?.content} onChange={handleChange} name="content" />
            <Button>post</Button>
        </Form> */}
    <ul>
      {socialFood.map((f: Partial<Food>) => LiteralFood(f))}
    </ul>
  </div>)
}
export default Feed;
