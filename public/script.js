async function registerUser(){
const name=document.getElementById("name").value;
const email=document.getElementById("email").value;
const password=document.getElementById("password").value;
const response=await fetch("/register",{
    method:"POST",
    headers:{
        "Content-Type":"application/json"
    },
    body:JSON.stringify({
        name,
        email,
        password
    })
});
const data=await response.json();
alert(data.message);
}

async function loginUser(){
    const email=document.getElementById("email").value;
    const password=document.getElementById("password").value;
    const response=await fetch("/login",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            email,
            password
        })
    });
    const data=await response.json();
    if(data.message==="Login Successful!"){
        localStorage.setItem("username",email);
    localStorage.setItem("loggedIn","true");
    alert(data.message);
    window.location.href="index.html";
    }else{
        alert(data.message);
        }
}

async function createPost(){
    const username=document.getElementById("username").value;
    const content=document.getElementById("content").value;
    const response=await fetch("/create-post",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
       body:JSON.stringify ({
        username,
        content
       })
    });
    const data=await response.json();
    alert(data.message);
    loadPosts();
}

async function loadPosts(){
    const response=await fetch("/posts");
    const posts=await response.json();
    let container=document.getElementById("post-container");
    container.innerHTML="";
    posts.forEach(post=>{
    container.innerHTML += `
<div class="post-card">
    <h3>${post.username}</h3>
    <p>${post.content}</p>
    <p>Likes: ${post.likes||0}</p>
    <button onclick="likePost('${post._id}')">
    Like</button><br></br>
    <input type="text" id="comment-${post._id}" placeholder="Write a comment">
    <button onclick="addComment('${post._id}')">
        Add Comment
    </button>
    <button onclick="followUser('${post.username}')">Follow</button>
</div>
`;
    });
}
if(window.location.pathname.includes("index.html")||window.location.pathname==='/'){
    loadPosts();
}

async function addComment(postId){
const comment=document.getElementById(`comment-${postId}`).value;
const username="Raghav";
const response=await fetch("/add-comment",{
    method:"POST",
    headers:{
        "Content-Type":"application/json"
    },
    body:JSON.stringify({
        username,
        postId,
        comment
    })
});
const data=await response.json();
alert(data.message);
}

async function likePost(postId){
    const response=await fetch("/like-post",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            postId
        })
    });
    const data=await response.json();
    loadPosts();
}

function logout(){
    localStorage.clear();
    alert("Logged Out Successfully!");
    window.location.href="login.html";
}

async function followUser(username){
    const follower=localStorage.getItem("username")||"Guest";
    const response=await fetch("/follow-user",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
          follower,
          following:username  
        })
    });
    const data=await response.json();
    alert(data.message);
}