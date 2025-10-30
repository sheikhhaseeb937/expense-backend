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
      password,
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

    // Check if both fields are provided
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
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