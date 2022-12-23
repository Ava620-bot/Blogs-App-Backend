import mongoose from 'mongoose';
import Blog from '../Schema/Blog.js';
import User from '../Schema/User.js';

//to get all the blogs present in the database without any filters
export const getAllBlogs = async(req, res, next)=>{
    let blogs;
    try {
        blogs = await Blog.find().populate('user');
    } catch (err) {
        return console.log(err);
    }
    if(!blogs){
        return res.status(404).json({message: "No Blogs Found"});    
    }
    return res.status(200).json({blogs});
}

//add new blog to the database

// export const addBlogs = async(req, res, next)=>{
//     const {title, description, imageUrl, user} = req.body;
    
//     const blog = new Blog({
//         title,
//         description,
//         imageUrl,
//         user,
//         });
     
//         try{
//             await blog.save();
//         } catch (error) {
//             return console.log(error);
//         }
//         return res.status(200).json({blog});
// }

export const addBlogs = async(req, res, next)=>{
    const {title, description, imageUrl, user} = req.body;
    let existingUser;
    //here user contains the user's objectId which was stored in the mongoDb database which help us
    //to find the user which is present in the user collection in db
    //and then storing the new blog for that particular user using session
    try {
        existingUser = await User.findById(user);
    } catch (error) {
        return console.log(error);
    }
    if(!existingUser){
        return res.status(400).json({message: "Unable to find the user by this id"});
    }
    const newBlog = new Blog({
        title,
        description,
        imageUrl, 
        user,
    });
    try {
        //here we are validating the user before storing the new blog
        const session = await mongoose.startSession();
        session.startTransaction();
        await newBlog.save({session});
        existingUser.blogs.push(newBlog);
        await existingUser.save({session});
        await session.commitTransaction();
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: error});
    }
    return res.status(200).json({newBlog});
};

//update blog by getting it through id
export const updateBlogs = async (req, res, next)=>{
    const {title, description} = req.body;
     const blogId = req.params.id;
     let blog;
     try {
        blog = await Blog.findByIdAndUpdate(blogId, {
            title,
            description,
          })
     } catch (error) {
        return console.log(error);
     }
     if(!blog){
        return res.status(400).json({message: "Unable to update the blog"});
     }
     else{
        return res.status(200).json(blog);
     }

     
}

//get blog through id
export const getById = async (req, res, next)=>{
    const id = req.params.id;

    let blog;
    try {
        blog = await Blog.findById(id);
    } catch (error) {
        return console.log(error);
    }
    if(!blog){
        return res.status(404).json({message: "No Blog is found"});
    }
    else{
        return res.status(200).json({blog});
    }
}

//delete blog

export const deleteById = async (req, res, next)=>{
    const id = req.params.id;

    let blog;
    try {
        blog = await Blog.findByIdAndRemove(id).populate('user'); //it will remove the blog as well as gives the reference to the user object
    
        await blog.user.blogs.pull(blog); //this will remove the blog from the user blogs array as well 
        await blog.user.save();
    } catch (error) {
        return console.log(error);

    }
    if(!blog){
        return res.status(404).json({message: "Unable delete the blog"})
    }
    return res.status(200).json({message: "Successfully deleted"});
}

//get the user's blog

export const getUserBlog = async(req, res, next)=>{
    const userId = req.params.id;

    let userBlogs;
    try {
        userBlogs = await User.findById(userId).populate('blogs');

    } catch (error) {
        return console.log(error);
    }
    if(!userBlogs){
        res.status(400).json({message: "No user found with blog"});
    }
    return res.status(200).json({user: userBlogs});


}