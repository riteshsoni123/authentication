const jwt = require("jsonwebtoken");
const { modelNames } = require("mongoose");
const JWT_SECRET = "riteshkumarsoni";

const fetchuser = (req, res, next) => {
  //Get the user from the jwt token and add id to req object
  const token = req.header("auth-token");
  // console.log(token);
  if (!token) {
    res.status(401).send({ error: "Please authenticate using a valid token" });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch {
    res.status(401).send({ error: "Please authenticate using a valid token" });
  }
};

module.exports = fetchuser;
