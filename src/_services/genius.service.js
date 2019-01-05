import * as apiKeys from "../_config/api-keys";
import axios from "axios";

const BASE_URL = "https://api.genius.com/";

/*
Genius API - https://docs.genius.com
Only GET API exposed
*/

class Genius {
  constructor() {
    // Set the configuration settings
    this.at = apiKeys.genius.access;
    this.defaultTextFormat = { text_format: "dom" };
  }

  request(options, callback) {
    const { url, qs } = options;
    const axiosReq = axios.create({
      baseURL: BASE_URL,
      timeout: 1000,
      headers: {
        Authorization: `Bearer ${this.at}`,
        "Content-Type": "application/json"
      }
    });

    return axiosReq.get(`/${url}`, {
      params: qs
    });
  }

  getAnnotation(id, options) {
    let request = {
      url: `annotations/${id}`,
      qs: { ...this.defaultTextFormat, ...options }
    };
    return this.request(request);
  }

  getReferents(id, options) {
    let defaultOptions = {
      // per_page: '',
      // page: '',
    };
    let request = {
      url: "referents",
      qs: { ...this.defaultTextFormat, ...defaultOptions, song_id: id }
    };
    return this.request(request);
  }

  getSong(id, options) {
    let request = {
      url: `songs/${id}`,
      qs: { ...this.defaultTextFormat, ...options }
    };
    return this.request(request);
  }

  getArtist(id, options) {
    // let defaultOptions = {
    //   // per_page: '',
    //   // page: '',
    // };
    let request = {
      url: `artists/${id}`,
      qs: { ...this.defaultTextFormat, ...options }
    };
    return this.request(request);
  }

  getArtistSongs(id, options) {
    let defaultOptions = {
      sort: "popularity" // title (default) or popularity
      // per_page: '',
      // page: '',
    };
    let request = {
      url: `artists/${id}/songs`,
      qs: { ...this.defaultTextFormat, ...defaultOptions, ...options }
    };
    return this.request(request);
  }

  getWebPage(url, options) {
    let request = {
      url: "web_pages/lookup",
      qs: { raw_annotatable_url: url }
    };
    return this.request(request);
  }

  searchSong(_q) {
    let request = {
      url: "search",
      qs: { q: _q }
    };
    return this.request(request);
  }
}

// var genius = new Genius();
// genius
//   .searchSong("HUMBLE")
//   .then(data => {
//     console.log(data.response);
//   })
//   .catch(err => {
//     console.log(err);
//   });

export default Genius;
