/* eslint-disable max-classes-per-file */
class Person {
  constructor(id, firstName, lastName, capsule) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.capsule = capsule;
    this.age = 0;
    this.city = '';
    this.gender = '';
    this.hobby = '';
    this.htmlElements = '';
  }

  // getters
  getId() {
    return this.id;
  }

  getFirstName() {
    return this.firstName;
  }

  getLastName() {
    return this.lastName;
  }

  getCapsule() {
    return this.capsule;
  }

  getAge() {
    return this.age;
  }

  getCity() {
    return this.city;
  }

  getGender() {
    return this.gender;
  }

  getHobby() {
    return this.hobby;
  }

  getHtmlElements() {
    return this.htmlElements;
  }

  // setters
  setFirstName(firstName) {
    if (typeof firstName === 'string') {
      this.firstName = firstName;
      return true;
    }
    handleError('This is not a valid first name');
    return false;
  }

  setLastName(lastName) {
    if (typeof lastName === 'string') {
      this.lastName = lastName;
      return true;
    }
    handleError('This is not a valid last name');
    return false;
  }

  setCapsule(capsule) {
    capsule = parseInt(capsule);
    if (Number.isInteger(capsule)) {
      this.capsule = capsule;
      return true;
    }
    handleError('This is not a valid capsule number');
    return false;
  }

  setAge(age) {
    age = parseInt(age);
    if (typeof age === 'number' && age > 0 && age <= 120) {
      this.age = age;
      return true;
    }
    handleError('This is not a valid age');
    return false;
  }

  setCity(city) {
    if (typeof city === 'string') {
      this.city = city;
      return true;
    }
    handleError('This is not a valid city');
    return false;
  }

  setGender(gender) {
    if (/(female)|(male)/i.test(gender)) {
      this.gender = gender;
      return true;
    }
    handleError('This is not a valid gender');
    return false;
  }

  setHobby(hobby) {
    if (typeof hobby === 'string') {
      this.hobby = hobby;
      return true;
    }
    handleError('This is not a valid hobby');
    return false;
  }

  setHtmlElements(htmlElements) {
    // TODO add data validation
    this.htmlElements = htmlElements;
  }

  setAdditionalInfoAPI(age, city, gender, hobby) {
    this.setAge(age);
    this.setCity(city);
    this.setGender(gender);
    this.setHobby(hobby);
  }

  addToDOM(row) {
    const table = document.querySelector('.table');
    const id = this.getId();

    // <input type="number" name="" id="" min="1" max="120">
    // <input type="text" name="" id="">
    // <select name="" id=""><option value=""></option></select>

    const rowHTML = `
          <div class="table__cell table__row" data-row="${row}" data-id="${id}" data-type="id">${id}</div>
          <div class="table__cell table__row" data-row="${row}" data-id="${id}" data-type="firstName"><input type="text" name="firstName" id="firstName${id}" value="${this.getFirstName()}" disabled></div>
          <div class="table__cell table__row" data-row="${row}" data-id="${id}" data-type="lastName"><input type="text" name="lastName" id="lastName${id}" value="${this.getLastName()}" disabled></div>
          <div class="table__cell table__row" data-row="${row}" data-id="${id}" data-type="capsule"> <input type="number" name="capsule" id="capsule${id}" min="1" max="120" value="${this.getCapsule()}" disabled></div>
          <div class="table__cell table__row" data-row="${row}" data-id="${id}" data-type="age"> <input type="number" name="age" id="age${id}" min="1" max="120" value="${this.getAge()}" disabled></div>
          <div class="table__cell table__row" data-row="${row}" data-id="${id}" data-type="city"><input type="text" name="city" id="city${id}" value="${this.getCity()}" disabled></div>
          <div class="table__cell table__row" data-row="${row}" data-id="${id}" data-type="gender"><select name="gender" id="gender${id}" disabled>
          <option value="Male" ${this.getGender() === 'Male' ? 'selected' : ''}>Male</option><option value="Female" ${
      this.getGender() === 'Female' ? 'selected' : ''
    }>Female</option></select></div>
          <div class="table__cell table__row" data-row="${row}" data-id="${id}" data-type="hobby"><input type="text" name="hobby" id="hobby${id}" value="${this.getHobby()}" disabled></div>
          <div class="table__cell table__row" data-row="${row}" data-id="${id}" data-type="btns">
            <div class="btn btn__edit">Edit</div>
            <div class="btn btn__delete">Delete</div>
            <div class="btn btn__save none">Save</div>
            <div class="btn btn__cancel none">Cancel</div>
          </div>`;
    // <div class="line"></div>`;
    table.insertAdjacentHTML('beforeend', rowHTML);
    this.setHtmlElements([...document.querySelectorAll(`[data-id="${id}"]`)]);
    const btns = this.getHtmlElements().find((el) => el.dataset.type === 'btns');
    btns.querySelector('.btn__delete').addEventListener('click', deleteHtmlRow);
    btns.querySelector('.btn__edit').addEventListener('click', editHtmlRow);
    btns.querySelector('.btn__save').addEventListener('click', saveHtmlRow);
    btns.querySelector('.btn__cancel').addEventListener('click', cancelEditHtmlRow);
    document.querySelector('.loading-spinner').classList.add('none');
    table.parentElement.classList.remove('none');
  }

  updateHtmlRow(row) {
    const table = document.querySelector('.table');
    const id = this.getId();
    table.querySelectorAll(`[data-id="${id}"]`).forEach((cell) => {
      cell.style.gridRow = row;
      cell.dataset.row = row;
    });
  }
}

class People {
  static url = 'https://apple-seeds.herokuapp.com/api/users/';

  constructor() {
    this.peopleList = [];
  }

  async fillPeopleList() {
    try {
      const data = await fetchDataAPI(People.url);
      for (const item of data) {
        this.peopleList.push(new Person(item.id, item.firstName, item.lastName, item.capsule));
      }
      await Promise.allSettled(
        this.peopleList.map(async (person) => {
          const personData = await fetchDataAPI(`${People.url}${person.id}`);
          person.setAdditionalInfoAPI(personData.age, personData.city, personData.gender, personData.hobby);
        })
      );
      updateLocalStorage('original', this.peopleList);
      updateLocalStorage('modified', this.peopleList);
      return this.peopleList;
    } catch (error) {
      handleError(error);
    }
  }

  addPeopleListToDOM() {
    this.peopleList.forEach((person, index) => person.addToDOM(index + 2));
  }

  updatePeopleHtmlRows() {
    let counter = 0;
    this.peopleList.forEach((person, index) => {
      person.updateHtmlRow(index + 2 + counter);
      counter += 1;
    });
  }

  sortPeopleList(e) {
    const { type } = e.target.dataset;
    if (sortBy[0] === type) {
      sortBy[1] *= -1;
    } else {
      sortBy = [type, 1];
    }

    this.peopleList.sort((person1, person2) => {
      const typeEl1 = person1[type];
      const typeEl2 = person2[type];
      return `${typeEl1}`.localeCompare(`${typeEl2}`, undefined, { numeric: true }) * sortBy[1];
    });
    this.updatePeopleHtmlRows();
  }
}

const people = new People();
let sortBy = ['id', 1];

function handleError(error) {
  // TODO have a better error handling
  console.log(error);
}

async function fetchDataAPI(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    handleError(error);
  }
}

function updateLocalStorage(key, object) {
  localStorage.setItem(key, JSON.stringify(object));
}

function getLocalStorageItem(key) {
  const peopleList = JSON.parse(localStorage.getItem(key));
  if (!peopleList) return peopleList;
  for (const person of peopleList) {
    Object.setPrototypeOf(person, Person.prototype);
  }
  return peopleList;
}

function deleteHtmlRow(e) {
  const { id } = e.target.parentElement.dataset;
  const personIndex = people.peopleList.findIndex((personFromList) => id === `${personFromList.id}`);
  const htmlElements = people.peopleList[personIndex].getHtmlElements();
  htmlElements.forEach((cell) => cell.remove());
  people.peopleList.splice(personIndex, 1);
  updateLocalStorage('modified', people.peopleList);
}

function editHtmlRow(e) {
  [...e.target.parentElement.children].forEach((btn) => {
    btn.classList.toggle('none');
  });
  document.querySelectorAll('.btn__delete').forEach((delBtn) => delBtn.removeEventListener('click', deleteHtmlRow));
  document.querySelectorAll('.btn__edit').forEach((editBtn) => editBtn.removeEventListener('click', editHtmlRow));
  const { id } = e.target.parentElement.dataset;
  const person = people.peopleList.find((personFromList) => id === `${personFromList.id}`);
  person.getHtmlElements().forEach((cell) => {
    const input = cell.firstElementChild;
    if (input) {
      input.disabled = false;
    }
  });
}

function saveHtmlRow(e) {
  [...e.target.parentElement.children].forEach((btn) => {
    btn.classList.toggle('none');
    document.querySelectorAll('.btn__delete').forEach((delBtn) => delBtn.addEventListener('click', deleteHtmlRow));
    document.querySelectorAll('.btn__edit').forEach((editBtn) => editBtn.addEventListener('click', editHtmlRow));
  });
  const { id } = e.target.parentElement.dataset;
  const person = people.peopleList.find((personFromList) => id === `${personFromList.id}`);
  const setters = {
    firstName: person.setFirstName.bind(person),
    lastName: person.setLastName.bind(person),
    capsule: person.setCapsule.bind(person),
    age: person.setAge.bind(person),
    city: person.setCity.bind(person),
    gender: person.setGender.bind(person),
    hobby: person.setHobby.bind(person),
  };
  person.getHtmlElements().forEach((cell) => {
    const input = cell.firstElementChild;
    if (input && !input.classList.contains('btn')) {
      if (!setters[cell.dataset.type](input.value)) {
        input.value = person[cell.dataset.type];
      }
      input.disabled = true;
    }
  });
  updateLocalStorage('modified', people.peopleList);
}

function cancelEditHtmlRow(e) {
  [...e.target.parentElement.children].forEach((btn) => {
    btn.classList.toggle('none');
    document.querySelectorAll('.btn__delete').forEach((delBtn) => delBtn.addEventListener('click', deleteHtmlRow));
    document.querySelectorAll('.btn__edit').forEach((editBtn) => editBtn.addEventListener('click', editHtmlRow));
  });
  const { id } = e.target.parentElement.dataset;
  const person = people.peopleList.find((personFromList) => id === `${personFromList.id}`);

  person.getHtmlElements().forEach((cell) => {
    const input = cell.firstElementChild;
    if (input && !input.classList.contains('btn')) {
      input.value = person[cell.dataset.type];
      input.disabled = true;
    }
  });
}

async function handleLoad() {
  people.peopleList =
    getLocalStorageItem('modified') || getLocalStorageItem('original') || (await people.fillPeopleList());
  people.addPeopleListToDOM();
  const tableHeaders = document.querySelectorAll('.table__header');
  tableHeaders.forEach((header) => header.addEventListener('click', people.sortPeopleList.bind(people)));
}

window.addEventListener('load', handleLoad);
