const SET = '@surge/firebase/SET';
const SET_BATCH = '@surge/firebase/SET_BATCH';

const initialState = {
  peaks: {},
  valleys: {},
  histories: {}
};

export default function firebase(state = initialState, action = {}) {
  switch (action.type) {
    case SET:
      return {
        ...state,
        [action.path]: {
          ...state[action.path],
          [action.id]: action.data
        }
      };
    case SET_BATCH:
      const batch = {};
      const data = Array.isArray(action.data) ? action.data : Object.values(action.data);

      data.forEach(event => batch[`${event.id}`] = event);

      return {
        ...state,
        [action.path]: {
          ...state[action.path],
          ...batch
        }
      };
    default:
      return state;
  }
}

export function set(event, path) {
  return {
    type: SET,
    id: `${event.id}`,
    data: event,
    path
  };
}

export function setBatch(batch, path) {
  return {
    type: SET_BATCH,
    data: batch,
    path
  };
}
