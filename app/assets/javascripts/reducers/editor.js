'use strict';

import assign from 'lodash/object/assign';
import omit from 'lodash/object/omit';

import { createStore, getActionIds } from '../utils/redux/';
import { editor } from '../actions/';
import makeFileTree from '../utils/makeFileTree';

const actions = getActionIds(editor);

const initialState = {
  app: {},
  newName: null,
  newBuildId: null,
  showHeader: true,
  fileBodies: {},
  fileTree: {},
  ios: null,
  android: null,
  currentFile: 'index.ios.js',
  appSaveInProgress: false,
  appIsPicked: null,
  forkToken: null,
  unsavedChanges: false,
  saved: false
};

export default createStore(initialState, {

  [`${actions.switchApp}`]: (state, { app }) => ({
    ...state,
    app,
    currentFile: app.platform == 'ios' ? 'index.ios.js' : 'index.android.js',
    fileTree: makeFileTree(Object.keys(app.files))
  }),

  [`${actions.switchFile}`]: (state, { currentFile }) => {
    currentFile = state.app.files[currentFile] ?
      currentFile :
      initialState.currentFile;

    return {
      ...state,
      currentFile
    }
  },

  [`${actions.toggleHeader}`]: (state, { show }) => ({
    ...state,
    showHeader: show
  }),

  [`${actions.updateName}`]: (state, { newName }) => ({
    ...state,
    newName
  }),

  [`${actions.updateBody}`]: (state, { filename, body }) => ({
    ...state,
    fileBodies: assign({}, state.fileBodies, {[filename]: body}),
    unsavedChanges: true,
    saved: false
  }),

  [`${actions.viewerUpdateBuild}`]: (state, { newBuildId }) => ({
    ...state,
    newBuildId
  }),

  [`${actions.authorSelectSupportedPlatform}-success`]: (state, { platform, value }) => {

    var state = {...state};
    state[platform] = value;

    return state;
  },

  [`${actions.authorUpdateBuild}-success`]: (state, { newBuildId, newPlatform }) => ({
    ...state,
    newBuildId,
    currentFile: newPlatform == 'ios' ? 'index.ios.js' : 'index.android.ios'
  }),

  [`${actions.authorUpdateBuild}-failure`]: (state, { newBuildId }) => ({
    ...state
  }),

  [`${actions.saveFile}-success`]: (state, { filename }) => ({
    ...state,
    fileBodies: assign({}, omit(state.fileBodies, filename)),
    unsavedChanges: false,
    saved: true
  }),

  [`${actions.saveApp}`]: (state) => ({
    ...state,
    appSaveInProgress: true,
    appSaveError: null
  }),

  [`${actions.saveApp}-success`]: (state) => ({
    ...state,
    fileBodies: {},
    newBuildId: null,
    appSaveError: false,
    appSaveInProgress: false,
    unsavedChanges: false,
    saved: true
  }),

  [`${actions.saveApp}-failure`]: (state, { fileBodies, error }) => {
    return ({
      ...state,
      appSaveInProgress: false,
      // TODO move this somewhere else and maybe include the real error message
      appSaveError: 'There was an error saving your application, please try again.',
      fileBodies: assign({}, fileBodies, state.fileBodies)
    })
  },

  [`${actions.toggleFileSelector}`]: (state, { fileBodies, error }) => {
    return ({
      ...state,
      fileSelectorOpen: state.fileSelectorOpen == null ? false : !state.fileSelectorOpen,
    })
  },

  [`${actions.toggleAppPickStatus}-success`]: (state, { picked }) => {
    return ({
      ...state,
      appIsPicked: picked,
    })
  },

  [`${actions.forkApp}-success`]: (state, { result: { token } }) => {
    return ({
      ...state,
      forkToken: token
    })
  }

});
