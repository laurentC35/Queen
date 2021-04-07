/* eslint-disable no-alert */
import React, { useState, useEffect, useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Preloader from 'components/shared/preloader';
import Error from 'components/shared/Error';
import NotFound from 'components/shared/not-found';
import { AppContext } from 'components/app';
import { useAPI, useAPIRemoteData } from 'utils/hook';
import surveyUnitIdbService from 'utils/indexedbb/services/surveyUnit-idb-service';
import { READ_ONLY } from 'utils/constants';
import { sendCloseEvent } from 'utils/communication';
import Orchestrator from '../orchestrator';

const OrchestratorManager = () => {
  const configuration = useContext(AppContext);
  const { readonly: readonlyParam, idQ, idSU } = useParams();
  const history = useHistory();
  const { surveyUnit, questionnaire, loadingMessage, errorMessage } = useAPIRemoteData(idSU, idQ);

  const [source, setSource] = useState(null);
  const { putUeData } = useAPI(idSU, idQ);

  const [init, setInit] = useState(false);

  const [readonly] = useState(readonlyParam === READ_ONLY);

  /**
   * Build special questionnaire for Queen
   * Build special data of survey-unit for Queen
   */
  useEffect(() => {
    if (!init && questionnaire && surveyUnit) {
      setSource(questionnaire);
      setInit(true);
    }
  }, [init, questionnaire, surveyUnit]);

  const [, /* sending */ setSending] = useState(false);
  const [, /* errorSending */ setErrorSending] = useState(false);

  const putSurveyUnit = async unit => {
    const { id, ...other } = unit;
    setErrorSending(null);
    setSending(true);
    const { /* status, */ error: putDataError } = await putUeData(other);
    setSending(false);
    if (putDataError) setErrorSending('Error during sending');
  };

  const saveSU = async unit => {
    if (!readonly) {
      await surveyUnitIdbService.addOrUpdateSU(unit);
      if (configuration.standalone) await putSurveyUnit(unit);
    }
  };

  const closeOrchestrator = () => {
    if (configuration.standalone) {
      history.push('/');
    } else {
      sendCloseEvent(surveyUnit.id);
    }
  };

  return (
    <>
      {![READ_ONLY, undefined].includes(readonlyParam) && <NotFound />}
      {loadingMessage && <Preloader message={loadingMessage} />}
      {errorMessage && <Error message={errorMessage} />}
      {init && !loadingMessage && !errorMessage && source && surveyUnit && (
        <Orchestrator
          surveyUnit={surveyUnit}
          source={source}
          standalone={configuration.standalone}
          readonly={readonly}
          savingType="COLLECTED"
          preferences={['PREVIOUS', 'COLLECTED']}
          features={['VTL']}
          pagination={true}
          filterDescription={false}
          save={saveSU}
          close={closeOrchestrator}
        />
      )}
    </>
  );
};

export default OrchestratorManager;
