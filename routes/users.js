import express from "express";
const router = express.Router();
import User from "../models/user.js"

router.get('/verify-aadhaar/:aadhaar', async(req, res) => {
  const { aadhaar } = req.params;

  const user = await User.find({aadhaar}) 
  console.log(user)
  if(user.length > 0){
    return res.json({status:false, message: 'This Aadhaar is already registered. You cannot register again with the same Aadhaar number.' });
  }

  if (/^[0-9]{12}$/.test(aadhaar)) {
    res.json({status:true, message: 'verified' });
  } else {
    res.json({status:false, message: 'invalid' });
  }
});

router.post('/register', async (req, res) => {
  const { name, aadhaar, descriptor } = req.body;

  const user = new User({ name, aadhaar, descriptor });
  await user.save();
  res.json({ message: 'Registered successfully' });
});

router.get('/', async (req, res) => {
  const users = await User.find(); // each user must have descriptor
  res.json({status:true,users});
});

export default router;