const CREATED_CODE = 201;
const BAD_REQUEST_ERROR_CODE = 400;
const NOT_FOUND_ERROR_CODE = 404;
const INTERNAL_SERVER_ERROR_CODE = 500;

const regex = /https?:\/\/w{0,3}\.?[\w0-9-]{1,10}\.\w{2,3}[\w\d\-._~:/?#[\]@!$&'()*+,;=]{0,}/m;

module.exports = {
  CREATED_CODE,
  BAD_REQUEST_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  INTERNAL_SERVER_ERROR_CODE,
  regex,
};

// https?:\/\/w{0,3}\.?[\w0-9-]{1,10}\.\w{1,2}\/?\w{0,10}\/?\w{0,10}\/?\w{0,10}\/?
// /https?:\/\/w{0,3}\.?[\w0-9-]{1,10}\.\w{2,3}[\w\d\-\._~:\/?#\[\]@!$&'()*+,;=]{0,}/gm
