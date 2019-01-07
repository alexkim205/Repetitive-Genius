import axios from "axios";
import { corsHelper } from "../_helpers";

const getSongLyrics = function(url) {
  var lyricsUrl = corsHelper(url);
  console.log(lyricsUrl)

  return axios.get(lyricsUrl).then(response => {
    if (response.status !== 200) {
      throw new Error('Something went wrong ...');
    }
    var el = document.createElement("html");
    el.innerHTML = response.data;

    const lyricsContainer = el
      .getElementsByClassName("lyrics")[0]
      .getElementsByTagName("P")[0];
    const lyrics = lyricsContainer.textContent.split("\n");
    return lyrics;
  });
};

export { getSongLyrics };
