import jwt from "jsonwebtoken";
import User from "../model/User.js";

//Gernerate JWT token 
 const  generateToken = (id)=>{
    return jwt.sign({ id}, process.env.JWT_SECRET, { expiresIn: '1h' });
 }

 //Register user 
 export const registerUser =async (req ,res)=>{
     try {
    const { fullName, email, password, profileImageUrl } = req.body;
console.log(req.body);
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }
     

    const user = await User.create({
      fullName,
      email,
      password:hashedPassword,
      profileImageUrl,
    });



    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
      id:user._id,
      token:generateToken(user._id)
 
    });
  } catch (error) {
   console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
 }

  //login user 
 export const loginUser = async(req ,res)=>{
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    // // Check if user exists

 const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid email or password" });
    }



    // Successful login
    res.status(200).json({
      success: true,
      message: "Login successful",
      user,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }


 }

  //User INfo user 
 export const getUserInfo = async(req ,res)=>{
  try {
 
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
 }