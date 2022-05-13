import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../memory/hooks';
import { selectors as profileSelectors, getProfileAsync, setProfileAsync, actions as profileActions } from '../profile/profileSlice';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';

const { setField } = profileActions;
const { selectProfile } = profileSelectors;

function Profile() {
    const dispatch = useAppDispatch();
    const profile = useAppSelector(selectProfile);
    const [preview, setPreview] = useState();

    useEffect(() => {
        dispatch(getProfileAsync());
    }, []);

    const handleUpdateProfile = (e: any) => {
        e.preventDefault();
        dispatch(setProfileAsync(profile));
    }

    const handleChange = (e: any) => {
        let payload = { [e.currentTarget.name]: e.target.value }
        dispatch(setField(payload));
    }
    const MAX_IMAGE_WIDTH = 210;
    function onFileLoaded(event: any) {
        var match = /^data:(.*);base64,(.*)$/.exec(event.target.result);
        if (match == null) {
            throw 'Could not parse result'; // should not happen
        }
        const imgElement = document.createElement("img");
        imgElement.src = event.target.result;
        imgElement.onload = function (e:any) {
        // create canvas element to resize the image
        const canvas = document.createElement("canvas");
        // keep aspect ration when scaling
        const scaler = MAX_IMAGE_WIDTH / e.target.width;
        canvas.width = MAX_IMAGE_WIDTH;
        canvas.height = e.target.height * scaler;
        // redraw at scale & capture as jpeg
        const ctx:any = canvas.getContext("2d");
        ctx.drawImage(e.target, 0, 0, canvas.width, canvas.height);
        const srcEncoded = ctx.canvas.toDataURL("image/jpeg");
        // store result in preview space
        setPreview(srcEncoded);
        dispatch(setField({ avatar: srcEncoded }));
        };
    }

    function handleFileSelect(e: any) {
        var files = e.target.files;
        if (files.length < 1) {
            alert('select a file...');
            return;
        }
        var file = files[0];
        var reader = new FileReader();
        reader.onload = onFileLoaded;
        reader.readAsDataURL(file);
    }

    return (<div className="profile">
        <Form onSubmit={handleUpdateProfile}>
            <Label for="preview-image">Avatar</Label>
            <FormGroup>
                <img className='preview-image' src={preview || profile.avatar || '/user.png'} />
                <Input type="file" id="file-input" onChange={handleFileSelect} />
                <output id="list"></output>
            </FormGroup>
            <FormGroup>
                <Label for="name">Name</Label>
                <Input name='name' type='text' placeholder='name' value={profile.name || ""} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
                <Label for="email">Email</Label>
                <Input name='email' type='text' placeholder='email' value={profile.email || ""} onChange={handleChange} />
            </FormGroup>
            {/* <FormGroup> */}
                {/* <Label for="dob">Date Of Birth</Label> */}
            {/* <Input name='dob' type='text' value={profile.dob || ""} onSelect={handleChange} /> */}
            {/* </FormGroup> */}
            <Button>update</Button>
        </Form>
        <span>{profile.status}</span>
    </div>)
}

export default Profile;
