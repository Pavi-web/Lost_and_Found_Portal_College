const STORAGE_KEY = "college_lost_found_posts_v1";
const itemForm = document.getElementById("itemForm");
const formMessage = document.getElementById("formMessage");
const postsContainer = document.getElementById("postsContainer");
const emptyMessage = document.getElementById("emptyMessage");
const filterType = document.getElementById("filterType");
const searchInput = document.getElementById("searchInput");
const clearAllBtn = document.getElementById("clearAllBtn");
let posts = [];
loadPostsFromStorage();
renderPosts();
itemForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const type = document.getElementById("type").value;
    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const location = document.getElementById("location").value.trim();
    const date = document.getElementById("date").value;
    const contact = document.getElementById("contact").value.trim();
    if (!type || !title || !description || !location || !date || !contact) {
        showFormMessage("Please fill all fields.", "error");
        return;
    }
    const newPost = {
        id: Date.now(),
        type,
        title,
        description,
        location,
        date,
        contact,
        createdAt: new Date().toISOString(),
    };
    posts.unshift(newPost);
    savePostsToStorage();
    renderPosts();
    itemForm.reset();
    showFormMessage("Post added successfully!", "success");
});
filterType.addEventListener("change", renderPosts);
searchInput.addEventListener("input", renderPosts);
clearAllBtn.addEventListener("click", function () {
    if (!confirm("Are you sure you want to clear ALL posts?")) return;
    posts = [];
    savePostsToStorage();
    renderPosts();
    showFormMessage("All posts cleared.", "success");
});
function loadPostsFromStorage() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
        posts = [];
        return;
    }
    try {
        posts = JSON.parse(raw) || [];
    } catch {
        posts = [];
    }
}
function savePostsToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}
function renderPosts() {
    postsContainer.innerHTML = "";

    const typeFilter = filterType.value;
    const searchText = searchInput.value.toLowerCase();
    const filtered = posts.filter((post) => {
        if (typeFilter !== "all" && post.type !== typeFilter) return false;
        const combined =
            `${post.title} ${post.description} ${post.location} ${post.contact}`.toLowerCase();
        if (searchText && !combined.includes(searchText)) return false;
        return true;
    });
    if (filtered.length === 0) {
        emptyMessage.textContent = "No posts to show. Try changing filters or add a new post.";
        return;
    } else {
        emptyMessage.textContent = "";
    }
    filtered.forEach((post) => {
        const card = document.createElement("div");
        card.className = "post-card";
        const header = document.createElement("div");
        header.className = "post-header";
        const titleEl = document.createElement("div");
        titleEl.className = "post-title";
        titleEl.textContent = post.title;
        const badge = document.createElement("span");
        badge.className = "badge " + post.type;
        badge.textContent = post.type === "lost" ? "Lost" : "Found";
        header.appendChild(titleEl);
        header.appendChild(badge);
        const meta = document.createElement("div");
        meta.className = "post-meta";
        meta.textContent = `${post.location} • ${formatDate(post.date)}`;
        const desc = document.createElement("div");
        desc.className = "post-description";
        desc.textContent = post.description;
        const contact = document.createElement("div");
        contact.className = "post-contact";
        contact.textContent = `Contact: ${post.contact}`;
        card.appendChild(header);
        card.appendChild(meta);
        card.appendChild(desc);
        card.appendChild(contact);
        postsContainer.appendChild(card);
    });
}
function showFormMessage(text, type) {
    formMessage.textContent = text;
    formMessage.classList.remove("error", "success");
    if (type === "error") {
        formMessage.classList.add("error");
    } else if (type === "success") {
        formMessage.classList.add("success");
    }
}
function formatDate(dateStr) {
    // dateStr like "2025-12-05"
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString();
}
