const jwt = require('jsonwebtoken')

// =================
// Verificar token
// =================
let verificaToken = (req, res, next) => {
	let token = req.get('token');

	jwt.verify(token, process.env.SEED, (err, decoded) =>{
		
		if (err){
			return res.status(401).json({
				ok: false,
				err: {
					message: 'Token no valido',
					err: err,
					token: token,
					seed: process.env.SEED
				}
			})
		}

		req.usuario = decoded.usuario;
		next();
	})
};

// ===========================
// Verificar token para imagen
// ===========================
let verificaTokenImg = (req, res, next) =>{
	let token = req.query.token;

	jwt.verify(token, process.env.SEED, (err, decoded) =>{

		if (err){
			return res.status(401).json({
				ok: false,
				err: {
					message: 'Token no valido',
					err: err,
					token: token,
					seed: process.env.SEED
				}
			})
		}

		req.usuario = decoded.usuario;
		next();
	})
}


// =================
// Verificar admin role
// =================
let verificaAdminRole = (req, res, next) =>{
	let usuario = req.usuario;

	if (usuario.role === 'ADMIN_ROLE'){
		next();
	} else{
		return res.json({
			ok: false,
			err: {
				message: 'El usuario no es administrador'
			}
		})
	}
}

module.exports = {
	verificaToken,
	verificaAdminRole,
	verificaTokenImg
}