import React, {useEffect} from 'react';
import { useAppSelector, useAppDispatch } from '../../memory/hooks';
import { selectors as profileSelectors, getProfileAsync, setProfileAsync, actions as profileActions } from '../profile/profileSlice';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';

const { setField } = profileActions;
const { selectProfile } = profileSelectors;

function Profile() {
    const dispatch = useAppDispatch();
    const profile = useAppSelector(selectProfile);

    useEffect(() => {
        dispatch(getProfileAsync());
    }, []);

    const handleUpdateProfile = (e:any) => {
        e.preventDefault();
        dispatch(setProfileAsync(profile));
    }

    const handleChange = (e:any) => {
        let payload = { [e.currentTarget.name]: e.target.value }
        dispatch(setField(payload));
    }
    
    return (<div className="profile">
        <Form onSubmit={handleUpdateProfile}>
            <FormGroup>
                <Label for="name">Name</Label>
                <Input name='name' type='text' placeholder='name' value={profile.name || ""} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
                <Label for="avatar">Avatar</Label>
                <Input name='avatar' type='text' placeholder='avatar' value={profile.avatar || ""} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
                <Label for="email">Email</Label>
                <Input name='email' type='text' placeholder='email' value={profile.email || ""} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
                <Label for="dob">Date Of Birth</Label>
            </FormGroup>
            <Input name='dob' type='text' placeholder='dob' value={profile.dob || ""} onChange={handleChange} />
            <Button>update</Button>
        </Form>
        <span>{profile.status}</span>
    </div>)
}

export default Profile;
