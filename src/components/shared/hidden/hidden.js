/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect } from 'react';
import { QUEEN_URL } from 'utils/constants';
import { StyleWrapper } from './hidden.style';

const HiddenGame = () => {
  const [game, setGame] = useState(false);

  useEffect(() => {
    if (!game) {
      const init = async () => {
        const jsFile = await fetch('/hidden/conf.json');
        try {
          await jsFile.json();
          setGame(true);
        } catch (error) {
          setGame(false);
        }
      };
      init();
    }
  }, [game]);

  return (
    <>
      {game && (
        <StyleWrapper className="Game">
          <iframe
            title="dino"
            className="dino-game"
            src={`${QUEEN_URL}/hidden`}
            width="100%"
            scrolling="no"
          />
        </StyleWrapper>
      )}
    </>
  );
};

export default HiddenGame;
