const events = {};

// Returns with JSON Body
const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

// Returns without JSON Body, takes request response and status.
const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

// returns an Events
const getEvent = (request, response, body) => {
  let responseJSON = {

  };
  if (!(body.name in events)) {
    responseJSON.id = 'notFound';
    responseJSON.message = 'Event does not exist';
    return respondJSON(request, response, 400, responseJSON);
  }
  if (body.name in events) {
    responseJSON = events[body.name];
    return respondJSON(request, response, 200, responseJSON);
  }
  return respondJSON(request, response, 200, responseJSON);
};

//Gets meta information about event. 
const getEventMeta = (request, response) => {
  return respondJSONMeta(request, response, 204);
};

// returns all Events. 
const getAll = (request, response) => {
  const responseJSON = {
    events,
  };

  respondJSON(request, response, 200, responseJSON);
};

// Adds an event with a date, binds the guest list to it. Change to allow for Head Requests
const addEvent = (request, response, body) => {
  const responseJSON = {
    message: 'You must have an event name and date.',
  };
  if (!body.name || !body.date) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }
  if (body.name in events) {
    responseJSON.message = 'Event already exists.';
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  const guestList = body.guestList.split(','); // Split the string of guestList into an array
  const rsvpList = body.rsvp.split(','); // Split the string of guestList into an array
  let newGuestArray = [];
  let newrsvpArray = [];

  for (let i = 0; i <= body.guestNum; i++) {
    if(guestList[i] === ''){
      continue;
    }
    newGuestArray.push(guestList[i]); // Push the array into the Events array
    newrsvpArray.push(rsvpList[i]); // Push the array into the Events array
  }
  if(newGuestArray.length === 0)
  {
    responseJSON.message = 'You must have at least one guest.';
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  

  //Create event object
  events[body.name] = {
    name: body.name,
    date: body.date,
    guests: [],
    rsvpd: [],
  };
  responseJSON.message = 'Event created.';
  responseCode = 201;
  events[body.name].guests = newGuestArray; // Push the array into the Events array
  events[body.name].rsvpd = newrsvpArray; // Push the array into the Events array
  return respondJSON(request, response, responseCode, responseJSON);
};

// Updates existing event
const updateEvent = (request, response, body) => {
  const responseJSON = {
    message: 'Event was not found',
  };
  if (!(body.name in events)) {
    responseJSON.id = 'notFound';
    return respondJSON(request, response, 400, responseJSON);
  }

  const responseCode = 204;
  events[body.name].date = body.date;

  const guestList = body.guestList.split(','); // Split the string of guestList into an array
  const rsvpList = body.rsvp.split(','); // Split the string of guestList into an array
  let newGuestArray = [];
  let newrsvpArray = [];
  for (let i = 0; i <= body.guestNum; i++) {
    if(guestList[i] === ''){
      continue;
    }
    newGuestArray.push(guestList[i]); // Push the array into the Events array
    newrsvpArray.push(rsvpList[i]); // Push the array into the Events array
  }

  events[body.name].guests = newGuestArray;
  events[body.name].rsvpd = newrsvpArray;
  return respondJSONMeta(request, response, responseCode);
};

// For nonexistent Pages
const notReal = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found',
    id: 'notFound',
  };
  const responseCode = 404;
  return respondJSON(request, response, responseCode, responseJSON);
};

//Head request for nonexistent pages
const notRealMeta = (request, response) => {
  //return 404 with no message
  respondJSONMeta(request, response, 404);
};

module.exports = {
  getEvent,
  addEvent,
  getAll,
  updateEvent,
  notReal,
  getEventMeta,
  notRealMeta
};
