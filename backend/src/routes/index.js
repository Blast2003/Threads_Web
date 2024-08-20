import messageRouter from "./messageRouter.js"
import postRouter from "./postRouter.js"
import userRouter from "./userRouter.js"

export const router = (app) =>{
    app.use("/api/user", userRouter)
    app.use("/api/post", postRouter)
    app.use("/api/message", messageRouter)
}