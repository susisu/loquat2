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
} = $core;

const { LanguageDef } = $language;
const { makeTokenParser } = $token;

describe("symbol", () => {
  it("should create a parser that parses the given string, and skips trailing spaces and"
    + " comments", () => {
    const def = LanguageDef.create({
      commentLine   : "--",
      commentStart  : "{-",
      commentEnd    : "-}",
      nestedComments: true,
    });
    const { symbol } = makeTokenParser(def);
    expect(symbol).to.be.a("function");
    // csucc
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "ABC",
        new SourcePos("main", 1, 1),
        "none"
      );
      const parser = symbol("AB");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        new StrictParseError(
          new SourcePos("main", 1, 3),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("C")),
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("C")),
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("C")),
            ErrorMessage.create(ErrorMessageType.EXPECT, ""),
          ]
        ),
        "AB",
        new State(
          new Config({ tabWidth: 8 }),
          "C",
          new SourcePos("main", 1, 3),
          "none"
        )
      ));
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "AB{- nyan\ncat -}\n \f\r\v{----}\n-- foobar\n\tC",
        new SourcePos("main", 1, 1),
        "none"
      );
      const parser = symbol("AB");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        new StrictParseError(
          new SourcePos("main", 5, 9),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("C")),
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("C")),
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("C")),
            ErrorMessage.create(ErrorMessageType.EXPECT, ""),
          ]
        ),
        "AB",
        new State(
          new Config({ tabWidth: 8 }),
          "C",
          new SourcePos("main", 5, 9),
          "none"
        )
      ));
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "{- nyan\ncat -}\n \f\r\v{----}\n-- foobar\n\tABC",
        new SourcePos("main", 1, 1),
        "none"
      );
      const parser = symbol("");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        new StrictParseError(
          new SourcePos("main", 5, 9),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
            ErrorMessage.create(ErrorMessageType.EXPECT, ""),
          ]
        ),
        "",
        new State(
          new Config({ tabWidth: 8 }),
          "ABC",
          new SourcePos("main", 5, 9),
          "none"
        )
      ));
    }
    // cfail
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "ABC",
        new SourcePos("main", 1, 1),
        "none"
      );
      const parser = symbol("AD");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 1, 1),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("B")),
            ErrorMessage.create(ErrorMessageType.EXPECT, show("AD")),
          ]
        )
      ));
    }
    // esucc
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "ABC",
        new SourcePos("main", 1, 1),
        "none"
      );
      const parser = symbol("");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.esucc(
        new StrictParseError(
          new SourcePos("main", 1, 1),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
            ErrorMessage.create(ErrorMessageType.EXPECT, ""),
          ]
        ),
        "",
        new State(
          new Config({ tabWidth: 8 }),
          "ABC",
          new SourcePos("main", 1, 1),
          "none"
        )
      ));
    }
    // efail
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "ABC",
        new SourcePos("main", 1, 1),
        "none"
      );
      const parser = symbol("DE");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        new StrictParseError(
          new SourcePos("main", 1, 1),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
            ErrorMessage.create(ErrorMessageType.EXPECT, show("DE")),
          ]
        )
      ));
    }
  });
});
