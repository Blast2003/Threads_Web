import User from "../models/userModel.js";
import bcrypt from "bcryptjs"
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import Post from "../models/postModel.js"

export const UserSignup = async (req, res) =>{
    try {
        
        const {name, email, username, password} = req.body
        // console.log("name: ", name)
        if(!name || !email || !username || !password){
            return res.status(400).json({
                error: "Please enter all required fields"
            })
        }

        const user = await User.findOne({ $or: [{email}, {username}] })
        if(user){
            return res.status(400).json({error: "User already exists"})
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt)

        const newUser = await User ({
            name,
            email,
            username,
            password: hash
        })

        await newUser.save();

        if(newUser){
            const token = generateTokenAndSetCookie({
                _id: newUser._id,
                username: newUser.username
            }, res)
    
            return res.status(201).json({
                name: newUser.name,
                username: newUser.username,
                email: newUser.email,
                _id: newUser._id,
                bio: newUser.bio,
                profilePic: newUser.profilePic,
                token: token
            })
        } else{
            res.status(400).json({ error: "Invalid user data" });
        }
        


    } catch (error) {
        console.log("Error in User signup",error.message);
        return res.status(500).json({ error: error.message });
    }
}

export const UserLogin = async (req, res) =>{
    try {
        const {username, password} = req.body

        const user = await User.findOne({ username})
        const isCorrectPassword = await bcrypt.compareSync(password, user?.password || "")
        if(!user ||  !isCorrectPassword){
            return res.status(400).json({
                error: "Invalid password or username"
            })
        }

        if(user.isFrozen){
            user.isFrozen = false;
            await user.save();
        }

        const token = generateTokenAndSetCookie({
            _id: user._id,
            username: user.username
        }, res);

        return res.status(200).json({
            name: user.name,
            username: user.username,
            email: user.email,
            _id: user._id,
            bio: user.bio,
            profilePic: user.profilePic,
            token: token
        })

    } catch (error) {
        console.log("Error in User login",error.message);
        return res.status(500).json({ error: error.message });
    }
}


export const UserLogout = async (req, res) =>{
    try {
        res.cookie("jwt-threads", "", {maxAge: 1}); // first approach

        // res.clearCookie("jwt-threads"); => second approach
        return res.status(200).json({
            message: "User logged out successfully"
        })
    } catch (error) {
        console.log("Error in User logout",error.message);
        return res.status(500).json({ error: error.message });
    }
}


export const FollowAndUnFollowUser = async (req, res) =>{
    try {
        const {id} = req.params
        const userToModify = await User.findById(id)
        const currentUser = await User.findById(req.user._id)

        if(id === currentUser._id.toString()) return res.status(400).json({error: "You cannot follow or unfollow yourself"})
        
        if(!userToModify || !currentUser) return res.status(400).json({error: "User not found"})

        const isFollowing = currentUser.following.includes(id);
        if(isFollowing){
            //un-follow ->  check for myself account
            await User.findByIdAndUpdate(req.user._id, {$pull : {following: id}} ) 

            // check for fen account which has been un-followed
            await User.findByIdAndUpdate(id, {$pull : {followers: req.user._id}} ) 

            return res.status(200).json({ message: "User un-followed successfully"})
        }else{
            //follow ->  check for myself account
            await User.findByIdAndUpdate(req.user._id, {$push : {following: id}} ) 

            // check for fen account which has been followed
            await User.findByIdAndUpdate(id, {$push : {followers: req.user._id}} ) 

            return res.status(200).json({ message: "User followed successfully"})
        }

    } catch (error) {
        console.log("Error in User Follow And UnFollow",error.message);
        return res.status(500).json({ error: error.message });
    }
}


export const updateUser = async (req, res) =>{
    const { name, email, username, password, bio } = req.body;
	let { profilePic } = req.body;

	const userId = req.user._id;
	try {
		let user = await User.findById(userId);
		if (!user) return res.status(400).json({ error: "User not found" });

		if (req.params.id !== userId.toString())
			return res.status(400).json({ error: "You cannot update other user's profile" });

		if (password) {
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);
			user.password = hashedPassword;
		}

		if (profilePic) {
			if (user.profilePic) {
				await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0]);
			}

			const uploadedResponse = await cloudinary.uploader.upload(profilePic);
			profilePic = uploadedResponse.secure_url;
		}

		user.name = name || user.name;
		user.email = email || user.email;
		user.username = username || user.username;
		user.profilePic = profilePic || user.profilePic;
		user.bio = bio || user.bio;

		user = await user.save();

        // find all posts that this user replied and update username and userProfilePic fields
        await Post.updateMany(
            {"replies.userId": userId},
            {
                $set:{
                    "replies.$[reply].username": user.username,
                    "replies.$[reply].userProfilePic": user.profilePic
                }
            },
            {arrayFilters: [ {"reply.userId": userId} ]} // option => remark filter through reply.userId
        )

        // password should be null in response
		user.password = null;

		res.status(200).json(user);
    } catch (error) {
        console.log("Error in Update User",error.message);
        return res.status(500).json({ error: error.message });
    }
}

export const getUserProfile = async (req, res) =>{
    // handle with /api/user/:id or :/username
    // query is either username or userid
    const {query} = req.params
    
    try {
        let user
        // query is userId
        if(mongoose.Types.ObjectId.isValid(query)){
            user = await User.findOne({_id: query}).select("-password").select("-updatedAt")
        } else{
            //query is username
            user = await User.findOne({username: query}).select("-password").select("-updatedAt")
        }

        if(!user) return res.status(400).json({ error: "User not found"})
        
        return res.status(200).json(user)


    } catch (error) {
        console.log("Error in Get User Profile",error.message);
        return res.status(500).json({ error: error.message });
    }
}

export const getSuggestedUsers = async (req, res) => {
    try {
        //exclude or remove the current user from suggested users array, and user we already follow
        const userId = req.user._id;

        const userFollowedByYou = await User.findById(userId).select("following");

        const users = await User.aggregate([
            {
                $match:{
                    _id: {$ne:userId},  
                }
            },
            {
                $sample:{size: 10}
            }
            
        ]);

        // get random number of users => filter and remove (exclude) the user who we're following
        const filterUsers = users.filter(user => !userFollowedByYou.following.includes(user._id))

        // get 4 users
        const suggestedUsers = filterUsers.slice(0,4)

        res.status(200).json(suggestedUsers);


    } catch (error) {
        console.log("Error in Get Suggested Users",error.message);
        return res.status(500).json({ error: error.message });
    }
}

export const freezeAccount = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if(!user){
            return res.status(400).json({error: 'User not found'});
        }

        user.isFrozen = true;
        await user.save();

        res.status(200).json({success: true})
    } catch (error) {
        console.log("Error in Freeze User Account",error.message);
        res.status(500).json({ error: error.message });
    }
}