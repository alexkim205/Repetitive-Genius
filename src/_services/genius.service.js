import * as apiKeys from "../_config/api-keys";
import https from "https";
import querystring from "querystring";

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
    return new Promise((resolve, reject) => {
      // select http or https module, depending on reqested url
      const { url, qs } = options;
      const queries = querystring.stringify(qs);
      const defaultOptions = {
        path: `/${url}?${queries}`,
        headers: {
          Authorization: `Bearer ${this.at}`,
          "Content-Type": "application/json"
        }
      };
      const request = https.get(BASE_URL, defaultOptions, response => {
        // handle http errors
        if (response.statusCode !== 200) {
          var payload = {
            error: response.statusMessage,
            status: response.statusCode
          };
          reject(payload);
        }
        // populate temporary data holder and parse at end
        var body = "";
        response.on("data", chunk => (body += chunk));
        response.on("end", () => {
          var parsed = JSON.parse(body);
          resolve(parsed);
        });
      });
      // handle connection errors of the request
      request.on("error", err => reject(err));
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
    let defaultOptions = {
      // per_page: '',
      // page: '',
    };
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