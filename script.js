const commentSection = document.querySelector(".comment-section");
const createBtn = document.querySelector(".btnAdd");
const textTitle = document.querySelector("#title");
const inputComments = document.querySelector("#comment");
const addCommentButton = document.getElementById("btn-add");
const sortedCommentButton = document.getElementById("btn-sort");

let comments = [];
let isUpdate = false;
let updateId;

const addCommentContainer = () => {
  commentSection.classList.add('visible');
};

let sortDescending = true; // Flag to keep track of the sorting order

const toggleSortedOrder = (sortOrder=true) => {
  console.log('Toggle Sorted Order function called');

  sortDescending = sortOrder;
  comments.sort(sortedComments);
  console.log(comments,"sorting")
  updateUI(); // Update the UI after sorting
};

function sortedComments(a, b) {
  let dateA = new Date(a.date);
  let dateB = new Date(b.date);

  if (sortDescending) {
    return dateB.getTime() - dateA.getTime();
  } else {
    return dateA.getTime() - dateB.getTime();
  }
}


const renderNewCommentElement = (title, comment, id, date) => {
  const newCommentElement = document.createElement('li');
  newCommentElement.className = 'text-element';
  newCommentElement.innerHTML = `
    <div class="text-element__info">
      <h2>${title}</h2>
      <p>${comment}</p>
      <span>${date}</span>
      <img src="images/delete.png" class="deleteImg">
      <img src="images/edit.png" class="editImg">
    </div>
  `;
  const listRoot = document.getElementById('comment-list');
  listRoot.append(newCommentElement);

  const deleteImg = newCommentElement.querySelector('.deleteImg');
  deleteImg.addEventListener('click', () => deleteCommentById(newCommentElement));

  const editImg = newCommentElement.querySelector('.editImg');
  editImg.addEventListener('click', () => editCommentHandler(id));

  return newCommentElement;
}

const updateStorage = () => {
  localStorage.setItem("comments", JSON.stringify(comments));
};

const addCommentHandler = () => {
  const titleValue = textTitle.textContent;
  const textValue = inputComments.textContent;

  if (titleValue.trim() === '' || textValue.trim() === '') {
    alert('Please enter text.');
    return;
  }

  const currentDate = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString(undefined, options);

  const newComment = {
    id: Math.random().toString(),
    title: titleValue,
    text: textValue,
    date: formattedDate
  };

  if (!isUpdate) {
    comments.push(newComment);
  } else {
    const commentIndex = comments.findIndex((comment) => comment.id === updateId);
    if (commentIndex !== -1) {
      comments.splice(commentIndex, 1); // Remove the existing comment
    }
    console.log(comments)
    comments.unshift(newComment); // Add the edited comment at the beginning of the array
  }

  clearComment();
  updateStorage();
  toggleSortedOrder(); // Sort and update UI
  addCommentButton.innerText = "ADD COMMENT";
};



const editCommentHandler = (id) => {
  const comment = comments.find((comment) => comment.id === id);
  
  if (comment) {
    updateId = id;
    isUpdate = true;
    textTitle.textContent = comment.title;
    inputComments.textContent = comment.text;
    addCommentContainer();
    addCommentButton.innerText = "Update Comment";
  }
};
const deleteCommentById = (commentElement) => {
  const listRoot = document.getElementById('comment-list');
  const commentIndex = Array.from(listRoot.children).indexOf(commentElement);

  if (commentIndex === -1) {
    return; // Comment element not found
  }

  comments.splice(commentIndex, 1);
  commentElement.remove();
  updateStorage();
  updateUI();
};

const clearComment = () => {
  textTitle.textContent = '';
  inputComments.textContent = '';
};

const updateUI = () => {
  const listRoot = document.getElementById('comment-list');
  listRoot.innerHTML = '';

  if (comments.length === 0) {
    const entryTextSection = document.getElementById('entry-text');
    entryTextSection.style.display = 'block';
  } else {
    const entryTextSection = document.getElementById('entry-text');
    entryTextSection.style.display = 'none';

    // Sort the comments before rendering them
    console.log(sortDescending, comments)
    const sortedComments = sortDescending ? [...comments] : [...comments].reverse();
    console.log(sortedComments)
    sortedComments.forEach((comment) => {
      renderNewCommentElement(comment.title, comment.text, comment.id, comment.date);
    });
  }
};

createBtn.addEventListener('click', addCommentContainer);
addCommentButton.addEventListener('click', addCommentHandler);
sortedCommentButton.addEventListener('click', ()=>toggleSortedOrder(!sortDescending));

// Load comments from localStorage if available
const storedComments = localStorage.getItem("comments");
if (storedComments) {
  comments = JSON.parse(storedComments);
  toggleSortedOrder(); // Call toggleSortedOrder before rendering comments
}
