const EVENTS = [
  "appMention",
  "fate",
  "generateEvents",
  "genImage",
  "message",
  "summarize",
];

const generateEvents = () => {
  EVENTS.map((event) => {
    require(`./${event}`);
  });
};

module.exports = generateEvents;
