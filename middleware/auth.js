const jwt = require('jsonwebtoken');
const { logem, getUserFromToken, getTokenFromCookie } = require('../utils');
const { tokenKey } = require('../config');

exports.authenticatedRoute = (req, res, next) => {
  if (!req.cookies || !req.cookies.token) {
    logem('Cookies not set');
    return next({ error: 'login is required', status: 401 });
  }

  jwt.verify(req.cookies.token, tokenKey, function(err, decodedPayload) {
    if (err) {
      console.log(err);
    }
    if (decodedPayload) {
      logem('The payload was decoded OK');
      next();
    } else {
      logem('Something went wrong decoding the payload...');
      logem(decodedPayload);
      next({ error: 'bad token', status: 403 });
    }
  });
};

exports.authorizedRoute = (req, res, next) => {
  if (!req.cookies || !req.cookies.token) {
    logem('Cookies not set');
    return next({ error: 'login is required', status: 401 });
  }

  try {
    const user = getUserFromToken(req.cookies.token);
    if (user.id !== req.params.user_id) {
      next({
        error:
          'The user in cookies does not match the user in the request params.',
        status: 403,
      });
    } else {
      next();
    }
  } catch (err) {
    next({ error: 'error getting user from cookie', status: 400 });
  }
};
