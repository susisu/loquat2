"use strict";

const { expect } = require("chai");

const { SourcePos } = _pos;
const { ErrorMessageType, ErrorMessage, StrictParseError } = _error;
const { Config, State, Result, Parser } = _parser;

describe("#parse", () => {
  it("should run the parser with a new state and return result as a simple object", () => {
    // csuc
    {
      const parser = new Parser(state => {
        expect(state).to.be.an.equalStateTo(new State(
          new Config({ tabWidth: 4, unicode: true }),
          "test",
          new SourcePos("main", 1, 1),
          "none"
        ));
        return Result.csuc(
          new StrictParseError(
            new SourcePos("main", 6, 28),
            [
              new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
              new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
              new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
              new ErrorMessage(ErrorMessageType.MESSAGE, "qux"),
            ]
          ),
          "val",
          new State(
            new Config({ tabWidth: 4, unicode: true }),
            "rest",
            new SourcePos("main", 6, 28),
            "some"
          )
        );
      });
      const res = parser.parse("main", "test", "none", { tabWidth: 4, unicode: true });
      expect(res).to.deep.equal({
        success: true,
        value  : "val",
      });
    }
    // cerr
    {
      const parser = new Parser(state => {
        expect(state).to.be.an.equalStateTo(new State(
          new Config({ tabWidth: 4, unicode: true }),
          "test",
          new SourcePos("main", 1, 1),
          "none"
        ));
        return Result.cerr(
          new StrictParseError(
            new SourcePos("main", 6, 28),
            [
              new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
              new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
              new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
              new ErrorMessage(ErrorMessageType.MESSAGE, "qux"),
            ]
          )
        );
      });
      const res = parser.parse("main", "test", "none", { tabWidth: 4, unicode: true });
      expect(res).to.be.an("object");
      expect(res.success).to.be.false;
      expect(res.error).to.be.an.equalErrorTo(new StrictParseError(
        new SourcePos("main", 6, 28),
        [
          new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
          new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
          new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
          new ErrorMessage(ErrorMessageType.MESSAGE, "qux"),
        ]
      ));
    }
    // esuc
    {
      const parser = new Parser(state => {
        expect(state).to.be.an.equalStateTo(new State(
          new Config({ tabWidth: 4, unicode: true }),
          "test",
          new SourcePos("main", 1, 1),
          "none"
        ));
        return Result.esuc(
          new StrictParseError(
            new SourcePos("main", 6, 28),
            [
              new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
              new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
              new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
              new ErrorMessage(ErrorMessageType.MESSAGE, "qux"),
            ]
          ),
          "val",
          new State(
            new Config({ tabWidth: 4, unicode: true }),
            "rest",
            new SourcePos("main", 6, 28),
            "some"
          )
        );
      });
      const res = parser.parse("main", "test", "none", { tabWidth: 4, unicode: true });
      expect(res).to.deep.equal({
        success: true,
        value  : "val",
      });
    }
    // eerr
    {
      const parser = new Parser(state => {
        expect(state).to.be.an.equalStateTo(new State(
          new Config({ tabWidth: 4, unicode: true }),
          "test",
          new SourcePos("main", 1, 1),
          "none"
        ));
        return Result.eerr(
          new StrictParseError(
            new SourcePos("main", 6, 28),
            [
              new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
              new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
              new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
              new ErrorMessage(ErrorMessageType.MESSAGE, "qux"),
            ]
          )
        );
      });
      const res = parser.parse("main", "test", "none", { tabWidth: 4, unicode: true });
      expect(res).to.be.an("object");
      expect(res.success).to.be.false;
      expect(res.error).to.be.an.equalErrorTo(new StrictParseError(
        new SourcePos("main", 6, 28),
        [
          new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
          new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
          new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
          new ErrorMessage(ErrorMessageType.MESSAGE, "qux"),
        ]
      ));
    }
    // use default parameters
    {
      const parser = new Parser(state => {
        expect(state).to.be.an.equalStateTo(new State(
          new Config(),
          "test",
          new SourcePos("main", 1, 1),
          "none"
        ));
        return Result.csuc(
          new StrictParseError(
            new SourcePos("main", 6, 28),
            [
              new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
              new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
              new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
              new ErrorMessage(ErrorMessageType.MESSAGE, "qux"),
            ]
          ),
          "val",
          new State(
            new Config({ tabWidth: 4, unicode: true }),
            "rest",
            new SourcePos("main", 6, 28),
            "some"
          )
        );
      });
      const res = parser.parse("main", "test", "none");
      expect(res).to.deep.equal({
        success: true,
        value  : "val",
      });
    }
  });
});
