"use strict";

const { expect } = require("chai");

const {
  show,
  SourcePos,
  ErrorMessageType,
  ErrorMessage,
  StrictParseError,
  Config,
  State,
  Result,
} = _core;

const { LanguageDef } = _language;
const { makeTokenParser } = _token;

describe(".semi", () => {
  it("should parse a semicolon", () => {
    const def = new LanguageDef({});
    const tp = makeTokenParser(def);
    const semi = tp.semi;
    expect(semi).to.be.a.parser;
    // csucc
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "; ABC",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = semi.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 3),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),
            ]
          ),
          ";",
          new State(
            new Config({ tabWidth: 8 }),
            "ABC",
            new SourcePos("foobar", 1, 3),
            "none"
          )
        )
      )).to.be.true;
    }
    // efail
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "ABC",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = semi.run(initState);
      expect(Result.equal(
        res,
        Result.efail(
          new StrictParseError(
            new SourcePos("foobar", 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
              ErrorMessage.create(ErrorMessageType.EXPECT, show(";")),
            ]
          )
        )
      )).to.be.true;
    }
  });
});
