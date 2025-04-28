"use strict";

const util = require("node:util");
const fs = require("node:fs/promises");
const { request } = require("./request");

const API_URL = "https://www.deezer.com/ajax/gw-light.php";

const apiCall = async (method, token = "") => {
  const response = await request({
    url: API_URL,
    query: {
      method: method,
      input: "3",
      api_version: "1.0",
      api_token: token,
      cid: Math.floor(10e9 * Math.random()),
    },
    headers: {
      Cookie: `arl=${process.env.DEEZER_ARL}`,
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  if (data.error.length !== 0) {
    throw new Error(util.format("failed deezer api call: %O", data.error));
  }
  return data.results;
};

const getFavoriteTracks = async () => {
  const userData = await apiCall("deezer.getUserData");
  const token = userData["USER_TOKEN"];
  const favorites = await apiCall("favorite.getFavoriteTracks", token);

  await fs.writeFile("temp/dump-getUserData.json", JSON.stringify(bla, null, 2) + "\n");
  console.log("getFavoriteTracks");
};

module.exports = {
  getFavoriteTracks,
};
