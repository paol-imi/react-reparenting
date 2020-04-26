'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./react-reparenting.cjs.production.min.js');
} else {
  module.exports = require('./react-reparenting.cjs.development.js');
}
