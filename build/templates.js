var templates = Handlebars.templates = Handlebars.templates || {};
templates['main'] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<h1>Bandit Racer</h1><ul class=\"menu\"><li class=\"play\"><button data-action=\"play\">Play</button></li><li class=\"multiplayer\"><input type=\"text\" placeholder=\"Enter game ID\" name=\"game-id\" /><button data-action=\"host\">Host </button><button data-action=\"join\">Join</button></li></ul>";
  });