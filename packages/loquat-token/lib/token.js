/*
 * loquat-token / token.js
 * copyright (c) 2016 Susisu
 */

/**
 * @module token
 */

"use strict";

module.exports = (_core, _prim, _char, _combinators) => {
    function end() {
        return Object.create({
            makeTokenParser
        });
    }

    const lazy = _core.lazy;

    const pure     = _prim.pure;
    const bind     = _prim.bind;
    const then     = _prim.then;
    const mplus    = _prim.mplus;
    const label    = _prim.label;
    const tryParse = _prim.tryParse;
    const skipMany = _prim.skipMany;

    const string    = _char.string;
    const satisfy   = _char.satisfy;
    const oneOf     = _char.oneOf;
    const noneOf    = _char.noneOf;
    const digit     = _char.digit;
    const octDigit  = _char.octDigit;
    const hexDigit  = _char.hexDigit;
    const manyChar1 = _char.manyChar1;

    const between   = _combinators.between;
    const skipMany1 = _combinators.skipMany1;
    const sepBy     = _combinators.sepBy;
    const sepBy1    = _combinators.sepBy1;

    const spaceChars  = new Set(" \f\n\r\t\v");
    const simpleSpace = skipMany1(satisfy(char => spaceChars.has(char)));

    /**
     * @function module:token.makeTokenParser
     * @static
     * @param {module:language.LanguageDef} def
     * @returns {Object}
     */
    function makeTokenParser(def) {
        /*
         * white space
         */
        const whiteSpace = (() => {
            const noOneLineComment = def.commentLine === "" || def.commentLine === undefined;
            const noMultiLineComment = def.commentStart === ""
                || def.commentStart === undefined || def.commentEnd === undefined;
            const oneLineComment = noOneLineComment
                ? undefined
                : then(
                    tryParse(string(def.commentLine)),
                    then(
                        skipMany(satisfy(char => char !== "\n")),
                        pure(undefined)
                    )
                );
            const multiLineComment = noMultiLineComment
                ? undefined
                : (() => {
                    const commentStartEnd = def.commentStart + def.commentEnd;
                    const inCommentMulti = lazy(() => label(
                        mplus(
                            then(
                                tryParse(string(def.commentEnd)),
                                pure(undefined)
                            ),
                            mplus(
                                then(multiLineComment, inCommentMulti),
                                mplus(
                                    then(
                                        skipMany1(noneOf(commentStartEnd)),
                                        inCommentMulti
                                    ),
                                    then(
                                        oneOf(commentStartEnd),
                                        inCommentMulti
                                    )
                                )
                            )
                        ),
                        "end of comment"
                    ));
                    const inCommentSingle = lazy(() => label(
                        mplus(
                            then(
                                tryParse(string(def.commentEnd)),
                                pure(undefined)
                            ),
                            mplus(
                                then(
                                    skipMany1(noneOf(commentStartEnd)),
                                    inCommentSingle
                                ),
                                then(
                                    oneOf(commentStartEnd),
                                    inCommentSingle
                                )
                            )
                        ),
                        "end of comment"
                    ));
                    const inComment = def.nestedComments ? inCommentMulti : inCommentSingle;
                    return then(
                        tryParse(string(def.commentStart)),
                        inComment
                    );
                })();
            return skipMany(label(
                  noOneLineComment && noMultiLineComment ? simpleSpace
                : noOneLineComment                       ? mplus(simpleSpace, multiLineComment)
                : noMultiLineComment                     ? mplus(simpleSpace, oneLineComment)
                : mplus(simpleSpace, mplus(oneLineComment, multiLineComment)),
                ""
            ));
        })();

        function lexeme(parser) {
            return bind(parser, x => then(whiteSpace, pure(x)));
        }

        function symbol(name) {
            return lexeme(string(name));
        }

        /*
         * symbols
         */
        const parens = (() => {
            const lparen = symbol("(");
            const rparen = symbol(")");
            return parser => between(lparen, rparen, parser);
        })();
        const braces = (() => {
            const lbrace = symbol("{");
            const rbrace = symbol("}");
            return parser => between(lbrace, rbrace, parser);
        })();
        const angles = (() => {
            const langle = symbol("<");
            const rangle = symbol(">");
            return parser => between(langle, rangle, parser);
        })();
        const brackets = (() => {
            const lbracket = symbol("[");
            const rbracket = symbol("]");
            return parser => between(lbracket, rbracket, parser);
        })();

        const semi  = symbol(";");
        const comma = symbol(",");
        const colon = symbol(":");
        const dot   = symbol(".");

        function semiSep(parser) {
            return sepBy(parser, semi);
        }

        function semiSep1(parser) {
            return sepBy1(parser, semi);
        }

        function commaSep(parser) {
            return sepBy(parser, comma);
        }

        function commaSep1(parser) {
            return sepBy1(parser, comma);
        }

        /*
         * numbers
         */
        function number(base, baseDigit) {
            return bind(manyChar1(baseDigit), digits => pure(parseInt(digits, base)));
        }

        const decimal     = number(10, digit);
        const hexadecimal = then(oneOf("Xx"), number(16, hexDigit));
        const octal       = then(oneOf("Oo"), number(8, octDigit));

        return {
            whiteSpace,
            lexeme,
            symbol,
            parens,
            braces,
            angles,
            brackets,
            semi,
            comma,
            colon,
            dot,
            semiSep,
            semiSep1,
            commaSep,
            commaSep1,
            decimal,
            hexadecimal,
            octal
        };
    }

    return end();
};