const handlebars = require('handlebars');

String.prototype.stripLinebreaks = function() {
  return this.replace(/\n/g, ' ');
};

handlebars.registerHelper('strip_linebreaks', function removeLinebreaks(object, property) {
  const propertyValue = handlebars.escapeExpression(object[property]);
  const strippedValue = String(propertyValue).stripLinebreaks();
  return new handlebars.SafeString(strippedValue);
});
