import React, {useEffect} from 'react';
import { useAppSelector, useAppDispatch } from '../../memory/hooks';
import { selectors as profileSelectors, getProfileAsync, setProfileAsync, actions as profileActions } from '../profile/profileSlice';

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
        <form onSubmit={handleUpdateProfile}>
            <input name='name' type='text' placeholder='name' value={profile.name} onChange={handleChange} />
            <input name='avatar' type='text' placeholder='avatar' value={profile.avatar} onChange={handleChange} />
            <input name='email' type='text' placeholder='email' value={profile.email} onChange={handleChange} />
            <input name='dob' type='text' placeholder='dob' value={profile.dob} onChange={handleChange} />
            <button>update</button>
        </form>
    </div>)
}

export default Profile;
