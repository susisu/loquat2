/*
 * loquat-core test / error.AbstractParseError#toString()
 * copyright (c) 2016 Susisu
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const AbstractParseError = _error.AbstractParseError;

describe("#toString()", () => {
    it("should throw an `Error'", () => {
        let TestParseError = class extends AbstractParseError {
            constructor() {
                super();
            }
        };
        let err = new TestParseError();
        expect(() => { err.toString(); }).to.throw(Error);
    });
});
