function notFoundHandler(req, res, next) {
  console.warn('Not found', req.originalUrl);
  res.status(404).json({ error: 'Not found' });
}

function errorHandler(err, req, res, next) { 
  console.error(err);

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid json' });
  }

  return res.status(500).json({ success:false,error: 'Internal server error' });
}

module.exports = {
  notFoundHandler,
  errorHandler
}