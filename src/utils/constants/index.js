export const KEYCLOAK = 'keycloak';
export const ANONYMOUS = 'anonymous';
export const AUTHENTICATION_MODE_ENUM = [ANONYMOUS, KEYCLOAK];

export const READ_ONLY = 'readonly';
export const QUEEN_URL = window.localStorage.getItem('QUEEN_URL') || '';
export const QUEEN_USER_KEY = 'QUEEN_USER';
export const SYNCHRONIZE_KEY = 'SYNCHRONIZE';

export const QUEEN_SYNC_RESULT = 'QUEEN_SYNC_RESULT';
export const QUEEN_SYNC_RESULT_SUCCESS = 'SUCCESS';
export const QUEEN_SYNC_RESULT_FAILURE = 'FAILURE';
export const QUEEN_SYNC_RESULT_PENDING = 'PENDING';
export const GUEST_QUEEN_USER = {
  lastName: 'Guest',
  firstName: 'Guest',
  id: 'Guest',
  roles: ['Guest'],
};

export const AUTHORIZED_ROLES = ['Guest', 'offline_access'];

export const JSON_UTF8_HEADER = 'application/json;charset=utf-8';

export const REFUSAL_LABEL = '__REFUSAL__';
export const REFUSAL = 'REFUSAL';
export const DOESNT_KNOW_LABEL = '__DOESNT_KNOW__';
export const DOESNT_KNOW = 'DOESNT_KNOW';
export const QUEEN_DATA_KEYS = [REFUSAL, DOESNT_KNOW];

export const DIRECT_CONTINUE_COMPONENTS = ['CheckboxOne', 'Radio'];

export const KEYBOARD_SHORTCUT_COMPONENTS = [...DIRECT_CONTINUE_COMPONENTS, 'CheckboxGroup'];

export const QUESTIONNAIRE_EXAMPLE_URL = `${QUEEN_URL ||
  window.location.origin}/static/questionnaire/simpsons.json`;
