import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

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

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};


const User = mongoose.model("User", UserSchema);
export default User;
