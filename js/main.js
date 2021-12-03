//1 
function createElemWithText(HTMLelement = 'p', textContent = "", className){
let element = document.createElement(HTMLelement);
element.textContent = textContent;
if(className){
element.className = className;
}
return element;
}

//2

let createSelectOptions =  (userData) => {
    if(!userData) return;
    console.log(userData);
    var array = [];
    for (let user of userData) {
        let option = document.createElement('option');
        option.textContent = user.name;
        option.value = user.id;
        array.push(option);
    }
    return array;
}
console.log(createSelectOptions());


//3
const toggleCommentSection = (postId) => {
if (!postId) return;
    let sectionElem = null;
    document.querySelectorAll(`[data-post-id="${postId}"]`).forEach((elem) => {
        if (elem.tagName.toLowerCase() === 'section') {
            elem.classList.toggle("hide");
            sectionElem = elem;
        }
    })
    return sectionElem;
}

//4
function toggleCommentButton(postId) {
    if (!postId) return;
    let buttonElem = null;
    document.querySelectorAll(`[data-post-id='${postId}']`).forEach((elem) => {
        if(elem.tagName.toLowerCase() === 'button') {
            elem.textContent = elem.textContent === 'Show Comments'?'Hide Comments':'Show Comments';
            buttonElem = elem;
        }
    });
    return buttonElem

}

//5
function deleteChildElements(parentElement){
    if (!parentElement?.tagName) return;
    let childVar = parentElement.lastElementChild;
    while (childVar){
        parentElement.removeChild(childVar);
        childVar = parentElement.lastElementChild;
    }
    return parentElement;
}

//6

function addButtonListeners(){
    const main = document.querySelector('main');
    const allButtons = main.querySelectorAll('button');
    if(allButtons){
        for (let button of allButtons){
        const postId = button.dataset.postId;
        button.addEventListener("click", function(e){toggleComments(e, postId)}, false);
    }
}
return allButtons;
}
console.log(addButtonListeners());



//7
function removeButtonListeners(){
    const main = document.querySelector('main');
    const allButtons = main.querySelectorAll('button');
    for(let button of allButtons){
        const postId = button.dataset.postId;
        button.removeEventListener("click", function(e){toggleComments(e, postId)},
        false);
    }
    return allButtons;
}

//8 
function createComments(jsonComments) {
    if (!jsonComments) return;
    const fragment = document.createDocumentFragment();
    jsonComments.forEach(comment => {
        let article = document.createElement("article");
        const h3 = createElemWithText("h3", comment.name);
        const p = createElemWithText("p", comment.body);
        const p2 = createElemWithText("p", `From: ${comment.email}`);
        article.append(h3, p, p2);
        fragment.append(article);
    });
    return fragment;
}

//9
function populateSelectMenu(jsonUsers){
    if(!jsonUsers) return;
    const selectMenu = document.getElementById('selectMenu');
    const arrayOfOptions = createSelectOptions(jsonUsers);
    arrayOfOptions.forEach(element => {
    selectMenu.append(element); 
    });
    console.log(jsonUsers);
    console.log(selectMenu);
    return selectMenu;
};

console.log(populateSelectMenu());

//10

const getUsers = async () => {
    const response = await fetch("https://jsonplaceholder.typicode.com/users")
    const jsonUserData = await response.json();
    return jsonUserData;
}

//11

const getUserPosts = async (userId) => {
    if (!userId) return;
    try{
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
    const jsonPostsData = await response.json();
    console.log(jsonPostsData);
    console.log(userId);
    return jsonPostsData;
    } catch(error){
        console.log(error);
    }
}
console.log(getUserPosts());
//12

const getUser = async (userId) => {
    if (!userId) return;
    try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
    const jsonUserIdData = await response.json();
    console.log(userId);
    return jsonUserIdData;
    } catch(error){
        console.log(error);
    }
    console.log(jsonUserIdData)
}
console.log(getUser());


//13
const getPostComments = async (postId) => {
    if(!postId) return;
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
        const jsonPostComments = await response.json();
        return jsonPostComments;
        } catch(error){
            console.log(error);
    }
}

//14

const displayComments = async (postId) =>{
    if(!postId) return;
    let section = document.createElement("section");
    section.dataset.postId = postId;
    section.classList.add("comments", "hide");
    const comments = await getPostComments(postId);
    const fragment = createComments(comments);
    section.append(fragment);
    console.log(section);
    return section;
}
console.log(displayComments(5));



//15 
const createPosts = async (jsonPosts) => {
    if(!jsonPosts) return;

    let fragment = document.createDocumentFragment();

    for (let i = 0; i < jsonPosts.length; i++) {

        let post = jsonPosts[i];

        let article = document.createElement("article");
        let section = await displayComments(post.id);
        let author = await getUser(post.userId);

        let h2 = createElemWithText("h2", post.title);
        let p = createElemWithText("p", post.body);
        let p2 = createElemWithText("p", `Post ID: ${post.id}`);

        let p3 = createElemWithText("p", `Author: ${author.name} with ${author.company.name}`);
        let p4 = createElemWithText("p", `${author.company.catchPhrase}`);

        let button = createElemWithText("button", "Show Comments");
        button.dataset.postId = post.id;

        article.append(h2, p, p2, p3, p4, button, section); 

        fragment.append(article);
    }
    console.log(fragment);
    return fragment;
};


//16
const displayPosts = async (posts) => {
    const main = document.querySelector("main");
    if(posts) {
        let element = await createPosts(posts);
        main.append(element);
        return element;
    } else if (!posts) {
        let p = createElemWithText("p", "Select an Employee to display their posts.", "default-text");

        return p;
    }
}
console.log(displayPosts());

//17
const toggleComments = (e, postId) => {
if(!e || !postId) return;
e.target.listener = true;
let sectionElem = toggleCommentSection(postId);
let buttonElem = toggleCommentButton(postId);
let array = [sectionElem, buttonElem];
return array;
}

//18

const refreshPosts = async (jsonPosts) => {
    if(!jsonPosts) return;
    let removeButtons = removeButtonListeners();
    let mainElem = document.querySelector("main")
    let main = deleteChildElements(mainElem);
    let fragment = await displayPosts(jsonPosts);
    let addButtons = addButtonListeners();
    let array = [removeButtons, main, fragment, addButtons];
    console.log(array);
    return array;
}
console.log(refreshPosts());
//19

const selectMenuChangeEventHandler = async (e) => {
    let userId = e?.target?.value || 1;
    let jsonPosts = await getUserPosts(userId);
    let refreshPostsArray = await refreshPosts(jsonPosts);
    let array = [userId, jsonPosts, refreshPostsArray];
    return array;

}

//20
const initPage = async () => {
const userJsonData = await getUsers();
const selectElement = populateSelectMenu(userJsonData);
const array  = [userJsonData, selectElement];
return array;
}

//21
const initApp = () => {
    initPage();
    let selectMenu = document.getElementById('selectMenu');
    selectMenu.addEventListener("change", function (e) {selectMenuChangeEventHandler(e)}, false);
}

document.addEventListener("DOMContentLoaded", initApp());
