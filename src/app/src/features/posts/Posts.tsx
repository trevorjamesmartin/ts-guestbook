import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../memory/hooks";

import { BlogPost, selectors as postsSelectors, getPostsAsync, submitPostAsync, actions as postsActions } from './postsSlice';

import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
const { selectPosts, selectCurrent } = postsSelectors;
const { setCurrent } = postsActions;

const Post = (props: BlogPost) => {
    return (<li key={props.id}>
        <div className="blog-post">
            <span className="title">{props.title}</span>
            <p className="content">{props.content}</p>
            <span className="tags">{props.tags}</span>
        </div>
    </li>)
}

function Posts() {
    const dispatch = useAppDispatch();
    const currentList = useAppSelector(selectPosts);
    const currentPost = useAppSelector(selectCurrent);
    useEffect(() => {
        dispatch(getPostsAsync());
    }, [])
    const handleSubmitForm = (e: any) => {
        e.preventDefault();
        console.log(currentPost);
        dispatch(submitPostAsync());
    }
    const handleChange = (e: any) => {
        let name: string = e.currentTarget.name;
        let value: any = e.target.value;
        dispatch(setCurrent({ [name]: value }));
    }
    return (<div className="Posts">
        <Form onSubmit={handleSubmitForm} className="blog-post">
            <Input value={currentPost.title} onChange={handleChange} name="title" type="text" placeholder="title: subject" />
            <Input value={currentPost.tags} onChange={handleChange} name="tags" type="text" placeholder="tags: general,random,blog" />
            <Input placeholder="What's happening?" type="textarea" value={currentPost?.content} onChange={handleChange} name="content" />
            <Button>post</Button>
        </Form>
        <ul>
            {currentList?.map(Post)}
        </ul>
    </div>)
}
export default Posts;
