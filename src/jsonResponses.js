const events = {};

// Returns with JSON Body
const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

// Returns without JSON Body, takes request response and status.
/* const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
}; */

// returns all Events. CHANGE TO TAKE PARAMETERS
const getEvent = (request, response, params) => {
  let responseJSON = {

  };
  if (!(params.name in events)) {
    responseJSON.id = 'notFound';
    responseJSON.message = 'Event does not exist';
    return respondJSON(request, response, 400, responseJSON);
  }
  if (params.name in events) {
    responseJSON = events[params.name];
    return respondJSON(request, response, 200, responseJSON);
  }
  return respondJSON(request, response, 200, responseJSON);
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

  const responseCode = 201;
  responseJSON.message = 'Event created';
  // For now, only create objects
  events[body.name] = {
    name: body.name,
    date: body.date,
    guests: [],
    rsvpd: [],
  };
  const guestList = body.guestList.split(','); // Split the string of guestList into an array
  const rsvpList = body.rsvp.split(','); // Split the string of guestList into an array
  for (let i = 0; i <= body.guestNum; i++) {
    events[body.name].guests.push(guestList[i]); // Push the array into the Events array
    events[body.name].rsvpd.push(rsvpList[i]); // Push the array into the Events array
  }
  return respondJSON(request, response, responseCode, responseJSON);
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

module.exports = {
  getEvent,
  addEvent,
  notReal,
};
