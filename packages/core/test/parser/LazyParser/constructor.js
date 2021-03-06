"use strict";

const { expect } = require("chai");

const { ParseError } = $error;
const { Result, StrictParser, LazyParser } = $parser;


describe(".constructor", () => {
  it("should create a new `LazyParser` instance", () => {
    const parser = new LazyParser(() =>
      new StrictParser(state => Result.efail(ParseError.unknown(state.pos)))
    );
    expect(parser).to.be.an.instanceOf(LazyParser);
  });
});
