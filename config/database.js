if(process.env.NODE_ENV == 'production'){
  module.exports = {
    mongoURI: 'mongodb://mohamami:test123@ds155674.mlab.com:55674/iliya-nota'
  };
} else {
  module.exports = {
    mongoURI: 'mongodb://localhost/nota'
  };
}
