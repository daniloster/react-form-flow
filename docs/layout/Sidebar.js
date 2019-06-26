import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import SidebarHandler from './SidebarHandler';

const SidebarContentLayout = styled.div``;
const SidebarLayout = styled.div`
  position: relative;
  height: 0;
  width: 0;

  & ${SidebarContentLayout} {
    position: fixed;
    width: ${({ width }) => width};
    top: 0;
    bottom: 0;
    left: ${({ isOpen, width }) => (isOpen ? '0' : `-${width}`)};
    transition: left 1s ease-in 0s;
    background-color: #eaeaea;
  }
`;

export default function Sidebar({ children, isOpen, onClick, width }) {
  return (
    <SidebarLayout isOpen={isOpen} width={width}>
      <SidebarContentLayout>
        <SidebarHandler isOpen={isOpen} onClick={onClick}>
          ➭
        </SidebarHandler>
        {children}
      </SidebarContentLayout>
    </SidebarLayout>
  );
}

Sidebar.propTypes = {
  children: PropTypes.node.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  width: PropTypes.string.isRequired,
};
