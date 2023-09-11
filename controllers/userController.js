const asyncHandler=require("express-async-handler");
const User=require("../models/userModel");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");

//async handler se try catch vgera nahi likhna pdega
//@desc Register the user
//@route POST/api/contacts
//@access public 

const registerUser=asyncHandler(async(req,res)=>{
    //destructure krlege values jo user provide krega
    const {username,email,password}=req.body;

    if(!username || !email || !password){
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const userAvailable =await User.findOne({email});
    if(userAvailable){
        res.status(400);
        throw new Error("User Already Registered");
    }
    //password hash krna pdega using bcrypt lib as user raw password dega

    //hash password
    //promise return krega ye esleye await use kroo
    const hashedword=await bcrypt.hash(password,10);
    const user= await User.create({
        username,
        email,
        password:hashedword,
    });
    console.log(`User Created ${user}`);
    if(user){
        res.status(201).json({_id:user.id,email:user.email});
    }
    else{
res.status(400)
throw new Error("user data not valid");
    }

    //user ko nahi bhej skte to show coz it ll contain hashedpassword as well and security risk rhega

    res.json({message:"Register The USer"});
});


//async handler se try catch vgera nahi likhna pdega
//@desc login the user
//@route POST/api/contacts
//@access public 

const loginUser=asyncHandler(async(req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        res.status(400);
        throw new Error("All fields are mandatory")
    }
    const user=await User.findOne({email});

    //compare password with hashed password

    if(user && (await bcrypt.compare(password,user.password)) ){
        const accessToken=jwt.sign({
            //payload in jwt
            user:{
                username:user.username,
                email:user.email,
                id:user.id,
            },
        },process.env.ACCESS_TOKEN_SECRET,{expiresIn:"20m"});
        res.status(200).json({accessToken});
    }
    else{
        res.status(401);
        throw new Error("Invalid Credentials");
    }
});

//async handler se try catch vgera nahi likhna pdega
//@desc Get the user info
//@route GET/api/contacts
//@access private 

const currentUser=asyncHandler(async(req,res)=>{
    //validate token me decoded se tune value set krdi thii req.user me 
    res.json(req.user);
});

module.exports={registerUser,loginUser,currentUser}