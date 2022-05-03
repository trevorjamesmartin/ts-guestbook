import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../memory/hooks";

import { BlogPost, selectors as postsSelectors, getPostsAsync, submitPostAsync, actions as postsActions } from './postsSlice';

const { selectPosts, selectCurrent } = postsSelectors;
const { setCurrent } = postsActions;

const Post = (props: BlogPost) => {
    return (<li key={props.id}>
        <div className="blog-post">
            <span className="title">{props.title}</span>
            <p className="content">{props.content}</p>
            <span className="tags">tags: {props.tags}</span>
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
        <form onSubmit={handleSubmitForm} className="blog-post">
            <input value={currentPost.title} onChange={handleChange} name="title" type="text" placeholder="title: subject" />
            <input value={currentPost.tags} onChange={handleChange} name="tags" type="text" placeholder="tags: general,random,blog" />
            <textarea value={currentPost.content} onChange={handleChange} name="content" placeholder="content: hello world!" />
            <button>post</button>
        </form>
        <ul>
            {currentList?.map(Post)}
        </ul>
    </div>)
}
export default Posts;
