// Puerto
process.env.PORT = process.env.PORT || 3000


// Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'


// Base de datos

let urlDB;

if (process.env.NODE_ENV === 'dev'){
	urlDB = 'mongodb://localhost:27017/cafe';
} else {
	//urlDB = 'mongodb://cafe-user:qwerty1234@ds247270.mlab.com:47270/udemy-nodejs-cafe';
	urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;