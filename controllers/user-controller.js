import User from '../Schema/User.js';
import bcrypt from 'bcryptjs';

export const getAllUser = async(req, res, next)=>{
    let users;
     try {
         users = await User.find();
     } catch (error) {
        console.log(error);
     }
     if(!users){
      return res.status(404).json({message: "User Not Found"});

     }else{
       return res.status(200).json({users});
     }
}

export const signup = async(req, res, next)=>{
    
        const {name, email, password} = req.body;
        //hashing the password

        

        //validation
        let userExists;

        try {
            userExists = await User.findOne({email});
        } catch (error) {
          return  console.log(error);
            
        }
        if(userExists){
           return res.status(400).json({message: "User already exists! Login instead"})
        }
        const hashPassword = bcrypt.hashSync(password);
        const newUser = new User({
            name,
            email,
            password: hashPassword,
            blogs:[],

        });
        try {
           await newUser.save();
        } catch (error) {
           return console.log(error);
            
        }
        return res.status(201).json({newUser});
     
}

export const login = async(req, res, next)=>{
    const {email, password} = req.body;

    //validation

    let userExists;

        try {
            userExists = await User.findOne({email});
        } catch (error) {
          return  console.log(error);
            
        }
        if(!userExists){
           return res.status(404).json({message: "Could'nt find the user by this userid"})
        }

        const isPasswordCorrect = bcrypt.compareSync(password, userExists.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message: "Invalid Credentials"});
        }else{
            return res.status(200).json({message: "Login Successfull", user: userExists});
        }

}