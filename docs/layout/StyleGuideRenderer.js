import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import Content from './Content';
import Footer from './Footer';

const WrapperLayout = styled.div`
  box-sizing: border-box;
  padding: 20px;
  display: block;
  height: 100vh;
  width: 100vw;
  overflow-y: auto;
`;

const { useState } = React;

export default function StyleGuideRenderer(props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const onToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const { homepageUrl, children, toc } = props;

  return (
    <WrapperLayout>
      <Sidebar isOpen={isSidebarOpen} onClick={onToggleSidebar} width="300px">
        {toc}
      </Sidebar>
      <Content>
        {children}
        <Footer homepageUrl={homepageUrl} />
      </Content>
    </WrapperLayout>
  );
}

StyleGuideRenderer.propTypes = {
  title: PropTypes.string.isRequired,
  homepageUrl: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  toc: PropTypes.node,
};

StyleGuideRenderer.defaultProps = {
  toc: null,
};
