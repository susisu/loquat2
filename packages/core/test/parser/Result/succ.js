"use strict";

const { expect } = require("chai");

const { SourcePos } = $pos;
const { ErrorMessageType, ErrorMessage, StrictParseError } = $error;
const { Config, State, Result } = $parser;

describe(".succ", () => {
  it("should create a success result object", () => {
    {
      const res = Result.succ(
        true,
        new StrictParseError(
          new SourcePos("main", 6, 28),
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
          new SourcePos("main", 7, 29),
          "none"
        )
      );
      expect(Result.equal(res, {
        success : true,
        consumed: true,
        err     : new StrictParseError(
          new SourcePos("main", 6, 28),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
            ErrorMessage.create(ErrorMessageType.UNEXPECT, "bar"),
            ErrorMessage.create(ErrorMessageType.EXPECT, "baz"),
            ErrorMessage.create(ErrorMessageType.MESSAGE, "qux"),
          ]
        ),
        val  : "val",
        state: new State(
          new Config({ tabWidth: 4, unicode: true }),
          "rest",
          new SourcePos("main", 7, 29),
          "none"
        ),
      })).to.be.true;
    }
    {
      const res = Result.succ(
        false,
        new StrictParseError(
          new SourcePos("main", 6, 28),
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
          new SourcePos("main", 7, 29),
          "none"
        )
      );
      expect(Result.equal(res, {
        success : true,
        consumed: false,
        err     : new StrictParseError(
          new SourcePos("main", 6, 28),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
            ErrorMessage.create(ErrorMessageType.UNEXPECT, "bar"),
            ErrorMessage.create(ErrorMessageType.EXPECT, "baz"),
            ErrorMessage.create(ErrorMessageType.MESSAGE, "qux"),
          ]
        ),
        val  : "val",
        state: new State(
          new Config({ tabWidth: 4, unicode: true }),
          "rest",
          new SourcePos("main", 7, 29),
          "none"
        ),
      })).to.be.true;
    }
  });
});
