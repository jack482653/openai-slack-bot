const EVENTS = [
  "appMention",
  "ask",
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
