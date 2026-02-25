import React, { useEffect, useState } from "react";
import "./CivicDiscussionForum.css";

function CivicForum() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [commentInputs, setCommentInputs] = useState({});

  const currentUser =
    JSON.parse(localStorage.getItem("currentUser")) ||
    JSON.parse(sessionStorage.getItem("currentUser"));

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    const loadPosts = () => {
      const systemData =
        JSON.parse(localStorage.getItem("electionSystem")) || {
          users: [],
          elections: [],
          reports: [],
          notifications: [],
          forumPosts: [],
        };

      if (!systemData.forumPosts) {
        systemData.forumPosts = [];
        localStorage.setItem(
          "electionSystem",
          JSON.stringify(systemData)
        );
      }

      setPosts(systemData.forumPosts);
    };

    loadPosts();
    const interval = setInterval(loadPosts, 1000);
    return () => clearInterval(interval);
  }, []);

  /* ================= SAVE TO STORAGE ================= */

  const updateStorage = (updatedPosts) => {
    const systemData =
      JSON.parse(localStorage.getItem("electionSystem")) || {};

    systemData.forumPosts = updatedPosts;

    localStorage.setItem(
      "electionSystem",
      JSON.stringify(systemData)
    );

    setPosts(updatedPosts);
  };

  /* ================= CREATE POST ================= */

  const handleCreatePost = () => {
    if (!newPost.trim()) {
      alert("Write something to post");
      return;
    }

    const newForumPost = {
      id: crypto.randomUUID(),
      userName: currentUser?.fullName || currentUser?.name,
      userEmail: currentUser?.email,
      content: newPost,
      likes: 0,
      likedBy: [],
      comments: [],
      date: new Date().toLocaleString(),
    };

    const updated = [newForumPost, ...posts];
    updateStorage(updated);
    setNewPost("");
  };

  /* ================= LIKE ================= */

  const handleLike = (postId) => {
    const updated = posts.map((post) => {
      if (post.id === postId) {
        const alreadyLiked = post.likedBy.includes(
          currentUser.email
        );

        return {
          ...post,
          likes: alreadyLiked
            ? post.likes - 1
            : post.likes + 1,
          likedBy: alreadyLiked
            ? post.likedBy.filter(
                (email) => email !== currentUser.email
              )
            : [...post.likedBy, currentUser.email],
        };
      }
      return post;
    });

    updateStorage(updated);
  };

  /* ================= COMMENT ================= */

  const handleAddComment = (postId) => {
    const commentText = commentInputs[postId];
    if (!commentText) return;

    const updated = posts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [
            ...post.comments,
            {
              id: Date.now(),
              userName:
                currentUser?.fullName ||
                currentUser?.name,
              text: commentText,
              date: new Date().toLocaleString(),
            },
          ],
        };
      }
      return post;
    });

    updateStorage(updated);

    setCommentInputs({
      ...commentInputs,
      [postId]: "",
    });
  };

  return (
    <div className="forum-container">
      <h2>Civic Discussion Forum</h2>

      {/* ================= RULES ================= */}
      <div className="forum-rules">
        <h4>Moderation Rules</h4>
        <ul>
          <li>Be respectful to others</li>
          <li>No hate speech or abuse</li>
          <li>No fake political propaganda</li>
          <li>Stay relevant to civic issues</li>
        </ul>
      </div>

      {/* ================= POST SECTION ================= */}
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

      {/* ================= POSTS ================= */}
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
                👍 {post.likes}
              </button>
            </div>

            {/* COMMENTS */}
            <div className="comment-section">
              {post.comments.map((comment) => (
                <div key={comment.id} className="comment">
                  <strong>{comment.userName}</strong>:{" "}
                  {comment.text}
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
                <button
                  onClick={() =>
                    handleAddComment(post.id)
                  }
                >
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