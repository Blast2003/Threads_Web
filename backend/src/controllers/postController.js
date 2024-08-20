import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";

export const createPost = async(req, res) => {
    try {
        const {postedBy, text} = req.body
        let {img} = req.body // must use let because img is dynamic

        if(!postedBy || !text ) return res.status(400).json({ error: "Postedby and text fields are required"})
        
        const user = await User.findById(postedBy)
        if(!user) return res.status(404).json({ error: "USer not found"})
        
        if(user._id.toString() !== req.user._id.toString()) {
            res.status(401).json({ error: "Unauthorized to create post"}) // create post which is not my account
        }

        const maxLength = 500
        if(text.length > maxLength) {
           return res.status(400).json({ error: `Text must less than ${maxLength} characters`})
        }

        if(img){
            const uploadedResponse = await cloudinary.uploader.upload(img);
            img = uploadedResponse.secure_url;
        }

        const newPost = new Post({
            postedBy: postedBy,
            text: text,
            img: img
        })

        const post = await newPost.save()

        return res.status(201).json(post)

    } catch (error) {
        console.log("Error in Create Post",error.message);
        return res.status(500).json({ error: error.message });
    }
}

export const getPost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		res.status(200).json(post);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const DeletePost = async (req, res) =>{
    const {postId} = req.params 
    try {
        const post = await Post.findById(postId)
        if(!post) return res.status(400).json({ error: "Post not found"})
        
        if(post.postedBy.toString() !== req.user._id.toString()) return res.status(400).json({error: "Unauthorized to delete post"})
        
        //delete image from cloudinary
        if(post.img){ 
            const imgId = post.img.split("/").pop().split(".")[0]
            await cloudinary.uploader.destroy(imgId)
        }

        const deletedPost = await Post.findByIdAndDelete(postId)
        return res.status(200).json({message: "Delete Post Successfully", DeletedPost: deletedPost})
    } catch (error) {
        console.log("Error in Delete Post", error.message)
        return res.status(500).json({ error: `Internal Server Error ${error.message}`})
    }
}

export const likeUnlikePost = async (req, res) => {
	try {
		const { id: postId } = req.params;
		const userId = req.user._id;

		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const userLikedPost = post.likes.includes(userId);

		if (userLikedPost) {
			// Unlike post
			await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
			res.status(200).json({ message: "Post unliked successfully" });
		} else {
			// Like post
			post.likes.push(userId);
			await post.save();
			res.status(200).json({ message: "Post liked successfully" });
		}
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const replyToPost = async (req, res) => {
	try {
		const { text } = req.body;
		const postId = req.params.id;
		const userId = req.user._id;
		const userProfilePic = req.user.profilePic;
		const username = req.user.username;

		if (!text) {
			return res.status(400).json({ error: "Text field is required" });
		}

		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const reply = { userId, text, userProfilePic, username };

		post.replies.push(reply);
		await post.save();

		res.status(200).json(reply);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};


export const getFeedPosts = async (req, res) => {
	try {
		const userId = req.user._id;
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const following = user.following;

		const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({ createdAt: -1 });

		return res.status(200).json(feedPosts);
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
};

export const getUserPosts = async (req, res) => {
	const { username } = req.params;
	try {
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const posts = await Post.find({ postedBy: user._id }).sort({ createdAt: -1 });

		res.status(200).json(posts);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};