'use strict';

var lazy = require('lazy-cache')(require);
lazy('engine-utils');
lazy('mixin-deep', 'merge');
lazy('object.pick', 'pick');
lazy('ansi-red', 'red');

/**
 * Expose lazily-required module dependencies
 */

module.exports = lazy;
