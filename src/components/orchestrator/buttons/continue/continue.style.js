import styled from 'styled-components';

const backgroundButtonColor = '#085394';

export const StyleWrapper = styled.div`
  width: auto;

  .continue-button {
    text-align: right;
    button {
      background-color: ${backgroundButtonColor};
      border: none;
      border-radius: 5px;
      color: white;
      font-weight: bold;
      padding: 0.5em 1em 0.5em 1em;
      text-transform: uppercase;

      &:hover,
      &:focus {
        border: none;
        background-color: white;
        color: ${backgroundButtonColor};
      }

      &:disabled {
        background-color: #414c5c;
        color: white;
      }
    }
    span {
      &.help {
        font-size: 72%;
        color: #777777;
      }
      font-size: 84%;
    }
    margin-right: 8em;
  }
`;
