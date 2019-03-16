"use strict";

const { expect } = require("chai");

const { SourcePos } = _pos;
const { AbstractParseError } = _error;

describe("#setPosition", () => {
  it("should throw `Error` because not implemented", () => {
    const TestParseError = class extends AbstractParseError {
      constructor() {
        super();
      }
    };
    const err = new TestParseError();
    const pos = new SourcePos("foobar", 6, 28);
    expect(() => { err.setPosition(pos); }).to.throw(Error, /not implemented/i);
  });
});
