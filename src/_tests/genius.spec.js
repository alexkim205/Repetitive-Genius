import chai, {expect} from "chai";
import Genius from "../_services/genius.service";
// const chai = require("chai");
// const Genius = require("../_services/genius.service");
// const expect = chai.expect;
// import Genius from "../_services/genius.service";

const sample = {
  id: 2332455,
  artistid: 2300,
  url: "https://genius.com/Adele-hello-lyrics",
  song: "Hello"
};

const genius = new Genius();

const handleExpectations = data => {
  expect(data.meta.status).to.equal(200);
  expect(data).to.be.a("object");
  expect(data).to.have.property("response");
};

describe("Genius API", () => {
  describe("/GET annotation", () => {
    it("it should get an annotation", () => {
      return genius.getAnnotation(sample.id).then(handleExpectations);
    });
  });
  describe("/GET referents", () => {
    it("it should get referents for a song", () => {
      return genius.getReferents(sample.id).then(handleExpectations);
    });
  });
  describe("/GET song", () => {
    it("it should get song", () => {
      return genius.getSong(sample.id).then(handleExpectations);
    });
  });
  describe("/GET artist", () => {
    it("it should get an artist", () => {
      return genius.getArtist(sample.artistid).then(handleExpectations);
    });
  });
  describe("/GET artist songs", () => {
    it("it should get an artist's discography", () => {
      return genius.getArtistSongs(sample.artistid).then(handleExpectations);
    });
  });
  describe("/GET webpage", () => {
    it("it should get a webpage by url", () => {
      return genius.getWebPage(sample.url).then(handleExpectations);
    });
  });
  describe("/GET song search", () => {
    it("it should search for a song", () => {
      return genius.searchSong(sample.song).then(handleExpectations);
    });
  });
});
