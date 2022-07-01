const mysql = require("mysql");



  const express = require("express");
  const PORT = process.env.PORT || "3000";
  const app = express();

  function error(status, msg) {
    var err = new Error(msg);
    err.status = status;
    return err;
  }

  app.use("/api", function (req, res, next) {
    var key = req.query["api-key"];
    if (!key) return next(error(400, "api key required"));
    if (apiKeys.indexOf(key) === -1) return next(error(401, "invalid api key"));
    req.key = key;
    next();
  });

  var apiKeys = ["foo", "bar", "baz"];

  // function doWork() {
  //   console.log("complex work...");
  //   for (let i = 0; i <= Math.floor(Math.random() * 40000000); i += 1) {}
  // }

  app.get("/api/users", async function (req, res) {

    const conn = mysql.createConnection({
      // host: "34.118.120.11",
      socketPath: "/cloudsql/monitorama-demo:europe-central2:monitorama-demo",
      user: "root",
      password: "fzm@NCD3azj5yvk5vhv",
      database: "db",
    });

    // for (let i = 0; i < 100; i += 1) {
    //   doWork();
    // }

    conn.connect();

    conn.query("SELECT * From users;", (err, rows, fields) => {
      if (err) {
        console.log(err);
        throw err;
      } else {
        res.send(rows);
        conn.end;
      }
    });

  });

  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send({ error: err.message });
  });

  app.use(function (req, res) {
    res.status(404);
    res.send({ error: "Sorry, can't find that" });
  });

  app.listen(parseInt(PORT, 10), () => {
    console.log(`Listening for requests on http://localhost:${PORT}`);
  });

function shutdown() {
  sdk
    .shutdown()
    .then(
      () => console.log("shutdown complete"),
      (err) => console.log("error shutting down", err)
    )
    .finally(() => process.exit(0));
}
process.on("beforeExit", shutdown);
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
