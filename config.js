  module.exports = { 
    DATABASE_URL : process.env.DATABASE_URL || "mongodb://localhost/pollodb",
    PORT : process.env.PORT || 8080,
    SECRET_TOKEN : process.env.SECRET_TOKEN || 'quierosacar100:('
};