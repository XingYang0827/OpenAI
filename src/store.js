import { observable, computed, makeObservable } from 'mobx';
import { Auth } from 'aws-amplify';
import FuzzySet from 'fuzzyset';
import Filter from 'bad-words';

import TOOLS from './tools';
import config from './config';

let filterBadWords = new Filter();

const FuzzySearch = FuzzySet([...TOOLS.map(tool => tool.title)]);

class appStore {
  // Other properties and methods omitted for brevity

  constructor() {
    makeObservable(this);
    this.init();
  }

  init = async () => {
    try {
      this.referralTrackingCode();
      const user = await Auth.currentAuthenticatedUser();
      if (user) {
        this.setProfile(user);
        this.isLoggedIn = true;
        this.refreshProfile();
      }
    } catch (err) {
      console.error(err);
    }
  };

  login = async (username, password) => {
    try {
      const user = await Auth.signIn(username, password);
      this.setProfile(user);
      this.isLoggedIn = true;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  refreshProfile = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      this.setProfile(user);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  logout = async () => {
    try {
      await Auth.signOut();
      this.setProfile({});
      this.isLoggedIn = false;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  // Other methods omitted for brevity
}

export default new appStore();
