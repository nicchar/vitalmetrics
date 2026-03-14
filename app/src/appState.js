/**
 * Lightweight reactive app state.
 * Usage: state.set('currentBiomarkerId', 'vitamin_d')
 *        state.on('currentBiomarkerId', handler)
 */
const _state = {
  currentScreen: 'dashboard',   // 'dashboard' | 'entry' | 'trend' | 'profile'
  currentBiomarkerId: null,      // selected biomarker for trend/entry screens
  catalog: null,                 // loaded biomarkerCatalog
  toast: null                    // { message, type } for feedback
};

const _listeners = {};

export const state = {
  get(key) {
    return _state[key];
  },
  set(key, value) {
    _state[key] = value;
    (_listeners[key] || []).forEach(fn => fn(value));
  },
  on(key, fn) {
    if (!_listeners[key]) _listeners[key] = [];
    _listeners[key].push(fn);
  },
  off(key, fn) {
    if (_listeners[key]) {
      _listeners[key] = _listeners[key].filter(f => f !== fn);
    }
  }
};
