/*
 * @loquat/simple
 *
 * Copyright 2019 Susisu
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

"use strict";

const $core        = require("@loquat/core")();
const $prim        = require("@loquat/prim")($core, { sugar: true });
const $char        = require("@loquat/char")($core, { sugar: true });
const $combinators = require("@loquat/combinators")($core, { sugar: true });
const $monad       = require("@loquat/monad")($core, { sugar: true });
const $expr        = require("@loquat/expr")($core);
const $qo          = require("@loquat/qo")($core);
const $token       = require("@loquat/token")($core);

const $loquat = Object.assign({},
  $core,
  $prim,
  $char,
  $combinators,
  $monad,
  $expr,
  $qo,
  $token
);
delete $loquat.isParser;
delete $loquat.extendParser;
delete $loquat.ArrayStream;
Object.freeze($loquat);

module.exports = $loquat;
