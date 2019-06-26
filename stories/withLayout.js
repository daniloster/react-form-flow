import React from 'react';
import { makeDecorator } from '@storybook/addons';
import styled from 'styled-components';

const Layout = styled.div`
  width: 100%;
  height: 100%;
`;

export default makeDecorator({
  name: 'withLayout',
  wrapper: (getStory, context) => <Layout>{getStory(context)}</Layout>,
});
