import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const SidebarHandlerLayout = styled.div`
  position: relative;
  display: block;
  width: 100%;
`;

const HandleLayout = styled.div`
  transform-origin: 50% 50%;
  position: absolute;
  top: 50vh;
  right: -16px;
  width: 32px;
  height: 32px;
  cursor: pointer;

  display: flex;
  transition: transform 0.3s ease-in 1s;
  transform: scale(${({ isOpen }) => (isOpen ? '-1' : '1')}, 1);
  background-color: aquamarine;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
`;

export default function SidebarHandler({ children, isOpen, onClick }) {
  return (
    <SidebarHandlerLayout>
      <HandleLayout isOpen={isOpen} onClick={onClick}>
        {children}
      </HandleLayout>
    </SidebarHandlerLayout>
  );
}

SidebarHandler.propTypes = {
  children: PropTypes.node.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};
