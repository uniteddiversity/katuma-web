import _ from 'underscore';
const LOAD = 'redux-example/users/LOAD';
const LOAD_SUCCESS = 'redux-example/users/LOAD_SUCCESS';
const LOAD_FAIL = 'redux-example/users/LOAD_FAIL';

const initialState = {
  users: {
    entities: [],
    byId: {}}
};

export default function usersReducer(state = initialState, action = {}) {
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
        users: {entities: entities, byId: _.indexBy(entities, 'id')},
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

export function load(groupId) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get(`/users?group_id=${groupId}`)
  };
}
