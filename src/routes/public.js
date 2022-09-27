module.exports = function (express, app) {
  app.use('/styles', express.static('./public/styles'));
  app.use('/images', express.static('./public/images'));
};
