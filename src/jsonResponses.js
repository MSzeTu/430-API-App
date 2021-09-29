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

// returns all Events. CHANGE TO TAKE PARAMETERS
const getEvent = (request, response) => {
  const responseJSON = {
    events,
  };
  

  respondJSON(request, response, 200, responseJSON);
};

// Adds an event with a date, binds the guest list to it. Change to allow for Head Requests
const addEvent = (request, response, body) => {
  const responseJSON = {
    message: 'You must have an event name and date.'
  };
  console.dir(body);
  if(!body.name || !body.date) {
    responseJSON.id = 'missingParams';
    console.log("missingParams");
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 201;

  //For now, only create objects
  events[body.name] = {
    "name" : body.name,
    "date" : body.date,
    "guests" : [] 
  }
  for(let i=0; i <= body.guestNum; i++)
  {
    events[body.name].guests.push(body.guestList[i]);
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
