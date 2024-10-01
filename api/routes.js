const express = require("express");
const { Service } = require("../services");
const { BadRequestError } = require("../utils/errors");
const authMiddleware = require('../middlewares/auth');


const router = express.Router();
const service = new Service();

router.get("/", (req, res) => {
  res.json({ message: "Welcome to the users API" });
});

// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password)
//     throw new BadRequestError("Email and password are required");

//   const data = await service.login(email, password);
//   return res.header("token", "1234").json(data);
// });

router.post("/createinterview",authMiddleware, async (req, res) => {
  const {jobdescription, interviewtype, difficulty, jobfield, status } = req.body;

  
  const userid=req.userId;
  const data = await service.createinterview(userid, jobdescription, interviewtype, difficulty, jobfield, status);
  return res.json(data);
});

router.get("/rpc", async (req, res) => {
  console.log(req.headers.authorization);
  const data = await service.rpc_test();

  return res.json(data);
});

module.exports = router;



