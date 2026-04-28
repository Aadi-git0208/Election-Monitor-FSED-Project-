import React, { useCallback, useEffect, useState } from "react";
import "./CivicDiscussionForum.css";

function CivicForum() {

  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [commentInputs, setCommentInputs] = useState({});

  const currentUser =
    JSON.parse(localStorage.getItem("currentUser")) ||
    JSON.parse(sessionStorage.getItem("currentUser"));

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch("https://your-backend.up.railway.app/api/forum/all");
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    const kickoff = setTimeout(() => {
      void fetchPosts();
    }, 0);

    const interval = setInterval(fetchPosts, 3000);
    return () => {
      clearTimeout(kickoff);
      clearInterval(interval);
    };
  }, [fetchPosts]);

  const handleCreatePost = async () => {
    if (!newPost.trim()) {
      alert("Write something to post");
      return;
    }

    await fetch("https://your-backend.up.railway.app/api/forum/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName: currentUser?.fullName,
        userEmail: currentUser?.email,
        content: newPost,
      }),
    });

    setNewPost("");
    fetchPosts();
  };

  
  const handleLike = async (postId) => {
    await fetch(`https://your-backend.up.railway.app/api/forum/like/${postId}`, {
      method: "PUT",
    });

    fetchPosts();
  };

  const handleAddComment = async (postId) => {
    const commentText = commentInputs[postId];
    if (!commentText) return;

    await fetch(
      `https://your-backend.up.railway.app/api/forum/comment/${postId}?text=${commentText}&user=${currentUser?.fullName}`,
      {
        method: "POST",
      }
    );

    setCommentInputs({
      ...commentInputs,
      [postId]: "",
    });

    fetchPosts();
  };

  return (
    <div className="forum-container">

      <h2>Civic Discussion Forum</h2>

      {/* RULES SAME */}
      <div className="forum-rules">
        <h4>Moderation Rules</h4>
        <ul>
          <li>Be respectful to others</li>
          <li>No hate speech or abuse</li>
          <li>No fake political propaganda</li>
          <li>Stay relevant to civic issues</li>
        </ul>
      </div>

      {/* POST BOX SAME */}
      <div className="post-box">
        <textarea
          placeholder="Start a civic discussion..."
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        />

        <button onClick={handleCreatePost}>
          Post Discussion
        </button>
      </div>

      {/* POSTS */}
      {posts.length === 0 ? (
        <p>No discussions yet.</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="forum-post">

            <div className="post-header">
              <strong>{post.userName}</strong>
              <span>{post.date}</span>
            </div>

            <p>{post.content}</p>

            <div className="post-actions">
              <button onClick={() => handleLike(post.id)}>
                👍 {post.likes || 0}
              </button>
            </div>

            {/* COMMENTS */}
            <div className="comment-section">

              {(post.comments || []).map((comment, index) => (
                <div key={index} className="comment">
                  <strong>{comment.userName}</strong>: {comment.text}
                </div>
              ))}

              <div className="comment-input">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={commentInputs[post.id] || ""}
                  onChange={(e) =>
                    setCommentInputs({
                      ...commentInputs,
                      [post.id]: e.target.value,
                    })
                  }
                />

                <button onClick={() => handleAddComment(post.id)}>
                  Comment
                </button>
              </div>

            </div>

          </div>
        ))
      )}
    </div>
  );
}

export default CivicForum;