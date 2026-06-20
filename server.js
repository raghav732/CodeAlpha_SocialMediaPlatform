const express=require("express");
const path=require("path");
const mongoose=require("mongoose");
const app=express();
const PORT=3000;
app.use(express.json());
app.use(express.static(path.join(__dirname,"public")));
mongoose.connect("mongodb+srv://Raghav:Xcross2007@cluster0.0u6qqko.mongodb.net/socialmedia?retryWrites=true&w=majority&appName=Cluster0")
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));
const UserSchema=new mongoose.Schema({
    name:String,
    email:String,
    password:String
});
const User=mongoose.model("User",UserSchema);

const PostSchema=new mongoose.Schema({
    username:String,
    content:String,
    likes:{
        type:Number,
        default:0
    },
    postDate:{
        type:Date,
        default:Date.now
    }
});
const Post=mongoose.model("Post",PostSchema);

const CommentSchema=new mongoose.Schema({
    username:String,
    postId:String,
    comment:String,
    commentDate:{
        type:Date,
        default:Date.now
    }
});
const Comment=mongoose.model("Comment",CommentSchema);

const FollowerSchema=new mongoose.Schema({
    follower:String,
    following:String
});
const Follower=mongoose.model("Follower",FollowerSchema);

app.post("/register",async(req,res)=>{
    console.log(req.body);
    const{ name,email,password }=req.body;
    const newUser=new User({
        name,
        email,
        password
    });
    await newUser.save();
    console.log("User Saved");
    res.json({
        message:"Registration Successful!"
    });
});

app.post("/login",async(req,res)=>{
    const{ name,email,password }=req.body;
    const foundUser=await User.findOne({
        email,
        password
    });
    if(foundUser){
        res.json({
            message:"Login Successful!"
        });
    }
    else{
        res.json({
            message:"Invalid Email or Password"
        });
    }
});
app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`);
});

app.post("/create-post",async(req,res)=>{
    const{ username,content }=req.body;
    const newPost=new Post({
    username,
    content
});
await newPost.save();
res.json({
message:"Post Created Successfully!"
});
});

app.get("/posts",async(req,res)=>{
    const posts=await Post.find().sort({postDate:-1});
    res.json(posts);
});

app.post("/add-comment",async(req,res)=>{
    const{ username,postId,comment }=req.body;
    const newComment=new Comment({
        username,
        postId,
        comment
    });
    await newComment.save();
    res.json({
        message:"Comment Added Successfully!"
    });
});

app.post("/like-post",async(req,res)=>{
    const{ postId }=req.body;
    await Post.findByIdAndUpdate(
        postId,
        {$inc:{likes:1} }
    );
    res.json({
        message:"Post Liked"
    });
});

app.post("/follow-user",async(req,res)=>{
    const { follower,following }=req.body;
    const newFollow=new Follower({
        follower,
        following
    });
    await newFollow.save();
    res.json({
        message:"User Followed Successfully!"
    });
});