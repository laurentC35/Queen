import React, { useRef } from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import PropTypes from 'prop-types';
import D from 'i18n';
import { StyleWrapper } from './continue.style';

const Button = ({ readonly, canContinue, isLastComponent, pageNext, finalQuit }) => {
  const lastLabel = readonly ? D.simpleQuit : D.saveAndQuit;
  const pageNextFunction = isLastComponent ? finalQuit : pageNext;
  const getNextLabel = isLastComponent ? lastLabel : D.continueButton;

  const continueButtonRef = useRef();

  const keysToHandle = ['alt+enter'];

  const keyboardShortcut = (key, e) => {
    e.preventDefault();
    if (key === 'alt+enter') {
      if (canContinue) {
        if (continueButtonRef && continueButtonRef.current) continueButtonRef.current.focus();
        pageNextFunction();
      }
    }
  };

  const componentToDisplay = (
    <>
      <StyleWrapper>
        <div className="continue-button">
          <button
            ref={continueButtonRef}
            aria-label={getNextLabel}
            type="button"
            onClick={pageNextFunction}
            disabled={!canContinue && !readonly}
          >
            {`${getNextLabel} ${(!isLastComponent && '\u2192') || ''}`}
          </button>
          <span className="help">{` ${D.helpShortCut} `}</span>
          <span>{D.ctrlEnter}</span>
        </div>
      </StyleWrapper>
      <KeyboardEventHandler
        handleKeys={keysToHandle}
        onKeyEvent={keyboardShortcut}
        handleFocusableElements
      />
    </>
  );

  return (
    <>
      {readonly && isLastComponent && componentToDisplay}
      {!readonly && componentToDisplay}
    </>
  );
};

Button.propTypes = {
  readonly: PropTypes.bool.isRequired,
  canContinue: PropTypes.bool.isRequired,
  isLastComponent: PropTypes.bool.isRequired,
  pageNext: PropTypes.func.isRequired,
  finalQuit: PropTypes.func.isRequired,
};

export default React.memo(Button);