function notFoundHandler(req, res, next) {
  console.warn('Not found', req.originalUrl);
  res.status(404).json({ error: 'Not found' });
}

function errorHandler(err, req, res, next) {
  console.error(err);

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid json' });
  }

  return res.status(500).json({ success: false, error: 'Internal server error' });
}

function groupBy(xs, key) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

function groupByArray(xs, key) {
  return xs.reduce(function (rv, x) {
    let v = key instanceof Function ? key(x) : x[key]; let el = rv.find((r) => r && r.key === v);
    if (el) {
      el.values.push(x);
    }
    else {
      rv.push({ key: v, values: [x] });
    }
    return rv;
  }, []);
}

module.exports = {
  notFoundHandler,
  errorHandler,
  groupByArray,
  groupBy
}