import styled from 'styled-components';

const declarationColor = '#085394';

export const StyleWrapper = styled.div`
  &.sequence {
    padding-bottom: 3px;
    border-bottom: ${declarationColor} 2px solid;
  }

  width: max-content;
  color: black;
  margin-top: 0.3em;

  .breadcrumb-queen button {
    cursor: pointer;
    background-color: transparent;
    border: none;
    text-transform: uppercase;
    font-size: 95%;
    &:hover {
      font-weight: bold;
    }

    &::before {
      content: '\u3009';
      margin-right: 0.8em;
      font-weight: bold;
    }
  }
  button.breadcrumb-element-queen {
    &::before {
      content: '\u3009';
      margin-right: 0.8em;
      font-weight: bold;
    }

    margin-left: 0.8em;
    display: inline;
    padding-bottom: 3px;
    border-bottom: ${declarationColor} 2px solid;
  }
`;
