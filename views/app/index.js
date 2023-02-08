const form = document.querySelector("#form");
const nameInput = document.querySelector("#name");
const phoneInput = document.querySelector("#phone");
const table = document.querySelector("#table");
const nameRegex = /^[a-zA-Z ]{4,25}$/;
const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;

let nameValidation = false;
let numberValidation = false;



(async() =>{
  try {
		const { data } = await axios.get('/api/todos');
    data.forEach(todo => {
      const newRow = document.createElement("tr");
      newRow.id = todo.id;
      newRow.innerHTML = `<input readonly type="text" value="${todo.text}" class="bg-transparent">
      <input readonly type="text" value="${todo.number}" class="bg-transparent font-semibold">
      <td><button class="delete-button h-10 px-5 m-2 text-red-100 transition-colors duration-150 
      bg-red-700 rounded-lg focus:shadow-outline hover:bg-red-800">Delete</button></td> 
      <td><button class="edit-button h-10 px-5 m-2 text-green-100 transition-colors duration-150 bg-green-700 
      rounded-lg focus:shadow-outline hover:bg-green-800">Edit</button></td>`;
      table.appendChild(newRow);
      
    });
    
  } catch (error) {
    if (error.response.status === 401){
      window.location.pathname = '/';
		}
  }
})();

// console.log(nameInput, phoneInput)
form.addEventListener("submit", async e => {
  e.preventDefault();
  
  if (!nameValidation || !numberValidation) {
      if (!nameValidation) {
    alert("Name is not valid. Please enter only letters.");
  } else if  (!numberValidation) {
      alert("Phone is not valid. Please enter the format 123-456-7890.");
    }
    return
  };

  const name = nameInput.value;
  const phone = phoneInput.value;

  // if (!nameRegex.test(name)) {
  //   alert("Name is not valid. Please enter only letters.");
  //   return;
  // }

  // if (!phoneRegex.test(phone)) {
  //   alert("Phone is not valid. Please enter the format 123-456-7890.");
  //   return;
  // }

  const { data } = await axios.post('/api/todos', { text: nameInput.value, number: phoneInput.value });
  // console.log('jejeje')

  const newRow = document.createElement("tr");
  newRow.id = data.id
  newRow.innerHTML = `<input readonly type="text" value="${name}" class="bg-transparent">
  <input readonly type="text" value="${phone}" class="bg-transparent font-semibold"><td><button class="delete-button h-10 px-5 m-2 text-red-100 transition-colors duration-150 
  bg-red-700 rounded-lg focus:shadow-outline hover:bg-red-800">Delete</button></td> <td><button class="edit-button h-10 px-5 m-2 text-green-100 transition-colors duration-150 bg-green-700 
  rounded-lg focus:shadow-outline hover:bg-green-800">Edit</button></td>`;
  table.appendChild(newRow);
  // console.log(name, phone)

  form.reset();
  nameValidation = false;
  numberValidation = false;
});



document.querySelector("table").addEventListener("click", async e => {
  // console.log(e.target)
  if (e.target.classList.contains("delete-button")) {
    const id = e.target.parentElement.parentElement.id
    await axios.delete(`/api/todos/${id}`)
    e.target.parentElement.parentElement.remove();
  }
  if (e.target.innerText === 'Edit') {
    const name = e.target.parentElement.parentElement.children[0];
    const number = e.target.parentElement.parentElement.children[1];
    name.removeAttribute('readonly');
    number.removeAttribute('readonly');
    e.target.innerText = 'Save'
  }else if (e.target.innerText === 'Save') {
    const td = e.target.parentElement.parentElement;
    console.log(td);
    const name = e.target.parentElement.parentElement.children[0];
    const number = e.target.parentElement.parentElement.children[1];
    console.log(name, number);
    await axios.patch(`/api/todos/${td.id}`, { text: name.value, number: number.value });
    name.setAttribute('readonly', 'readonly');
    number.setAttribute('readonly', 'readonly');
    e.target.innerText = 'Edit'
    
  }
});

nameInput.addEventListener('input', e =>{
  nameValidation = nameRegex.test(e.target.value);
});

phoneInput.addEventListener('input', e =>{
  numberValidation = phoneRegex.test(e.target.value);
});