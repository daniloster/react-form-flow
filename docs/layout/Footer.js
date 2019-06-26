import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Markdown from 'rsg-components/Markdown';

const FONT_FAMILY =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif';

const Link = styled.a.attrs({ className: 'rsg--link-10' })`
  &.rsg--link-10 {
    font-family: ${FONT_FAMILY};
  }
`;
const Navigation = styled.nav`
  display: grid;
  grid-template-columns:
    minmax(1px, min-content) minmax(1px, min-content) minmax(1px, min-content)
    auto;
  grid-gap: 15px;
`;

export default function Footer({ homepageUrl }) {
  return (
    <footer>
      <Navigation>
        <Link href="https://github.com/styleguidist/react-styleguidist/tree/master/docs">Docs</Link>
        <Link href="https://github.com/styleguidist/react-styleguidist">GitHub</Link>
        <Link href="https://gitter.im/styleguidist/styleguidist">Gitter</Link>
      </Navigation>
      <Markdown text={`Generated with [React Styleguidist](${homepageUrl}) ❤️`} />
    </footer>
  );
}

Footer.propTypes = {
  homepageUrl: PropTypes.string.isRequired,
};
