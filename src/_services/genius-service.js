const apiKeys = require("../_config/api-keys");
const https = require("https");
const querystring = require("querystring");

const BASE_URL = "https://api.genius.com/";
const AUTH_URL = "https://api.genius.com/oauth/authorize";


class Genius {
  constructor() {
    // Set the configuration settings
    this.credentials = {
      client: {
        id: apiKeys.genius.id,
        secret: apiKeys.genius.secret
      },
      auth: {
        tokenHost: "https://api.genius.com/oauth/authorize"
      }
    };

    // Request client access token
    const oauth2 = require("simple-oauth2").create(this.credentials);
    (async () => {
      try {
        const result = await oauth2.clientCredentials.getToken({});
        console.log(result);
        this.at = oauth2.accessToken.create(result);
      } catch (error) {
        console.log("Access Token error", error.message);
      }
    })();
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
        if (response.statusCode < 200 || response.statusCode > 299) {
          // console.log(response)
          console.log(this.at)
          var payload = {
            error: response.statusMessage,
            status: response.statusCode
          };
          reject(payload);
        }
        // temporary data holder
        var body = "";
        // on every content chunk, push it to the data array
        response.on("data", chunk => {
          body += chunk.toString();
        });
        // we are done, resolve promise with those joined chunks
        response.on("end", () => resolve(body));
      });
      // handle connection errors of the request
      request.on("error", err => reject(err));
    });
  }

  requestPromise(request) {
    let _this = this;

    return new Promise((resolve, reject) => {
      _this
        .request(request)
        .then(data => {
          // console.log(data)
          resolve(JSON.parse(data).response);
        })
        .catch(data => {
          // console.log(data.error)
          reject(JSON.parse(data.error.body));
        });
    });
  }

  annotation(id, options) {
    let request = {
      url: "annotations/" + id,
      qs: options
    };
    return this.requestPromise(request);
  }
}

var genius = new Genius()
genius.annotation(6737668).then(function(response) {
  console.log(response.annotation);
});

module.exports = Genius;
