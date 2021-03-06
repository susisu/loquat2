"use strict";

const { expect } = require("chai");

const { SourcePos } = $pos;

describe(".constructor", () => {
  it("should create a new `SourcePos' instance", () => {
    const pos = new SourcePos("foo", 6, 28);
    expect(pos).to.be.an.instanceOf(SourcePos);
    expect(pos.name).to.equal("foo");
    expect(pos.line).to.equal(6);
    expect(pos.column).to.equal(28);
  });
});
