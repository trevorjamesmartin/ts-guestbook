import React, { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Label, Form, FormGroup, Input, Container, Button } from 'reactstrap';
import Modal from 'react-modal';
import { useAppSelector, useAppDispatch } from '../../memory/hooks';
import { selectors as authSelectors, actions as authActions } from '../auth/authSlice';
import { actions as webSocketActions } from '../network/socketSlice';
import { actions as profileActions, selectors as profileSelectors } from '../profile/profileSlice'
import { actions as feedActions } from '../feed/feedSlice';
import { actions as userActions } from '../users/userSlice';
import api from '../network/api';
const { selectProfile } = profileSelectors;
const { selectToken } = authSelectors;
const { clear: clearProfile } = profileActions;
const { clear: clearFeed } = feedActions;
const { clear: clearUsers } = userActions;
const { clear: clearWebSocket } = webSocketActions;

const { logout } = authActions;
Modal.setAppElement('#root')

const customStyles = {
  content: {
    top: '25%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

function ConfirmDelete(params: any) {
  const [state, setState] = useState({ username: '', password: '' });
  const { isOpen, deleteMyAccount, cancelModalWindow } = params;
  const handleOnChange = (e: any) => {
    e.preventDefault();
    const changed = { ...state, [e.currentTarget.name]: e.target.value };
    setState(changed);
    console.log(changed);
  }
  useEffect(() => {
    setState({ username: '', password: '' });
  }, []);
  return <Modal
    isOpen={isOpen}
    style={customStyles}
  >
    <Container>
      <Badge color="danger">
        Danger
      </Badge>
      <h3>Delete Account</h3>
      <p>Are you sure you want to delete your account ?</p>
      <Form onSubmit={(e: any) => {
        e.preventDefault();
        deleteMyAccount(state)
      }
      }>
        <FormGroup>
          <Label>Login</Label>
          <Input name='username' autoComplete='username' value={state.username} onChange={handleOnChange} />
        </FormGroup>
        <FormGroup>
          <Label>Password</Label>
          <Input name='password' autoComplete='password' value={state.password} onChange={handleOnChange} type="password" />
        </FormGroup>
        <Button onClick={cancelModalWindow}>Cancel</Button>
        <Button type="submit" color="danger">Delete Account</Button>
      </Form>
    </Container>

  </Modal>

}


function SettingsPage(params: any) {
  const pwform:React.MutableRefObject<any> = useRef(null);
  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectProfile);
  const token = useAppSelector(selectToken);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [pw, setPW] = useState({
    current_password: undefined,
    new_password: undefined,
    new_password_again: undefined,
  });

  const handleChangePassword = async (e: any) => {
    e.preventDefault();
    let result;
    if (pw.new_password && pw.new_password === pw.new_password_again) {
      result = await new api({ token }).post('/api/settings/password', {
        old_password: pw.current_password,
        new_password: pw.new_password
      })
    } else {
      alert("Error");
    }
    if (result?.status === 200) {
      alert('ok - changed password');
      window.location.reload();
    }
  }

  const openModal = (e: any) => {
    e.preventDefault();
    setOpen(true);
  }

  const cancelModalWindow = (e: any) => {
    e.preventDefault();
    setOpen(false);
  }

  const goodbye = useCallback(async () => {
    dispatch(clearProfile());
    dispatch(clearFeed());
    dispatch(logout());
    dispatch(clearUsers());
    dispatch(clearWebSocket());
    setTimeout(() => {
      navigate('/');
      window.location.reload();
    }, 1500); // reload to trigger a websocket connection
  }, [dispatch, navigate]);

  const deleteMyAccount = async (state: any) => {
    if (state.password.length > 0 && state.username.length > 0) {
      // console.log('delete this account... then logout');
      console.log(state);
      await new api({ token })
        .delete('/api/users', { data: { ...state } })
        .then(() => goodbye());
    }
  }

  const handleOnChange = (e: any) => {
    e.preventDefault();
    const changed = { ...pw, [e.currentTarget.name]: e.target.value };
    setPW(changed);
    console.log(changed);
  }

  return <Container>
    <Button onClick={() => navigate(-1)}><i className="fa-solid fa-chevron-left"></i> Back</Button>

    <div className='settings-frame'>
      <h4>Account Settings</h4>
      <br />
      <h5>Change Password</h5>
      <Form ref={pwform} onSubmit={handleChangePassword}>
        {/* https://www.chromium.org/developers/design-documents/create-amazing-password-forms/ */}
        <FormGroup hidden>
          <Label for='username'>Username</Label>
          <Input readOnly autoComplete='username' name="username" value={profile.username} />
        </FormGroup>

        <FormGroup>
          <Label for='current-password'>Current Password</Label>
          <Input autoComplete='current-password' onChange={handleOnChange} name="current_password" type='password' />
        </FormGroup>

        <FormGroup>
          <Label for='new_password'>New Password</Label>
          <Input autoComplete='new-password' onChange={handleOnChange} name="new_password" type='password' />
        </FormGroup>

        <FormGroup>
          <Label for='new_password_again'>New Password (confirm)</Label>
          <Input autoComplete='new-password' onChange={handleOnChange} name="new_password_again" type='password' />
        </FormGroup>

        <Button>Change Password</Button>

      </Form>
    </div>
    <hr />
    <br />
    <div>
      <Badge color="danger">
        Danger
      </Badge>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repellat, nulla voluptate? Possimus corporis magnam minus labore aspernatur alias soluta impedit excepturi corrupti est aperiam quidem perspiciatis facilis, animi numquam. Incidunt!
      </p>
      <Button onClick={openModal} name="delete_account" color='danger'>Delete Account</Button>
      <ConfirmDelete isOpen={open} deleteMyAccount={deleteMyAccount} cancelModalWindow={cancelModalWindow} />
    </div>
  </Container>
}

export default SettingsPage
