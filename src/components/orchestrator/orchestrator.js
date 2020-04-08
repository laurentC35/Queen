import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import * as lunatic from '@inseefr/lunatic';
import alphabet from 'utils/constants/alphabet';
import * as UQ from 'utils/questionnaire';
import { DIRECT_CONTINUE_COMPONENTS, KEYBOARD_SHORTCUT_COMPONENTS } from 'utils/constants';
import Header from './header';
import Buttons from './buttons';
import NavBar from './rightNavbar';

const Orchestrator = ({
  surveyUnit,
  readonly,
  savingType,
  preferences,
  source,
  dataSU,
  filterDescription,
  save,
  close,
}) => {
  const [navOpen, setNavOpen] = useState(false);

  const [questionnaire, setQuestionnaire] = useState(source);
  const [currentPage, setCurrentPage] = useState(1);
  /**
   * viewedPages : list of page viewed by user
   */
  const [viewedPages, setViewedPages] = useState([1]);

  const [queenData, setQueenData] = useState(dataSU.queenData);
  const [comment, setComment] = useState(surveyUnit.comment);
  const [clickPrevious, setClickPrevious] = useState(false);
  const [previousResponse, setPreviousResponse] = useState(null);

  /**
   * This function updates the values of the questionnaire responses
   * from the data entered by the user.
   * This function is disabled when app is in readonly mode.
   * @param {*} component the current component
   */
  const onChange = component => updatedValue => {
    if (!readonly) {
      if (!previousResponse) {
        setPreviousResponse(UQ.getCollectedResponse(component));
      }
      setQuestionnaire(
        lunatic.updateQuestionnaire(savingType)(questionnaire)(preferences)(updatedValue)
      );
    }
  };

  const bindings = lunatic.getBindings(questionnaire);

  /**
   * queenComponents = all components expect empty Subsequence.
   * (Empty Subsequence hasn't page attribute)
   */
  const queenComponents = questionnaire.components.filter(c => c.page);
  const filteredComponents = queenComponents.filter(
    ({ conditionFilter }) => lunatic.interpret(['VTL'])(bindings)(conditionFilter) === 'normal'
  );

  const component = filteredComponents.find(({ page }) => page === currentPage);
  const { id, componentType, sequence, subsequence, options, ...props } = component;
  // TODO : get specialAnswer from component (specified in Pogues)
  // to wait, set to false by default
  const specialAnswer = { refusal: false, doesntKnow: false };

  /**
   *  This function update response values in questionnaire and queenData.
   *  At the end, it calls the saving method of its parent (saving into indexdb)
   * @param {*} lastQueenData (queenData update by "Refusal" and "doesn't know" buttons )
   */
  const saveQueen = (lastQueenData = queenData) => {
    let newQuestionnaire = questionnaire;
    if (previousResponse) {
      const newResponse = UQ.getCollectedResponse(component);
      if (JSON.stringify(newResponse) !== JSON.stringify(previousResponse)) {
        newQuestionnaire = UQ.updateResponseFiltered(newQuestionnaire)(component);
        setQuestionnaire(newQuestionnaire); // update questionnaire with updated values
      }
    }
    setQueenData(lastQueenData); // update queenData according to selected buttons
    const dataToSave = UQ.getStateToSave(newQuestionnaire)(lastQueenData);
    save({ ...surveyUnit, data: dataToSave, comment });
  };

  /**
   * @return boolean if user has entered at least one value in current component.
   */
  const goNextCondition = () => {
    const responseKeys = Object.keys(UQ.getCollectedResponse(component));
    return ['Sequence', 'Subsequence'].includes(componentType) || responseKeys.length !== 0;
  };

  const goPrevious = (lastQueenData = queenData) => {
    saveQueen(lastQueenData);
    setClickPrevious(true);
    setPreviousResponse(null);
    setCurrentPage(UQ.getPreviousPage(filteredComponents)(currentPage));
  };

  const goNext = (lastQueenData = queenData) => {
    saveQueen(lastQueenData);
    setClickPrevious(false);
    setPreviousResponse(null);
    const nextPage = UQ.getNextPage(filteredComponents)(currentPage);
    setViewedPages([...viewedPages, nextPage]);
    setCurrentPage(nextPage);
  };

  const goFastForward = (lastQueenData = queenData) => {
    saveQueen(lastQueenData);
    setClickPrevious(false);
    setPreviousResponse(null);
    const fastForwardPage = UQ.getFastForwardPage(filteredComponents)(lastQueenData);
    setCurrentPage(fastForwardPage);
  };

  const quit = () => {
    saveQueen();
    close();
  };

  useEffect(() => {
    if (DIRECT_CONTINUE_COMPONENTS.includes(componentType)) {
      goNext();
    }
  }, [questionnaire]);

  const Component = lunatic[componentType];
  const newOptions = UQ.buildQueenOptions(componentType, options, bindings);
  // const keyToHandle = ['alphanumeric'];
  return (
    <>
      <div id="queen-body" className={navOpen ? 'back' : ''}>
        <Header
          title={questionnaire.label}
          sequence={lunatic.interpret(['VTL'])(bindings)(sequence)}
          components={filteredComponents}
          bindings={bindings}
          subsequence={lunatic.interpret(['VTL'])(bindings)(subsequence)}
          setPage={setCurrentPage}
          viewedPages={viewedPages}
          setNavOpen={setNavOpen}
        />
        <div className="body-container">
          <div className="components">
            <div
              className={`lunatic lunatic-component ${
                newOptions.length >= 8 ? 'split-fieldset' : ''
              }`}
              key={`component-${id}`}
            >
              <Component
                id={id}
                {...props}
                options={newOptions}
                handleChange={onChange(component)}
                labelPosition="TOP"
                preferences={preferences}
                features={['VTL']}
                bindings={bindings}
                filterDescription={filterDescription}
                readOnly={readonly}
                disabled={readonly}
                focused
                keyboardSelection={componentType === 'CheckboxGroup'}
              />
            </div>
          </div>
          <NavBar nbModules={queenComponents.length} page={currentPage} />
          <Buttons
            currentComponent={component}
            specialAnswer={specialAnswer}
            page={UQ.findPageIndex(filteredComponents)(currentPage)}
            canContinue={goNextCondition()}
            queenData={queenData}
            previousClicked={clickPrevious}
            nbModules={filteredComponents.length}
            pagePrevious={goPrevious}
            pageNext={goNext}
            pageFastForward={goFastForward}
            quit={quit}
          />
          {/* {KEYBOARD_SHORTCUT_COMPONENTS.includes(componentType) && (
            <KeyboardEventHandler
              handleKeys={keyToHandle}
              onKeyEvent={(key, e) => {
                const responses = UQ.getResponsesNameFromComponent(component);
                const responsesCollected = UQ.getCollectedResponse(component);
                const updatedValue = {};
                if (componentType === 'CheckboxOne') {
                  updatedValue[responses[0]] = key;
                  onChange(component)(updatedValue);
                } else if (componentType === 'CheckboxGroup') {
                  const index = alphabet.findIndex(l => l.toLowerCase() === key.toLowerCase());
                  updatedValue[responses[index]] = !responsesCollected[responses[index]];
                  onChange(component)(updatedValue);
                }
              }}
              handleFocusableElements
            />
          )} */}
        </div>
      </div>
    </>
  );
};

Orchestrator.propTypes = {
  surveyUnit: PropTypes.objectOf(PropTypes.any).isRequired,
  readonly: PropTypes.bool.isRequired,
  savingType: PropTypes.oneOf(['COLLECTED', 'FORCED', 'EDITED']).isRequired,
  preferences: PropTypes.arrayOf(PropTypes.string).isRequired,
  filterDescription: PropTypes.bool.isRequired,
  source: PropTypes.objectOf(PropTypes.any).isRequired,
  dataSU: PropTypes.shape({
    data: PropTypes.objectOf(PropTypes.any).isRequired,
    queenData: PropTypes.objectOf(PropTypes.any).isRequired,
  }).isRequired,
  save: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
};

export default Orchestrator;
