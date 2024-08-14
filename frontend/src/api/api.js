import axios from "axios";

const BASE_URL = "http://localhost:3001";




class OtfApi {
  // the token for interaction with the API will be stored here.
  static token;

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${OtfApi.token}` };
    const params = (method === "get")
        ? data
        : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  /** Signup for site. */

  static async signup(data) {
    let res = await this.request(`auth/signup`, data, "post");
    return res.token;
  }
  /** Get token for login from username, password. */

  static async login(data) {
    let res = await this.request(`auth`, data, "post");
    return res.token;
  }
  
  static async addMember(data) {
    let res = await this.request(`users`, data, "post");
    return res;
  }

  static async getCurrentUser(email) {
    let res = await this.request(`users/${email}`);
    return res.user;
  }

  static async addToParticipants(data) {
    let res = await this.request(`participants`, data, "post");
    return res;
  }
  
  static async getAssociatedUsers(email) {
    let res = await this.request(`participants/${email}`);
    return res;
  }

  static async getUserCalendars(user_id) {
    let res = await this.request(`calendars/${user_id}`);
    return res;
  }

  static async createUserEvent(data) {
    let res = await this.request(`events`, data, "post");
    return res;
  }
  
  static async getUserEvents(user_id, calendar_id) {
    let res = await this.request(`events/${user_id}/${calendar_id}`);
    return res;
  }
  
  static async removeUserEvent(user_id, e_token) {
    let res = await this.request(`events/${user_id}/${e_token}/del`, {}, "delete");
    return res;
  }

  static async sendMessage(data) {
    let res = await this.request(`groupchats/send`, data, "post");
    return res;
  }

  static async getMessages(user_id) {
    let res = await this.request(`groupchats/${user_id}`);
    return res;
  }
}


export default OtfApi;