import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { SidebarData } from './SideBarData';
import { SidebarDataDirektur } from './SideBarDataDirektur';
import SubMenu from './SubMenu';
import { IconContext } from 'react-icons/lib';
import { useAuthState, useAuthDispatch } from '../context/auth';

const Nav = styled.div`
  background: #303C54;
  height: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: absolute;
  left: 0;
  width: 100%;
  top: 0;
`;

const NavIcon = styled(Link)`
  margin-left: 2rem;
  font-size: 2rem;
  height: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  &:hover {
    text-decoration: none;
  }
`;

const SidebarNav = styled.nav`
  background: #3C4B64;
  width: 250px;
  height: 100vh;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  left: ${({ sidebar }) => (sidebar ? '0' : '-100%')};
  transition: 350ms;
  z-index: 10;
  overflow-y: scroll;
`;

const SidebarWrap = styled.div`
  width: 100%;
`;

const SideMenuBtn = styled.nav`
  position: absolute;
  left: ${({ sidebar }) => (sidebar ? '+15%' : '2%')};
  transition: 350ms;
  z-index: 10;
`;

const Sidebar = () => {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);
  const { user } = useAuthState()
  const divisi = localStorage.getItem('divisi');
  return (
    <>
      
        {
          user ? 
            <IconContext.Provider value={{ color: '#fff' }}>
              <Nav>
                <NavIcon to='#'>
                  <SideMenuBtn sidebar={sidebar}>
                    <FaIcons.FaBars onClick={showSidebar}/>
                  </SideMenuBtn>
                </NavIcon>
              </Nav>
              <SidebarNav sidebar={sidebar}>
                <SidebarWrap>
                  <NavIcon to='#'>
                    <img src="/logo.png" width="25%"/>
                    <label style={{color: 'white', fontWeight:'bold', textDecoration: 'none'}}>HJMB</label>
                  </NavIcon>
                  {
                    divisi === "Direktur Perusahaan"? 
                    SidebarDataDirektur.map((item, index) => {
                      return <SubMenu item={item} key={index} />;
                    })
                    :
                    SidebarData.map((item, index) => {
                      return <SubMenu item={item} key={index} />;
                    })
                  }
                </SidebarWrap>
              </SidebarNav>
            </IconContext.Provider>:null
        }
        
    </>
  );
};

export default Sidebar;