const express=require('express');
const router=express.Router();
const { getContact,createContact,deleteContact,updateContact,getContacts } = require("../controllers/contactController");
const validateToken = require('../middleware/validateTokenHandler');

router.use(validateToken);

router.route('/').get(getContacts).post(createContact)
// router.route('/').post(createContact)
router.route('/:id').put(updateContact).get(getContact).delete(deleteContact)
// router.route('/:id').get(getContact)
// router.route('/:id').delete(deleteContact)

module.exports=router




