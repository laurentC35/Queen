import React from 'react';
import D from 'i18n';
import { StyleWrapper } from './not-found.style';
import { version } from '../../../../package.json';

export default () => {
  const questionnaireUrl = 'http://localhost:8080/questionnaire/lunatic/456';
  const encodeUrl = encodeURIComponent(questionnaireUrl);
  const newUrl = 'http://localhost:5000/vizualise?questionnaire='.concat(encodeUrl);
  return (
    <StyleWrapper>
      <div className="content">
        <h1>{D.pageNotFound}</h1>
        <h2>{D.pageNotFoundHelp}</h2>
        <div>{`original url: ${newUrl}`}</div>
        <div>{`encode url: ${encodeUrl}`}</div>
        <button type="button" onClick={() => (window.location = newUrl)}>
          Change url
        </button>
      </div>

      <div className="version">{`Version ${version}`}</div>
    </StyleWrapper>
  );
};
