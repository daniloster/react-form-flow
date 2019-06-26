import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const ContentLayout = styled.div``;

export default function Content({ children }) {
  return <ContentLayout>{children}</ContentLayout>;
}

Content.propTypes = {
  children: PropTypes.node.isRequired,
};
