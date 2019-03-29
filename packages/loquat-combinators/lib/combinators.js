"use strict";

module.exports = (_core, { _prim }) => {
  const { show, ParseError, Result, StrictParser } = _core;

  const {
    map,
    pure,
    bind,
    then,
    mzero,
    mplus,
    label,
    unexpected,
    tryParse,
    many,
    skipMany,
    tokenPrim,
  } = _prim;

  /**
   * choice: [S, U, A](parsers: Array[Parser[S, U, A]]) => Parser[S, U, A]
   */
  function choice(parsers) {
    return parsers.reduceRight((accum, parser) => mplus(parser, accum), mzero);
  }

  /**
   * option: [S, U, A, B](val: A, parser: Parser[S, U, B]) => Parser[S, U, A \/ B]
   */
  function option(val, parser) {
    return mplus(parser, pure(val));
  }

  /**
   * type Option[A] = { empty: true } \/ { empty: false, value: A }
   */

  /**
   * optionMaybe: [S, U, A](parser: Parser[S, U, A]) => Parser[S, U, Option[A]]
   */
  function optionMaybe(parser) {
    return mplus(
      map(parser, val => ({ empty: false, value: val })),
      map(pure(undefined), () => ({ empty: true }))
    );
  }

  /**
   * optional: [S, U, A](parser: Parser[S, U, A]) => Parser[S, U, undefined]
   */
  function optional(parser) {
    return mplus(then(parser, pure(undefined)), pure(undefined));
  }

  /**
   * between: [S, U, Open, Close, A](
   *   open: Parser[S, U, Open],
   *   close: Parser[S, U, Close],
   *   parser: Parser[S, U, A]
   * ) => Parser[S, U, A]
   */
  function between(open, close, parser) {
    return then(
      open,
      bind(parser, val =>
        then(
          close,
          pure(val)
        )
      )
    );
  }

  /**
   * many1: [S, U, A](parser: Parser[S, U, A]) => Parser[S, U, Array[A]]
   */
  function many1(parser) {
    return bind(parser, head =>
      bind(many(parser), tail =>
        pure([head].concat(tail))
      )
    );
  }

  /**
   * skipMany1: [S, U, A](parser: Parser[S, U, A]) => Parser[S, U, undefined]
   */
  function skipMany1(parser) {
    return then(parser, skipMany(parser));
  }

  /**
   * sepBy: [S, U, A, Sep](
   *   parser: Parser[S, U, A],
   *   sep: Parser[S, U, Sep]
   * ) => Parser[S, U, Array[A]]
   */
  function sepBy(parser, sep) {
    return mplus(
      sepBy1(parser, sep),
      map(pure(undefined), x => [])
    );
  }

  /**
     * @function module:combinators.sepBy1
     * @static
     * @param {AbstractParser} parser
     * @param {AbstractParser} sep
     * @returns {AbstractParser}
     */
  function sepBy1(parser, sep) {
    return bind(parser, head =>
      bind(many(then(sep, parser)), tail =>
        pure([head].concat(tail))
      )
    );
  }

  /**
     * @function module:combinators.sepEndBy
     * @static
     * @param {AbstractParser} parser
     * @param {AbstractParser} sep
     * @returns {AbstractParser}
     */
  function sepEndBy(parser, sep) {
    return new StrictParser(state => {
      const accum = [];
      let currentState = state;
      let currentErr = ParseError.unknown(state.pos);
      let consumed = false;
      while (true) {
        const res = parser.run(currentState);
        if (res.success) {
          if (res.consumed) {
            consumed = true;
            accum.push(res.val);
            currentState = res.state;
            currentErr = res.err;
          } else {
            accum.push(res.val);
            currentState = res.state;
            currentErr = ParseError.merge(currentErr, res.err);
          }
        } else {
          if (res.consumed) {
            return res;
          } else {
            return consumed
              ? Result.csucc(ParseError.merge(currentErr, res.err), accum, currentState)
              : Result.esucc(ParseError.merge(currentErr, res.err), accum, currentState);
          }
        }
        const sepRes = sep.run(currentState);
        if (sepRes.success) {
          if (sepRes.consumed) {
            consumed = true;
            currentState = sepRes.state;
            currentErr = sepRes.err;
          } else {
            currentState = sepRes.state;
            currentErr = ParseError.merge(currentErr, sepRes.err);
          }
        } else {
          if (sepRes.consumed) {
            return sepRes;
          } else {
            return consumed
              ? Result.csucc(ParseError.merge(currentErr, sepRes.err), accum, currentState)
              : Result.esucc(ParseError.merge(currentErr, sepRes.err), accum, currentState);
          }
        }
      }
    });
  }

  /**
     * @function module:combinators.sepEndBy1
     * @static
     * @param {AbstractParser} parser
     * @param {AbstractParser} sep
     * @returns {AbstractParser}
     */
  function sepEndBy1(parser, sep) {
    return bind(parser, head =>
      mplus(
        then(sep,
          bind(sepEndBy(parser, sep), tail =>
            pure([head].concat(tail))
          )
        ),
        pure([head])
      )
    );
  }

  /**
     * @function module:combinators.endBy
     * @static
     * @param {AbstractParser} parser
     * @param {AbstractParser} sep
     * @returns {AbstractParser}
     */
  function endBy(parser, sep) {
    return many(
      bind(parser, val =>
        then(sep, pure(val))
      )
    );
  }

  /**
     * @function module:combinators.endBy1
     * @static
     * @param {AbstractParser} parser
     * @param {AbstractParser} sep
     * @returns {AbstractParser}
     */
  function endBy1(parser, sep) {
    return many1(
      bind(parser, val =>
        then(sep, pure(val))
      )
    );
  }

  /**
     * @function module:combinators.count
     * @static
     * @param {number} num
     * @param {AbstractParser} parser
     * @returns {AbstractParser}
     */
  function count(num, parser) {
    if (num <= 0) {
      return map(pure(undefined), () => []);
    } else {
      return new StrictParser(state => {
        const accum = [];
        let currentState = state;
        let currentErr = ParseError.unknown(state.pos);
        let consumed = false;
        for (let i = 0; i < num; i++) {
          const res = parser.run(currentState);
          if (res.success) {
            if (res.consumed) {
              consumed = true;
              accum.push(res.val);
              currentState = res.state;
              currentErr = res.err;
            } else {
              accum.push(res.val);
              currentState = res.state;
              currentErr = ParseError.merge(currentErr, res.err);
            }
          } else {
            if (res.consumed) {
              return res;
            } else {
              return consumed
                ? Result.cfail(ParseError.merge(currentErr, res.err))
                : Result.efail(ParseError.merge(currentErr, res.err));
            }
          }
        }
        return consumed
          ? Result.csucc(currentErr, accum, currentState)
          : Result.esucc(currentErr, accum, currentState);
      });
    }
  }

  /**
     * @function module:combinators.chainl
     * @static
     * @param {AbstractParser} term
     * @param {AbstractParser} op
     * @param {*} defaultVal
     * @returns {AbstractParser}
     */
  function chainl(term, op, defaultVal) {
    return mplus(
      chainl1(term, op),
      pure(defaultVal)
    );
  }

  /**
     * @function module:combinators.chainl1
     * @static
     * @param {AbstractParser} term
     * @param {AbstractParser} op
     * @returns {AbstractParser}
     */
  function chainl1(term, op) {
    return new StrictParser(state => {
      let currentVal;
      let currentState = state;
      let currentErr = ParseError.unknown(state.pos);
      let consumed = false;

      const headRes = term.run(currentState);
      if (headRes.success) {
        if (headRes.consumed) {
          consumed = true;
          currentVal = headRes.val;
          currentState = headRes.state;
          currentErr = ParseError.merge(currentErr, headRes.err);
        } else {
          currentVal = headRes.val;
          currentState = headRes.state;
          currentErr = ParseError.merge(currentErr, headRes.err);
        }
      } else {
        return headRes.consumed
          ? headRes
          : Result.efail(ParseError.merge(currentErr, headRes.err));
      }

      while (true) {
        const initState = currentState;

        const opRes = op.run(currentState);
        let operation;
        if (opRes.success) {
          if (opRes.consumed) {
            consumed = true;
            operation = opRes.val;
            currentState = opRes.state;
            currentErr = opRes.err;
          } else {
            operation = opRes.val;
            currentState = opRes.state;
            currentErr = ParseError.merge(currentErr, opRes.err);
          }
        } else {
          if (opRes.consumed) {
            return opRes;
          } else {
            return consumed
              ? Result.csucc(ParseError.merge(currentErr, opRes.err), currentVal, initState)
              : Result.esucc(ParseError.merge(currentErr, opRes.err), currentVal, initState);
          }
        }

        const termRes = term.run(currentState);
        if (termRes.success) {
          if (termRes.consumed) {
            consumed = true;
            currentVal = operation(currentVal, termRes.val);
            currentState = termRes.state;
            currentErr = termRes.err;
          } else {
            currentVal = operation(currentVal, termRes.val);
            currentState = termRes.state;
            currentErr = ParseError.merge(currentErr, termRes.err);
          }
        } else {
          if (termRes.consumed) {
            return termRes;
          } else {
            if (opRes.consumed) {
              return Result.cfail(ParseError.merge(currentErr, termRes.err));
            } else {
              return consumed
                ? Result.csucc(ParseError.merge(currentErr, termRes.err), currentVal, initState)
                : Result.esucc(ParseError.merge(currentErr, termRes.err), currentVal, initState);
            }
          }
        }
      }
    });
  }

  /**
     * @function module:combinators.chainr
     * @static
     * @param {AbstractParser} term
     * @param {AbstractParser} op
     * @param {*} defaultVal
     * @returns {AbstractParser}
     */
  function chainr(term, op, defaultVal) {
    return mplus(
      chainr1(term, op),
      pure(defaultVal)
    );
  }

  /**
     * @function module:combinators.chainr1
     * @static
     * @param {AbstractParser} term
     * @param {AbstractParser} op
     * @returns {AbstractParser}
     */
  function chainr1(term, op) {
    return new StrictParser(state => {
      let resultVal;
      let currentState = state;
      let currentErr = ParseError.unknown(state.pos);
      let consumed = false;

      const headRes = term.run(currentState);
      if (headRes.success) {
        if (headRes.consumed) {
          consumed = true;
          resultVal = headRes.val;
          currentState = headRes.state;
          currentErr = headRes.err;
        } else {
          resultVal = headRes.val;
          currentState = headRes.state;
          currentErr = ParseError.merge(currentErr, headRes.err);
        }
      } else {
        return headRes.consumed
          ? headRes
          : Result.efail(ParseError.merge(currentErr, headRes.err));
      }

      const accum = [];
      const operations = [];
      while (true) {
        const initState = currentState;

        const opRes = op.run(currentState);
        if (opRes.success) {
          if (opRes.consumed) {
            consumed = true;
            operations.push(opRes.val);
            currentState = opRes.state;
            currentErr = opRes.err;
          } else {
            operations.push(opRes.val);
            currentState = opRes.state;
            currentErr = ParseError.merge(currentErr, opRes.err);
          }
        } else {
          if (opRes.consumed) {
            return opRes;
          } else {
            if (accum.length > 0) {
              let currentVal = accum[accum.length - 1];
              for (let i = accum.length - 2; i >= 0; i--) {
                currentVal = operations[i + 1](accum[i], currentVal);
              }
              resultVal = operations[0](resultVal, currentVal);
            }
            return consumed
              ? Result.csucc(ParseError.merge(currentErr, opRes.err), resultVal, initState)
              : Result.esucc(ParseError.merge(currentErr, opRes.err), resultVal, initState);
          }
        }

        const termRes = term.run(currentState);
        if (termRes.success) {
          if (termRes.consumed) {
            consumed = true;
            accum.push(termRes.val);
            currentState = termRes.state;
            currentErr = termRes.err;
          } else {
            accum.push(termRes.val);
            currentState = termRes.state;
            currentErr = ParseError.merge(currentErr, termRes.err);
          }
        } else {
          if (termRes.consumed) {
            return termRes;
          } else {
            if (opRes.consumed) {
              return Result.cfail(ParseError.merge(currentErr, termRes.err));
            } else {
              if (accum.length > 0) {
                let currentVal = accum[accum.length - 1];
                for (let i = accum.length - 2; i >= 0; i--) {
                  currentVal = operations[i + 1](accum[i], currentVal);
                }
                resultVal = operations[0](resultVal, currentVal);
              }
              return consumed
                ? Result.csucc(ParseError.merge(currentErr, termRes.err), resultVal, initState)
                : Result.esucc(ParseError.merge(currentErr, termRes.err), resultVal, initState);
            }
          }
        }
      }
    });
  }

  /**
     * @constant module:combinators.anyToken
     * @static
     * @type {AbstractParser}
     */
  const anyToken = tokenPrim(
    token => ({ empty: false, value: token }),
    show,
    pos => pos
  );

  /**
     * @function module:combinators.notFollowedBy
     * @static
     * @param {AbstractParser} parser
     * @returns {AbstractParser}
     */
  function notFollowedBy(parser) {
    const modParser = new StrictParser(state => {
      const res = parser.run(state);
      if (res.consumed && !res.success) {
        return Result.efail(res.err);
      } else if (!res.consumed && res.success) {
        return Result.csucc(res.err, res.val, res.state);
      } else {
        return res;
      }
    });
    return tryParse(
      mplus(
        bind(modParser, val => unexpected(show(val))),
        pure(undefined)
      )
    );
  }

  /**
     * @constant module:combinators.eof
     * @static
     * @type {AbstractParser}
     */
  const eof = label(notFollowedBy(anyToken), "end of input");

  /**
     * @function module:combinators.reduceManyTill
     * @static
     * @param {AbstractParser} parser
     * @param {AbstractParser} end
     * @param {function} callback
     * @param {*} initVal
     * @returns {AbstractParser}
     */
  function reduceManyTill(parser, end, callback, initVal) {
    return new StrictParser(state => {
      let accum = initVal;
      let currentState = state;
      let currentErr = ParseError.unknown(state.pos);
      let consumed = false;
      while (true) {
        const endRes = end.run(currentState);
        if (endRes.success) {
          if (endRes.consumed) {
            return Result.csucc(endRes.err, accum, endRes.state);
          } else {
            return consumed
              ? Result.csucc(ParseError.merge(currentErr, endRes.err), accum, endRes.state)
              : Result.esucc(ParseError.merge(currentErr, endRes.err), accum, endRes.state);
          }
        } else {
          if (endRes.consumed) {
            return endRes;
          } else {
            currentErr = ParseError.merge(currentErr, endRes.err);
          }
        }

        const res = parser.run(currentState);
        if (res.success) {
          if (res.consumed) {
            consumed = true;
            accum = callback(accum, res.val);
            currentState = res.state;
            currentErr = res.err;
          } else {
            accum = callback(accum, res.val);
            currentState = res.state;
            currentErr = ParseError.merge(currentErr, res.err);
          }
        } else {
          if (res.consumed) {
            return res;
          } else {
            return consumed
              ? Result.cfail(ParseError.merge(currentErr, res.err))
              : Result.efail(ParseError.merge(currentErr, res.err));
          }
        }
      }
    });
  }

  /**
     * @function module:combinators.manyTill
     * @static
     * @param {AbstractParser} parser
     * @param {AbstractParser} end
     * @returns {AbstractParser}
     */
  function manyTill(parser, end) {
    return new StrictParser(state => {
      const accum = [];
      let currentState = state;
      let currentErr = ParseError.unknown(state.pos);
      let consumed = false;
      while (true) {
        const endRes = end.run(currentState);
        if (endRes.success) {
          if (endRes.consumed) {
            return Result.csucc(endRes.err, accum, endRes.state);
          } else {
            return consumed
              ? Result.csucc(ParseError.merge(currentErr, endRes.err), accum, endRes.state)
              : Result.esucc(ParseError.merge(currentErr, endRes.err), accum, endRes.state);
          }
        } else {
          if (endRes.consumed) {
            return endRes;
          } else {
            currentErr = ParseError.merge(currentErr, endRes.err);
          }
        }

        const res = parser.run(currentState);
        if (res.success) {
          if (res.consumed) {
            consumed = true;
            accum.push(res.val);
            currentState = res.state;
            currentErr = res.err;
          } else {
            accum.push(res.val);
            currentState = res.state;
            currentErr = ParseError.merge(currentErr, res.err);
          }
        } else {
          if (res.consumed) {
            return res;
          } else {
            return consumed
              ? Result.cfail(ParseError.merge(currentErr, res.err))
              : Result.efail(ParseError.merge(currentErr, res.err));
          }
        }
      }
    });
  }

  /**
     * @function module:combinators.skipManyTill
     * @static
     * @param {AbstractParser} parser
     * @param {AbstractParser} end
     * @returns {AbstractParser}
     */
  function skipManyTill(parser, end) {
    return reduceManyTill(parser, end, accum => accum, undefined);
  }

  return Object.freeze({
    choice,
    option,
    optionMaybe,
    optional,
    between,
    many1,
    skipMany1,
    sepBy,
    sepBy1,
    sepEndBy,
    sepEndBy1,
    endBy,
    endBy1,
    count,
    chainl,
    chainl1,
    chainr,
    chainr1,
    anyToken,
    notFollowedBy,
    eof,
    reduceManyTill,
    manyTill,
    skipManyTill,
  });
};
