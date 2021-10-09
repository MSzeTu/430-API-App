let guests = 0; //Variable to track the number of guests
let guestList = [];
let rsvpList = [];

//Handles requests
const handleResponse = (xhr, parseResponse) => {
  const content = document.querySelector('#currentStatus'); //Access the HTML content
  let obj = '';
  switch (xhr.status) { //Act based on status code.
    case 200: //if success
      obj = parseJSON(xhr)
      content.innerHTML = `<b>Displaying ${obj.name} on ${obj.date}</b>`;
      genTable(obj.guests, obj.rsvpd);
      break;
    case 201: //if created, add it to the list
      //Add the event to the list of existing events
      let events = document.querySelector('#eventField');
      let option = document.createElement('OPTION');
      option.innerHTML = document.querySelector('#nameField').value;
      option.value = document.querySelector('#nameField').value;
      events.options.add(option);
      content.innerHTML = `<b>Event has been Created</b>`;
      break;
    case 204: //if already exists
      content.innerHTML = `<b>Event Updated</b>`;
      parseResponse = false; //Do not parse this was a HEAD.
      break;
    case 400: //Bad request
      obj = parseJSON(xhr)
      content.innerHTML = `<b>${obj.message}</b>`;
      break;
    case 404:
      content.innerHTML = `<b>Page Not Found</b>`;
      break;
  }
};

//Parses the JSON when called
const parseJSON = (xhr) => {
  const obj = JSON.parse(xhr.response);

  return obj;
};

//Function for Get Requests. 
const getRequest = (e, eventForm) => {
  //Grab url
  let url = eventForm.getAttribute('action');

  //Build the URL as necessary
  let selection = document.querySelector('#eventField');
  let name = selection.options[selection.selectedIndex].value;
  url += `?name=${name}`;

  //Grab method
  const method = eventForm.getAttribute('method');

  //Create Ajax request
  const xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.setRequestHeader('Accept', 'application.json');

  //if get or head
  xhr.onload = () => handleResponse(xhr, true);



  //send ajax request
  xhr.send();

  //cancel default
  e.preventDefault(e);
  return false;
}

//Function for Post Requests
const sendPost = (e, nameForm, guests, guestList, update) => {
  //Set up the guestList
  for (let i = 0; i <= guests; i++) {
    let value = document.querySelector('#nameForm').querySelector(`#guest${i}`).value;
    guestList.push(value);

    let rsvpValue = value = document.querySelector('#nameForm').querySelector(`#rsvp${i}`).checked;
    rsvpList.push(rsvpValue);
  }

  let nameAction = '';
  let nameField = '';

  if (update) {
    nameAction = '/updateEvent';
    nameField = document.querySelector('#eventField');
  } else {
    nameAction = nameForm.getAttribute('action');
    nameField = nameForm.querySelector('#nameField');
  }

  const nameMethod = nameForm.getAttribute('method');



  const dateField = nameForm.querySelector('#dateField');

  //Create Ajax request
  const xhr = new XMLHttpRequest();

  //Sets method and url
  xhr.open(nameMethod, nameAction);

  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.setRequestHeader('Accept', 'application/json');

  xhr.onload = () => handleResponse(xhr, true);


  const formData = `name=${nameField.value}&date=${dateField.value}&guestNum=${guests}&guestList=${guestList}&rsvp=${rsvpList}`;
  xhr.send(formData);

  guestList.splice(0, guestList.length);
  rsvpList.splice(0, rsvpList.length);

  e.preventDefault();
  return false; //Prevents page change
};

//Gets all events from the server and populates the dropdown
const initGet = () => {
  let url = '/getAll';

  const method = 'GET';

  const xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.setRequestHeader('Accept', 'application.json');

  xhr.onload = () => populateMenu(xhr);

  xhr.send();

  return false;
};

//Populates the dropdown using the received data
const populateMenu = (xhr) => {
  let obj = parseJSON(xhr)
  let events = document.querySelector('#eventField');
  Object.keys(obj.events).forEach(key => {
    let option = document.createElement('OPTION');
    option.innerHTML = key;
    events.options.add(option);
  });
};

const add = () => { //Adds a guest input slot
  guests++;
  //Append guest list
  let nameForm = document.querySelector("#nameForm");
  let input = document.createElement("input");
  input.setAttribute('type', 'text');
  input.setAttribute('id', `guest${guests}`);
  input.setAttribute('name', `guest${guests}`);
  nameForm.appendChild(document.createElement("br"));
  nameForm.appendChild(input);

  //Append Checkbox for RSVP
  input = document.createElement("input");
  input.setAttribute('type', 'checkbox');
  input.setAttribute('id', `rsvp${guests}`);
  input.setAttribute('name', `rsvp${guests}`);
  nameForm.appendChild(input);
}

const remove = () => { //Removes a guest input slot
  if (guests === 0) {
    return;
  }

  let nameForm = document.querySelector("#nameForm");

  let breaks = document.getElementsByTagName("br");
  nameForm.removeChild(breaks[breaks.length - 1]);

  let removeNode = nameForm.querySelector(`#guest${guests}`);
  nameForm.removeChild(removeNode);

  removeNode = nameForm.querySelector(`#rsvp${guests}`);
  nameForm.removeChild(removeNode);

  guests--;

}

//Makes an event Table and puts it in content
const genTable = (guests, rsvpd) => {
  let body = document.querySelector('#content');
  //Create a table element and tbody element
  let tbl = document.createElement("table");
  tbl.setAttribute('id', "table");
  let tblBody = document.createElement('tbody');

  //Create the label cells
  let row = document.createElement('tr');
  let cell = document.createElement('th');
  let cellText = document.createElement('b');
  cellText.innerHTML = 'Guests';
  cell.appendChild(cellText);
  row.appendChild(cell);

  cell = document.createElement('th');
  cellText = document.createElement('b');
  cellText.innerHTML = `RSVP'd`;
  cell.appendChild(cellText);
  row.appendChild(cell);

  tblBody.appendChild(row);
  //Populate the rest of the cells
  for (let i = 0; i < guests.length; i++) {
    row = document.createElement('tr');
    cell = document.createElement('td');
    cellText = document.createTextNode(guests[i]);
    cell.appendChild(cellText);
    row.appendChild(cell);

    cell = document.createElement('td');
    if (rsvpd[i] === `true`) {
      cellText = document.createTextNode(`Yes`);
    } else {
      cellText = document.createTextNode(`No`);
    }

    cell.appendChild(cellText);
    row.appendChild(cell);

    tblBody.appendChild(row);
  }

  tbl.appendChild(tblBody);
  body.insertBefore(tbl, document.querySelector('#q'));
  tbl.setAttribute('border', 2);
  convertToImage(tbl, body);
}

//Converts the created table to an image, then creates a QR code that directs to the events URL
const convertToImage = (tbl, body) => {
  html2canvas(tbl).then(function (canvas) { //Uses html2canvas 
    body.innerHTML = ''; //I tried to use insertBefore but it kept breaking so this is messy but works
    body.appendChild(canvas);
    let br = document.createElement("br");
    body.appendChild(br);
    let qrCanvas = document.createElement("canvas");
    qrCanvas.setAttribute('id', `qr`);
    body.appendChild(qrCanvas);

    //Generate QR code using QRious. I tried to convert the image to a QR code but it wouldn't work
    let qr = new QRious({
      element: document.querySelector('#qr'),
      value: `${window.location.href}getEvent?name=${document.querySelector('#eventField').value}`
    });
  });
}

const init = () => { //Initializes the page
  const nameForm = document.querySelector('#nameForm');

  //Create handler for addEvent and updateEvent
  const addEvent = (e) => sendPost(e, nameForm, guests, guestList, false);
  const updateEvent = (e) => sendPost(e, nameForm, guests, guestList, true);

  //Sets up the button functionality
  const addButton = document.querySelector('#addButton');
  const removeButton = document.querySelector('#removeButton');
  addButton.addEventListener("click", add);
  removeButton.addEventListener("click", remove);


  nameForm.addEventListener('submit', addEvent);

  //Create handler for getEvent
  const eventForm = document.querySelector('#eventForm');
  const getEvent = (e) => getRequest(e, eventForm);
  eventForm.addEventListener('submit', getEvent);

  //Add Update to the button
  const btn = eventForm.querySelector('#updateBtn');
  btn.addEventListener('click', updateEvent);

  //Populate the menu 
  initGet();
}

window.onload = init;