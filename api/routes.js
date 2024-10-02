const express = require("express");
const { Service } = require("../services");
const { BadRequestError } = require("../utils/errors");
const authMiddleware = require('../middlewares/auth');


const router = express.Router();
const service = new Service();

router.get("/", (req, res) => {
  res.json({ message: "Welcome to the users API" });
});



router.post("/createinterview",authMiddleware, async (req, res) => {
  const {jobdescription, interviewtype, difficulty, jobfield, status } = req.body;

  
  const userid=req.userId;
  const data = await service.createinterview(userid, jobdescription, interviewtype, difficulty, jobfield, status);
  return res.json(data);
});


module.exports = router;



