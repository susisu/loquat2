/*
 * loquat-core test / pos.SourcePos#toString()
 * copyright (c) 2016 Susisu
 */

"use strict";

const { expect } = require("chai");

const { SourcePos } = require("pos.js");

describe("#toString()", () => {
    it("should return the string representation of the position", () => {
        // if the position has a name, the string representation contains its name
        {
            let pos = new SourcePos("foobar", 496, 28);
            expect(pos.toString()).to.equal("\"foobar\"(line 496, column 28)");
        }
        // if not, it does not contain name
        {
            let pos = new SourcePos("", 496, 28);
            expect(pos.toString()).to.equal("(line 496, column 28)");
        }
    });
});