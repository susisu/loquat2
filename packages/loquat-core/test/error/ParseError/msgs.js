"use strict";

const { expect } = require("chai");

const { SourcePos } = _pos;
const { ErrorMessageType, ErrorMessage, ParseError } = _error;

describe("#msgs", () => {
  it("should get messages of the error", () => {
    const pos = new SourcePos("main", 6, 28);
    const msgs = [
      new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
      new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
      new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
      new ErrorMessage(ErrorMessageType.MESSAGE, "qux"),
    ];
    const err = new ParseError(pos, msgs);
    expect(ErrorMessage.messagesEqual(err.msgs, msgs)).to.be.true;
  });
});
