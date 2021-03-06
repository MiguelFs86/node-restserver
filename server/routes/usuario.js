const express = require('express')

const bcrypt = require('bcrypt')
const _ = require('underscore')
const Usuario = require('../models/usuario')
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion')
const app = express()


// app.get('/', function (req, res) {
//   res.json('Hello World')
// })


app.get('/usuario', verificaToken ,(req, res)=> {

	let desde = req.query.desde || 0;
	desde = Number(desde);

	let limite = req.query.limite || 0;
	limite = Number(limite);

  	Usuario.find({ estado: true }, 'nombre email role estado google img')
  		.skip(desde)
  		.limit(limite)
  		.exec( (err, usuarios) =>{
  			if (err){
				return res.status(400).json({
					ok: false,
					err: err
				})
			}

			Usuario.count({ estado: true }, (err, conteo)=>{
				res.json({
					ok: true,
					usuarios: usuarios,
					cuantos: conteo
				});	
			});	
  		})
})


app.post('/usuario', [verificaToken, verificaAdminRole], function (req, res) {
	let body = req.body;

	let usuario = new Usuario({
		nombre: body.nombre,
		email: body.email,
		password: bcrypt.hashSync(body.password, 10),
		role: body.role
	})

	usuario.save( (err, usuarioDB) =>{
		if (err){
			return res.status(400).json({
				ok: false,
				err: err
			})
		}

		res.json({
			ok: true,
			usuario: usuarioDB
		})
	});
})


app.put('/usuario/:id', [verificaToken, verificaAdminRole], function (req, res) {
	let id = req.params.id;
	let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

	Usuario.findByIdAndUpdate( id, body, {new: true, runValidators: true}, (err, usuarioDB) => {
		if (err){
			return res.status(400).json({
				ok: false,
				err: err
			})
		}
		res.json({
		  	ok: true,
		  	usuario:usuarioDB
		})
	})
  	
})


app.delete('/usuario/:id', [verificaToken, verificaAdminRole], function (req, res) {
	let id = req.params.id;

	// Usuario.findByIdAndRemove( id, (err, usuarioBorrado)=>{
	// 	if (err){
	// 		return res.status(400).json({
	// 			ok: false,
	// 			err: err
	// 		})
	// 	}
	// 	if (!usuarioBorrado){
	// 		return res.status(400).json({
	// 			ok: false,
	// 			err: {
	// 				message: 'Usuario no encontrado'
	// 			}
	// 		})
	// 	}
	// 	res.json({
	// 		ok: true,
	// 		usuario: usuarioBorrado
	// 	})
	// })

	let cambiarEstado = {
		estado: false
	}

	Usuario.findByIdAndUpdate( id, cambiarEstado, {new: true} , (err, usuarioDB) => {
		if (err){
			return res.status(400).json({
				ok: false,
				err: err
			})
		}
		res.json({
		  	ok: true,
		  	usuario:usuarioDB
		})
	})
})


module.exports = app;

