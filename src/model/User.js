import mongoose, { Schema } from "mongoose";


const UserSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      
    },
    email: {
      type: String,
      required: true,
   
    },
    password: {
      type: String,
      required: true,
   
    },
    profileImageUrl: {
      type: String,
    
    },
  },
  { timestamps: true }
);


// ✅ Create and export model
const User = mongoose.model("User", UserSchema);
export default User;
