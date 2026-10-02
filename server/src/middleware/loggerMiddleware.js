function logger(req, res, next) {
  const start = process.hrtime.bigint();

  res.on("finish", () => {
    const latency = Number(process.hrtime.bigint() - start) / 1_000_000;

    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} ${latency.toFixed(0)}ms`
    );
  });

  next();
}

module.exports = logger;