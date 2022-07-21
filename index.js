const add_btn = document.querySelector(".add-note");
const container = document.querySelector(".container");
const delete_all_btn = document.querySelector(".delete-all");
let isTyping = false;
let cnt;
// localStorage.clear();
class NoteObj {
  //noteobj to store the notes and ts at local storage
  constructor(note, timestamp) {
    this.note = note;
    this.timestamp = timestamp;
  }
}
const editButtonEL = () => {
  let edit_btn = document.querySelectorAll(".edit-icon");
  edit_btn[edit_btn.length - 1].addEventListener("click", (event) => {
    toggleElements(event.currentTarget);
    Notes.forEach((elem, ind) => {
      if (
        elem.timestamp ==
          event.currentTarget.parentNode.children[0].children[0].textContent &&
        event.currentTarget.parentNode.parentNode.children[1].classList.contains(
          "hide"
        )
      ) {
        //we are at saving phase and we got the data of the corresponding array element based on timestamp to update
        let obj = new NoteObj(
          event.currentTarget.parentNode.parentNode.children[2].children[0].textContent,
          event.currentTarget.parentNode.children[0].children[0].textContent
        );
        Notes.splice(ind, 1, obj);
      }
    });
    localStorage.setItem("notes", JSON.stringify(Notes));
    playSoundEdit();
  });
};
const deleteButtonEL = () => {
  let delete_btn = document.querySelectorAll(".delete-icon");
  delete_btn[delete_btn.length - 1].addEventListener("click", (event) => {
    Notes.forEach((elem, ind) => {
      if (
        elem.timestamp ==
        event.currentTarget.parentNode.children[0].children[0].textContent
      ) {
        Notes.splice(ind, 1);
      }
    });
    localStorage.setItem("notes", JSON.stringify(Notes));
    event.currentTarget.parentNode.parentNode.remove();
    //removed the note to be deleted
    cnt--;
    if (cnt == 0) {
      EmptyTextDisplay();
      localStorage.removeItem("notes");
    }
    playSoundDelete();
  });
};
var Notes; //ds to maintain the notes
const removeEmptyMessage = () => {
  container.classList.remove("containerClass");
  let selec = document.querySelector(".emptyMessage");
  selec.classList.add("hide");
};
const EmptyTextDisplay = () => {
  container.classList.add("containerClass");
  let selec = document.querySelector(".emptyMessage");
  selec.classList.remove("hide");
};
const toggleElements = (target) => {
  const ref = target.parentNode.parentNode;
  const localTextArea = ref.children[1];
  const localOutput = ref.children[2];
  if (localTextArea.classList.contains("hide") && !isTyping) {
    //writing phase
    isTyping = true;

    localTextArea.value = localOutput.children[0].textContent;
    localTextArea.classList.remove("hide");
    localOutput.classList.add("hide");
  } else if (localOutput.classList.contains("hide")) {
    //saving phase
    isTyping = false;
    localOutput.children[0].textContent = localTextArea.value;
    localOutput.classList.remove("hide");
    localTextArea.classList.add("hide");
  }
};
const addNoteArray = (arr) => {
  Notes = arr;
  cnt = arr.length;
  arr.forEach((elem) => {
    let TS = elem.timestamp;
    let note = elem.note;
    const htmlNote = `   
        <div class="note">
        <div class="controls">
            <div class="time-stamp"><p>${TS}</p></div>
            <div class="edit-icon icon"><i class="fa-solid fa-pen-to-square" ></i></div>
            <div class="delete-icon icon"><i class="fa-solid fa-trash-can" ></i></div>
        </div>
        <textarea class="input-field hide" rows="15" cols="10"></textarea>
        <div class="output-field">
            <p class="content">${note}</p>
        </div>
        </div>`;
    container.insertAdjacentHTML("beforeend", htmlNote);
    deleteButtonEL();
    editButtonEL();
  });
};
const addNote = () => {
  let ts = new Date();
  const TS = ts.toLocaleString();
  const htmlNote = `   
  <div class="note">
  <div class="controls">
      <div class="time-stamp"><p>${TS}</p></div>
      <div class="edit-icon icon"><i class="fa-solid fa-pen-to-square" ></i></div>
      <div class="delete-icon icon"><i class="fa-solid fa-trash-can" ></i></div>
  </div>
  <textarea class="input-field hide" rows="15" cols="10"></textarea>
  <div class="output-field">
      <p class="content"></p>
  </div>
  </div>`;
  let obj = new NoteObj("", TS);
  Notes.splice(Notes.length, 0, obj); //when new note is added
  localStorage.setItem("notes", JSON.stringify(Notes));
  cnt++;
  if (cnt == 1) removeEmptyMessage();
  container.insertAdjacentHTML("beforeend", htmlNote);
};
const playSoundEdit = () => {
  let audio = new Audio("sounds/edit.wav");
  audio.play();
};
const playSoundAdd = () => {
  let audio = new Audio("sounds/click.mp3");
  audio.play();
};
const playSoundDelete = () => {
  let audio = new Audio("sounds/delete.wav");
  audio.play();
};
add_btn.addEventListener("click", () => {
  //whenever new notes added
  //we need to add event listeners to them
  playSoundAdd();
  addNote();
  editButtonEL();
  deleteButtonEL();
});
delete_all_btn.addEventListener("click", () => {
  let notes = document.querySelectorAll(".note");
  notes.forEach((elem) => {
    elem.remove();
  });
  Notes = [];
  localStorage.removeItem("notes");
  cnt = 0;
  EmptyTextDisplay();
  playSoundDelete();
});
//whenever website loaded these will execute first time
//JS loads one time
Notes = localStorage.getItem("notes");
if (!Notes) {
  Notes = [];
  cnt = 0;
  EmptyTextDisplay();
} else {
  addNoteArray(JSON.parse(Notes));
}

/*
subtle difference between event.target and event.currentTarget-
target invokes the element on which event occured.
currentTarget invokes the element on which the event was defined to occur

say a div has icon then when event added to div then via target we can receive the icon as 
target value but with currentTarget we always get the div not icon.

this may cause problem when backtracking say want to access the parent node then will be
troublesome as different number of levels to move back to
*/

/*local storage
array of objects with both ts and note
*/
