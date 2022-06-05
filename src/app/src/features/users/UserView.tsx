import React, { useEffect, useState } from 'react';
import UserCarousel from './UserCarousel';
import UserList from './UserList';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';

const CAROUSEL_VIEW = 'carousel';
const PAGE_VIEW = 'page';

export default function UserView(params: any) {
  const localSocket = params.socket;
  const [view, setView] = useState('default');
  useEffect(() =>{
    console.log(view);
  }, [view]);
  const renderView = () => {
    switch (view) {
      case CAROUSEL_VIEW:
        return <UserCarousel socket={localSocket} />

      case PAGE_VIEW:
      default:
        return <UserList socket={localSocket} />
    }
  }
  const handleOption = (e:any) => {
    e.preventDefault();
    console.log(e.currentTarget.id)
    setView(e.currentTarget.id);
  }

  return <>
    <UncontrolledDropdown
      inNavbar
    >
      <DropdownToggle caret>
        view
      </DropdownToggle>
      <DropdownMenu>
        <>
          <DropdownItem>
            <span id={CAROUSEL_VIEW} onClick={handleOption}>
              {view === CAROUSEL_VIEW ? "*" : ""}Slide
            </span>
          </DropdownItem>
          <DropdownItem>
            <span id={PAGE_VIEW} onClick={handleOption}>
            {view === PAGE_VIEW ? "*" : ""}Page
            </span>
          </DropdownItem>
          <DropdownItem divider />
        </>

      </DropdownMenu>
    </UncontrolledDropdown>
    {renderView()}
  </>
}