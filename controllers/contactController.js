
const asyncHandler=require("express-async-handler");
const Contact=require("../models/contactModel")
//async handler se try catch vgera nahi likhna pdega
//@desc Get all contacts
//@route GET/api/contacts
//@access private 

const getContacts=asyncHandler(async(req,res)=>{
    const contacts= await Contact.find({user_id:req.user.id});
    res.status(200).json(contacts);
});
//@desc create new contacts
//@route POST/api/contacts
//@access private 

const createContact=asyncHandler(async(req,res)=>{
     console.log(req.body);
     //destructure
     const {name,email,phone}=req.body;
     if(!name ||!phone ||!email){
        res.status(400);
        throw new Error("All Fields Are Mandatory");
     }
     const contact=await Contact.create({
        name,email,phone,user_id:req.user.id
        //already destructed 
        //also name=name likhna hai but es6 ka feature hai so ese likhdiya
     });
    res.status(201).json(contact);
});
//@desc Get new contacts
//@route GET/api/contacts/:id
//@access private 

const getContact=asyncHandler(async(req,res)=>{
    const contact=await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact Not Found")
    }
    res.status(200).json(contact);
});
//@desc Update  contacts
//@route Update/api/contacts
//@access private 

const updateContact=asyncHandler(async(req,res)=>{
    const contact=await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact Not Found")
    }
    if(contact.user_id.toString()!==req.user.id){
        res.status(403);
        throw new Error("User dont have permission to update other user")
    }
    const updatedContact=await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new:true}
    );
    
    res.status(200).json(updatedContact);
});
//@desc delete contacts
//@route DELETE/api/contacts
//@access public 

const deleteContact=asyncHandler(async(req,res)=>{
    const contact=await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact Not Found")
    }
    if(contact.user_id.toString()!==req.user.id){
        res.status(403);
        throw new Error("User dont have permission to update other user")
    }
   await Contact.deleteOne({_id:req.params.id});
    
    res.status(200).json(contact);
});


module.exports ={getContact,createContact,deleteContact,updateContact,getContacts}