"use strict";

const { expect } = require("chai");

const { SourcePos } = $pos;

describe(".compare", () => {
  it("should return negative number if the first position is ahead of the second", () => {
    // posA.name < posB.name
    {
      const posA = new SourcePos("foo1", 6, 28);
      const posB = new SourcePos("foo2", 6, 28);
      expect(SourcePos.compare(posA, posB)).to.be.lessThan(0);
    }
    // posA.line < posB.line
    {
      const posA = new SourcePos("foo", 6, 28);
      const posB = new SourcePos("foo", 7, 28);
      expect(SourcePos.compare(posA, posB)).to.be.lessThan(0);
    }
    // posA.column < posB.column
    {
      const posA = new SourcePos("foo", 6, 28);
      const posB = new SourcePos("foo", 6, 29);
      expect(SourcePos.compare(posA, posB)).to.be.lessThan(0);
    }
    // priority: name > line > column
    {
      const posA = new SourcePos("foo1", 7, 28);
      const posB = new SourcePos("foo2", 6, 28);
      expect(SourcePos.compare(posA, posB)).to.be.lessThan(0);
    }
    {
      const posA = new SourcePos("foo1", 6, 29);
      const posB = new SourcePos("foo2", 6, 28);
      expect(SourcePos.compare(posA, posB)).to.be.lessThan(0);
    }
    {
      const posA = new SourcePos("foo", 6, 29);
      const posB = new SourcePos("foo", 7, 28);
      expect(SourcePos.compare(posA, posB)).to.be.lessThan(0);
    }
  });

  it("should return positive number if the first position is behind the second", () => {
    // posA.name < posB.name
    {
      const posA = new SourcePos("foo2", 6, 28);
      const posB = new SourcePos("foo1", 6, 28);
      expect(SourcePos.compare(posA, posB)).to.be.greaterThan(0);
    }
    // posA.line < posB.line
    {
      const posA = new SourcePos("foo", 7, 28);
      const posB = new SourcePos("foo", 6, 28);
      expect(SourcePos.compare(posA, posB)).to.be.greaterThan(0);
    }
    // posA.column < posB.column
    {
      const posA = new SourcePos("foo", 6, 29);
      const posB = new SourcePos("foo", 6, 28);
      expect(SourcePos.compare(posA, posB)).to.be.greaterThan(0);
    }
    // priority: name > line > column
    {
      const posA = new SourcePos("foo2", 6, 28);
      const posB = new SourcePos("foo1", 7, 28);
      expect(SourcePos.compare(posA, posB)).to.be.greaterThan(0);
    }
    {
      const posA = new SourcePos("foo2", 6, 28);
      const posB = new SourcePos("foo1", 6, 29);
      expect(SourcePos.compare(posA, posB)).to.be.greaterThan(0);
    }
    {
      const posA = new SourcePos("foo", 7, 28);
      const posB = new SourcePos("foo", 6, 29);
      expect(SourcePos.compare(posA, posB)).to.be.greaterThan(0);
    }
  });

  it("should return zero if two positions are equal", () => {
    const posA = new SourcePos("foo", 6, 28);
    const posB = new SourcePos("foo", 6, 28);
    expect(SourcePos.compare(posA, posB)).to.equal(0);
  });
});
