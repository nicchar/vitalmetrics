import { storage } from '../sqlite.js';

const KEY = 'vm_profile';

const defaults = {
  name: '',
  weightGoal: null,   // kg
  sex: '',            // 'm' | 'f' | ''
  birthYear: null
};

export const profileRepo = {
  get() {
    return { ...defaults, ...storage.get(KEY) };
  },
  save(profile) {
    storage.set(KEY, { ...this.get(), ...profile });
  }
};
