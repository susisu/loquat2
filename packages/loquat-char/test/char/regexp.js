"use strict";

const { expect } = require("chai");

const {
  show,
  SourcePos,
  ErrorMessageType,
  ErrorMessage,
  ParseError,
  StrictParseError,
  Config,
  State,
  Result,
} = _core;

const { regexp } = _char;

describe(".regexp(re, groupId = 0)", () => {
  it("should return a parser that parses characters that regular expression `re' matches,"
        + " and returns sequence specified by `groupId'", () => {
    // empty match
    {
      const initState = new State(
        new Config({ unicode: false }),
        "XYZ",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const parser = regexp(new RegExp(""), 0);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.esucc(
          ParseError.unknown(new SourcePos("foobar", 1, 1)),
          "",
          new State(
            new Config({ unicode: false }),
            "XYZ",
            new SourcePos("foobar", 1, 1),
            "none"
          )
        )
      )).to.be.true;
    }
    // many match
    {
      const initState = new State(
        new Config({ unicode: false }),
        "XYZ",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const parser = regexp(/.{2}/, 0);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          ParseError.unknown(new SourcePos("foobar", 1, 3)),
          "XY",
          new State(
            new Config({ unicode: false }),
            "Z",
            new SourcePos("foobar", 1, 3),
            "none"
          )
        )
      )).to.be.true;
    }
    // use default groupId = 0
    {
      const initState = new State(
        new Config({ unicode: false }),
        "XYZ",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const parser = regexp(/.{2}/);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          ParseError.unknown(new SourcePos("foobar", 1, 3)),
          "XY",
          new State(
            new Config({ unicode: false }),
            "Z",
            new SourcePos("foobar", 1, 3),
            "none"
          )
        )
      )).to.be.true;
    }
    // specify groupId
    {
      const initState = new State(
        new Config({ unicode: false }),
        "XYZ",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const parser = regexp(/.(.)/, 1);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          ParseError.unknown(new SourcePos("foobar", 1, 3)),
          "Y",
          new State(
            new Config({ unicode: false }),
            "Z",
            new SourcePos("foobar", 1, 3),
            "none"
          )
        )
      )).to.be.true;
    }
    // doesn't match
    {
      const initState = new State(
        new Config({ unicode: false }),
        "XYZ",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const parser = regexp(/abc/, 0);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.efail(
          new StrictParseError(
            new SourcePos("foobar", 1, 1),
            [ErrorMessage.create(ErrorMessageType.EXPECT, show(/abc/))]
          )
        )
      )).to.be.true;
    }
  });

  it("should ignore case if `i' flag is used", () => {
    // not used
    {
      const initState = new State(
        new Config({ unicode: false }),
        "XYZ",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const parser = regexp(/xy/, 0);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.efail(
          new StrictParseError(
            new SourcePos("foobar", 1, 1),
            [ErrorMessage.create(ErrorMessageType.EXPECT, show(/xy/))]
          )
        )
      )).to.be.true;
    }
    // used
    {
      const initState = new State(
        new Config({ unicode: false }),
        "XYZ",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const parser = regexp(/xy/i, 0);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          ParseError.unknown(new SourcePos("foobar", 1, 3)),
          "XY",
          new State(
            new Config({ unicode: false }),
            "Z",
            new SourcePos("foobar", 1, 3),
            "none"
          )
        )
      )).to.be.true;
    }
  });

  it("should match `$' at end of any line if `m' flag is used", () => {
    // not used
    {
      const initState = new State(
        new Config({ unicode: false }),
        "XY\nZ",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const parser = regexp(/XY$/, 0);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.efail(
          new StrictParseError(
            new SourcePos("foobar", 1, 1),
            [ErrorMessage.create(ErrorMessageType.EXPECT, show(/XY$/))]
          )
        )
      )).to.be.true;
    }
    // used
    {
      const initState = new State(
        new Config({ unicode: false }),
        "XY\nZ",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const parser = regexp(/XY$/m, 0);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          ParseError.unknown(new SourcePos("foobar", 1, 3)),
          "XY",
          new State(
            new Config({ unicode: false }),
            "\nZ",
            new SourcePos("foobar", 1, 3),
            "none"
          )
        )
      )).to.be.true;
    }
  });

  it("(Node.js >= 6.0.0) should enables unicode features if `u' flag is used", () => {
    // not used
    {
      const initState = new State(
        new Config({ unicode: true }),
        "\uD83C\uDF63XYZ",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const parser = regexp(/./, 0);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          ParseError.unknown(new SourcePos("foobar", 1, 2)),
          "\uD83C",
          new State(
            new Config({ unicode: true }),
            "\uDF63XYZ",
            new SourcePos("foobar", 1, 2),
            "none"
          )
        )
      )).to.be.true;
    }
    {
      const initState = new State(
        new Config({ unicode: true }),
        "\uD83C\uDF63XYZ",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const parser = regexp(/\u{1F363}/, 0);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.efail(
          new StrictParseError(
            new SourcePos("foobar", 1, 1),
            [ErrorMessage.create(ErrorMessageType.EXPECT, show(/\u{1F363}/))]
          )
        )
      )).to.be.true;
    }
    // used
    {
      const initState = new State(
        new Config({ unicode: true }),
        "\uD83C\uDF63XYZ",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const parser = regexp(/./u, 0);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          ParseError.unknown(new SourcePos("foobar", 1, 2)),
          "\uD83C\uDF63",
          new State(
            new Config({ unicode: true }),
            "XYZ",
            new SourcePos("foobar", 1, 2),
            "none"
          )
        )
      )).to.be.true;
    }
    {
      const initState = new State(
        new Config({ unicode: true }),
        "\uD83C\uDF63XYZ",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const parser = regexp(/\u{1F363}/u, 0);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          ParseError.unknown(new SourcePos("foobar", 1, 2)),
          "\uD83C\uDF63",
          new State(
            new Config({ unicode: true }),
            "XYZ",
            new SourcePos("foobar", 1, 2),
            "none"
          )
        )
      )).to.be.true;
    }
  });

  it("should throw an `Error' if input is not a string", () => {
    // Array
    {
      const initState = new State(
        new Config({ unicode: true }),
        ["X", "Y", "Z"],
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const parser = regexp(/./, 0);
      expect(parser).to.be.a.parser;
      expect(() => { parser.run(initState); }).to.throw(Error, /regexp/);
    }
    // IStream
    {
      const initState = new State(
        new Config({ unicode: true }),
        { uncons: () => ({ empty: true }) },
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const parser = regexp(/./, 0);
      expect(parser).to.be.a.parser;
      expect(() => { parser.run(initState); }).to.throw(Error, /regexp/);
    }
  });
});
