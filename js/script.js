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
    this.htmlElement = '';
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

  getHtmlElement() {
    return this.htmlElement;
  }

  // setters
  setFirstName(firstName) {
    if (firstName instanceof String) {
      this.firstName = firstName;
    } else {
      handleError('This is not a valid first name');
    }
  }

  setLastName(lastName) {
    if (lastName instanceof String) {
      this.lastName = lastName;
    } else {
      handleError('This is not a valid last name');
    }
  }

  setCapsule(capsule) {
    capsule = parseInt(capsule);
    if (Number.isInteger(capsule)) {
      this.capsule = capsule;
    } else {
      handleError('This is not a valid capsule number');
    }
  }

  setAge(age) {
    age = parseInt(age);
    if (typeof age === 'number' && age > 0 && age <= 120) {
      this.age = age;
    } else {
      handleError('This is not a valid age');
    }
  }

  setCity(city) {
    if (typeof city === 'string') {
      this.city = city;
    } else {
      handleError('This is not a valid city');
    }
  }

  setGender(gender) {
    if (/(female)|(male)|(other)/i.test(gender)) {
      this.gender = gender;
    } else {
      handleError('This is not a valid gender');
    }
  }

  setHobby(hobby) {
    if (typeof hobby === 'string') {
      this.hobby = hobby;
    } else {
      handleError('This is not a valid hobby');
    }
  }

  setHtmlElement(htmlElements) {
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
    const rowHTML = `
          <div class="table__cell table__row" data-row="${row}" data-id="${id}" data-type="id">${id}</div>
          <div class="table__cell table__row" data-row="${row}" data-id="${id}" data-type="firstName">${this.getFirstName()}</div>
          <div class="table__cell table__row" data-row="${row}" data-id="${id}" data-type="lastName">${this.getLastName()}</div>
          <div class="table__cell table__row" data-row="${row}" data-id="${id}" data-type="capsule">${this.getCapsule()}</div>
          <div class="table__cell table__row" data-row="${row}" data-id="${id}" data-type="age">${this.getAge()}</div>
          <div class="table__cell table__row" data-row="${row}" data-id="${id}" data-type="city">${this.getCity()}</div>
          <div class="table__cell table__row" data-row="${row}" data-id="${id}" data-type="gender">${this.getGender()}</div>
          <div class="table__cell table__row" data-row="${row}" data-id="${id}" data-type="hobby">${this.getHobby()}</div>
          <div class="table__cell table__row" data-row="${row}" data-id="${id}" data-type="btns">
            <div class="btn btn__edit">Edit</div>
            <div class="btn btn__delete">Delete</div>
          </div>
          <div class="line"></div>`;
    table.insertAdjacentHTML('beforeend', rowHTML);
    this.setHtmlElement([...document.querySelectorAll(`[data-id="${id}"]`)]);
    document.querySelector('.loading-spinner').classList.add('none');
    table.parentElement.classList.remove('none');
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

  sortPeopleList() {}
}

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

async function handleLoad() {
  const people = new People();
  people.peopleList =
    getLocalStorageItem('modified') || getLocalStorageItem('original') || (await people.fillPeopleList());
  people.addPeopleListToDOM();
}

window.addEventListener('load', handleLoad);
