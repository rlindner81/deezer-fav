"use strict";

const { getFavoriteTracks } = require("./deezer");
const { getLocalTracks, updatePlaylist } = require("./apple-music");
const { matchTracks } = require("./track-matcher");

const main = async () => {
  const deezerFavoriteTracks = await getFavoriteTracks();
  const musicLocalTracks = await getLocalTracks();
  const matches = matchTracks(deezerFavoriteTracks, musicLocalTracks);
  await updatePlaylist(matches);
};

module.exports = {
  main,
};
