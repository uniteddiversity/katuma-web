import _ from 'underscore';
const LOAD = 'redux-example/memberships/LOAD';
const LOAD_SUCCESS = 'redux-example/memberships/LOAD_SUCCESS';
const LOAD_FAIL = 'redux-example/memberships/LOAD_FAIL';

const initialState = {
  memberships: {entities: [], byGroupID: []}
};

export default function membershipsReducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true
      };
    case LOAD_SUCCESS:
      const entities = action.result;

      return {
        ...state,
        loading: false,
        memberships: {entities: entities, byGroupID: _.indexBy(entities, 'group_id')},
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    default:
      return state;
  }
}

export function load() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('/memberships')
  };
}
