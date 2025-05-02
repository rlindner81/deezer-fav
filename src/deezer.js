"use strict";

const util = require("node:util");
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

  async getUserData() {
    if (this.__userData === undefined) {
      this.__userData = (async () => {
        const data = await this.apiCall("deezer.getUserData", { token: "" });
        // const fs = require("node:fs/promises");
        // await fs.writeFile("temp/dump-getUserData.json", JSON.stringify(data, null, 2) + "\n");
        return data;
      })();
    }
    return this.__userData;
  }

  async apiCall(method, { token, body } = {}) {
    const response = await request({
      method: "POST",
      url: API_URL,
      query: {
        method: method,
        input: "3",
        api_version: "1.0",
        api_token: token ?? (await this.getUserData())["checkForm"],
        cid: Math.floor(10e9 * Math.random()),
      },
      headers: {
        Cookie: `arl=${this.__arlCookie}`,
        "Content-Type": "application/json",
      },
      ...(body && { body }),
    });
    const data = await response.json();
    if (data.error.length !== 0) {
      throw new Error(util.format("failed deezer api call: %O", data.error));
    }
    return data.results;
  }

  async getFavoriteTracks() {
    console.log("getFavoriteTracks");
    const body = JSON.stringify({
      playlist_id: (await this.getUserData())["USER"]["LOVEDTRACKS_ID"],
      start: 0,
      nb: 10000,
    });
    const favorites = await this.apiCall("playlist.getSongs", { body });
    // const favorites = await this.apiCall("song.getFavoriteIds");
    const i = 0;
  }
}

module.exports = Deezer.getInstance();
