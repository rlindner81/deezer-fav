"use strict";

const util = require("node:util");
const fs = require("node:fs/promises");
const { request } = require("./request");

const API_URL = "https://www.deezer.com/ajax/gw-light.php";

class Deezer {
  constructor() {
    this.__arlCookie = process.env.DEEZER_ARL;
  }

  /**
   * @returns {Deezer}
   */
  static getInstance() {
    if (!Deezer.__instance) {
      Deezer.__instance = new Deezer();
    }
    return Deezer.__instance;
  }

  async getToken() {
    if (this.__token === undefined) {
      this.__token = (async () => (await this.apiCall("deezer.getUserData", ""))["USER_TOKEN"])();
    }
    return this.__token;
  }

  async apiCall(method, token) {
    const response = await request({
      url: API_URL,
      query: {
        method: method,
        input: "3",
        api_version: "1.0",
        api_token: token ?? (await this.getToken()),
        cid: Math.floor(10e9 * Math.random()),
      },
      headers: {
        Cookie: `arl=${this.__arlCookie}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (data.error.length !== 0) {
      throw new Error(util.format("failed deezer api call: %O", data.error));
    }
    return data.results;
  }

  async getFavoriteTracks() {
    const favorites = await this.apiCall("favorite.getFavoriteTracks");

    await fs.writeFile("temp/dump-getUserData.json", JSON.stringify(bla, null, 2) + "\n");
    console.log("getFavoriteTracks");
  }
}

module.exports = Deezer.getInstance();
