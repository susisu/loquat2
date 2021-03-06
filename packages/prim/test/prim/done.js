"use strict";

const chai = require("chai");
const { expect } = chai;

const {
  SourcePos,
  ErrorMessageType,
  ErrorMessage,
  StrictParseError,
  Config,
  State,
  Result,
  StrictParser,
} = $core;

const { done } = $prim;

describe("done", () => {
  it("should create a parser that returns its result with the context that the current tailrec loop"
    + " should quit", () => {
    const initState = new State(
      new Config(),
      "input",
      new SourcePos("main", 1, 1),
      "none"
    );
    // csucc
    {
      const parser = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(
          new StrictParseError(
            new SourcePos("main", 1, 2),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
          ),
          "foo",
          new State(
            new Config(),
            "rest",
            new SourcePos("main", 1, 2),
            "some"
          )
        );
      });
      const contParser = done(parser);
      expect(contParser).to.be.a.parser;
      const res = contParser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.csucc(
          new StrictParseError(
            new SourcePos("main", 1, 2),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
          ),
          { done: true, value: "foo" },
          new State(
            new Config(),
            "rest",
            new SourcePos("main", 1, 2),
            "some"
          )
        ),
        chai.util.eql
      );
    }
    // cfail
    {
      const parser = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.cfail(
          new StrictParseError(
            new SourcePos("main", 1, 2),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
          )
        );
      });
      const contParser = done(parser);
      expect(contParser).to.be.a.parser;
      const res = contParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
        )
      ));
    }
    // esucc
    {
      const parser = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(
          new StrictParseError(
            new SourcePos("main", 1, 1),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
          ),
          "foo",
          new State(
            new Config(),
            "rest",
            new SourcePos("main", 1, 1),
            "some"
          )
        );
      });
      const contParser = done(parser);
      expect(contParser).to.be.a.parser;
      const res = contParser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.esucc(
          new StrictParseError(
            new SourcePos("main", 1, 1),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
          ),
          { done: true, value: "foo" },
          new State(
            new Config(),
            "rest",
            new SourcePos("main", 1, 1),
            "some"
          )
        ),
        chai.util.eql
      );
    }
    // efail
    {
      const parser = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.efail(
          new StrictParseError(
            new SourcePos("main", 1, 1),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
          )
        );
      });
      const contParser = done(parser);
      expect(contParser).to.be.a.parser;
      const res = contParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        new StrictParseError(
          new SourcePos("main", 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
        )
      ));
    }
  });
});
