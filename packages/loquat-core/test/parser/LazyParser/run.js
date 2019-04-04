"use strict";

const { expect } = require("chai");

const { SourcePos } = _pos;
const { ErrorMessageType, ErrorMessage, StrictParseError } = _error;
const { Config, State, Result, StrictParser, LazyParser } = _parser;

describe("#run", () => {
  it("should evaluate the thunk and run the resultant parser with the given state", () => {
    let flag = false;
    let evaluated = false;
    const parser = new LazyParser(() => {
      evaluated = true;
      return new StrictParser(state => {
        flag = true;
        expect(State.equal(state, new State(
          new Config({ tabWidth: 4, unicode: true }),
          "test",
          new SourcePos("main", 496, 6, 28),
          "none"
        ))).to.be.true;
        return Result.csucc(
          new StrictParseError(
            new SourcePos("main", 506, 7, 29),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
              ErrorMessage.create(ErrorMessageType.UNEXPECT, "bar"),
              ErrorMessage.create(ErrorMessageType.EXPECT, "baz"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "qux"),
            ]
          ),
          "val",
          new State(
            new Config({ tabWidth: 4, unicode: true }),
            "rest",
            new SourcePos("main", 516, 8, 30),
            "some"
          )
        );
      });
    });
    const res = parser.run(new State(
      new Config({ tabWidth: 4, unicode: true }),
      "test",
      new SourcePos("main", 496, 6, 28),
      "none"
    ));
    expect(evaluated).to.be.true;
    expect(flag).to.be.true;
    expect(res).to.be.an.equalResultTo(Result.csucc(
      new StrictParseError(
        new SourcePos("main", 506, 7, 29),
        [
          ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
          ErrorMessage.create(ErrorMessageType.UNEXPECT, "bar"),
          ErrorMessage.create(ErrorMessageType.EXPECT, "baz"),
          ErrorMessage.create(ErrorMessageType.MESSAGE, "qux"),
        ]
      ),
      "val",
      new State(
        new Config({ tabWidth: 4, unicode: true }),
        "rest",
        new SourcePos("main", 516, 8, 30),
        "some"
      )
    ));
  });
});
