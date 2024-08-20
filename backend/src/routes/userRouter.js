import express from 'express';
import { UserLogin, UserSignup, UserLogout, FollowAndUnFollowUser, updateUser, getUserProfile, getSuggestedUsers, freezeAccount} from '../controllers/userController.js';
import { protectRoutes } from '../middlewares/protectRoutes.js';

const userRouter = express.Router();

userRouter.get("/profile/:query", getUserProfile)
userRouter.post("/signup", UserSignup)
userRouter.post("/login", UserLogin)
userRouter.post("/logout", UserLogout)
userRouter.post("/follow/:id", protectRoutes ,FollowAndUnFollowUser)
userRouter.put("/update/:id", protectRoutes ,updateUser)

userRouter.get ("/suggested", protectRoutes, getSuggestedUsers)
userRouter.put("/freeze", protectRoutes ,freezeAccount)

export default userRouter
