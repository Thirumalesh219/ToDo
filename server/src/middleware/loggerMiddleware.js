function logger(req, res, next) {
  const start = process.hrtime.bigint();

  res.on("finish", () => {
    const latency = Number(process.hrtime.bigint() - start) / 1_000_000;

    console.log(
      `[${new Date().toLocaleString()}] ${req.method} ${req.originalUrl} ${res.statusCode} ${latency.toFixed(2)}ms`
    );
  });

  next();
}

module.exports = logger;