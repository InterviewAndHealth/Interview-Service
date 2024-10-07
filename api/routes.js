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
  const {jobdescription, interviewtype, difficulty, jobfield} = req.body;

  const status="scheduled";
  
  const userid=req.userId;
  const data = await service.createinterview(userid, jobdescription, interviewtype, difficulty, jobfield, status);
  return res.status(200).json(data);
});


// const { EventService, RPCService } = require("../services/broker");
// router.get("/rpctest",authMiddleware, async (req, res) => {
//   // const {jobdescription, interviewtype, difficulty, jobfield, status } = req.body;

  
//   const userid=req.userId;
//   console.log(userid);
//   const response = await RPCService.request('USERS_RPC', {
//     type: 'GET_USER_RESUME',
//     data:{
//       userId:userid
//     },
//   });
//   console.log(response);
  
//   return res.json(response);
// });



module.exports = router;



