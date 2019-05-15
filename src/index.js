const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const { param, validationResult } = require('express-validator/check');
const helmet = require('helmet');
const request = require('request-promise-native');
const qs = require('querystring');

// Setup express
const api = express();
api.set('trust proxy', 'loopback');
api.use(bodyParser.json());
api.use(cors());
if (process.env.NODE_ENV === 'production') {
  api.use(helmet());
}

// Setup endpoint
api.get(
  '/:id',
  param('id')
    .isLength({ min: 11, max: 11 }),
  (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      res.status(422).end();
      return;
    }
    request(`http://www.youtube.com/get_video_info?video_id=${req.params.id}`)
      .then((body) => {
        const { url_encoded_fmt_stream_map: stream } = qs.parse(body);
        const { url } = qs.parse(stream);
        const sources = url.map(url => url.split(',')[0]);
        res.json(sources);
      })
      .catch(() => (
        res.status(404).end()
      ));
  }
);

// Start server
const server = api.listen(8080, '0.0.0.0');

// Graceful shutdown
const shutdown = () => (
  server.close(() => (
    process.exit(0)
  ))
);
process
  .on('SIGTERM', shutdown)
  .on('SIGINT', shutdown);

module.exports = api;
