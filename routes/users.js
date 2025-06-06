import express from "express";
const router = express.Router();
import User from "../models/user.js"
import {encryptAadhaar,decryptAadhaar,maskAadhaar} from "../utils/index.js"

router.get('/verify-aadhaar/:aadhaar', async(req, res) => {
  const { aadhaar } = req.params;

  const user = await User.find({aadhaar}) 
  
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
  const { name, aadhaar,aadhaarVerified, descriptor } = req.body;

    const { encryptedData, iv } = encryptAadhaar(aadhaar);

  const user = new User({ name, aadhaar:encryptedData,aadhaarIV:iv,aadhaarVerified, descriptor });
  await user.save();
  res.json({status:true, message: 'Registered successfully' });
  
});

router.get('/', async (req, res) => {
  const Users = await User.find(); // each user must have descriptor
  
  const allUsers = Users?.map(item=>{
    const MaskAadhaar = maskAadhaar(decryptAadhaar(item.aadhaar, item.aadhaarIV))
    return {_id:item._id,name:item.name,aadhaar:MaskAadhaar,aadhaarVerified:item.aadhaarVerified,descriptor:item.descriptor,addedBy:item.addedBy,createdAt:item.createdAt}
  })

  res.json({status:true,users:allUsers});
});

export default router;