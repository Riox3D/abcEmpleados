import jwt from 'jsonwebtoken'
import { config } from '../config/config.js'
import { menusByRole, autenticarUsuario, obtenerUsuarioPorId } from '../utils/usersDB.js'
import { authenticate } from 'ldap-authentication';
import { verifyGoogleToken } from '../utils/googleAuth.js';
import { validationResult } from 'express-validator'




export const login = async (req, res) => {

  const { idToken } = req.body;


  let payload
  try {
    payload = await verifyGoogleToken(idToken);
  } catch (error) {
    console.error('Error al verificar token de Google:', error.message);
    return res.status(403).json({ message: 'Token inválido' });
  }
  if (payload.email == null || payload.email == undefined || payload.email == '') {
    return res.status(401).send('Error en el servdior de google');
  }
  //Despues de optener el correo ir a buscar al usuario
  try {
    const user = await autenticarUsuario(payload);

    if (!user) {
      return res.status(401).json({ message: 'Usuario o contraseña inválidos' })
    }
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, numEmp: user.numEmp }, config.JWT_SECRET, { expiresIn: '8h' })
    await res.cookie('tokenjson', token, {
      httpOnly: true,
      secure: config.cookieSecure,
      sameSite: config.varSamSite, // 🔹 Para permitir envío cross-site
      maxAge: 8 * 60 * 60 * 1000
    })

    res.json({
      message: 'Login exitoso', user: {
        id: user.id,
        name: user.name,
        numEmp: user.numEmp,
        email: user.email,
        role: user.role,
      }
    })
  } catch (error) {
    console.error('Error en autenticación:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}
// No necesitas 'config' si JWT_SECRET viene directamente de process.env
// const config = require('../../config'); // Si lo tienes, asegúrate de que config.JWT_SECRET apunte a process.env.JWT_SECRET

export const loginAD = async (req, res) => {
  // Validación de datos requeridos
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;
  console.debug('In login AD, credentiasl: ', req.body);
 

  const options = {
    ldapOpts: {
      url: config.ldapUrl,
      reconnect: true,
    },
    userDn: `${username}@${config.ldapDomain}`,
    userPassword: password,
    userSearchBase: config.ldapUserSearchBase,
    usernameAttribute: 'sAMAccountName',
    username,
    attributes: ['displayName', 'mail', 'sAMAccountName'],
  };

  try {
    // Paso 1: Autenticación LDAP
    const userLDAP = await authenticate(options);


    // Después de obtener el correo ir a buscar al usuario
    

    const payload = {
      email: userLDAP.mail
    };
    const user = await autenticarUsuario(payload);

    if (!user) {
      return res.status(401).json({ message: 'El Active Directory no tiene tu correo almacenado. Inicia sesión con Google.' });
    }
   
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, numEmp: user.numEmp }, config.JWT_SECRET, { expiresIn: '8h' });
    await res.cookie('tokenjson', token, {
      httpOnly: true,
      secure: config.cookieSecure,
      sameSite: config.varSamSite, // 🔹 Para permitir envío cross-site
      maxAge: 8 * 60 * 60 * 1000
    });

    res.json({
      message: 'Login exitoso', user: {
        id: user.id,
        name: user.name,
        numEmp: user.numEmp,
        email: user.email,
        role: user.role
      }
    });
  
   
  } catch (error) {
    console.error('Error en autenticación:', error.message);
  
    const mensaje = error.message || '';
    
    if (mensaje.includes('52e')) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos.' });
    } else if (mensaje.includes('525')) {
      return res.status(401).json({ message: 'Usuario no encontrado en el Active Directory.' });
    } else if (mensaje.includes('530')) {
      return res.status(403).json({ message: 'No se permite iniciar sesión en este momento.' });
    } else if (mensaje.includes('531')) {
      return res.status(403).json({ message: 'No se permite iniciar sesión desde esta ubicación.' });
    } else if (mensaje.includes('532')) {
      return res.status(403).json({ message: 'La contraseña ha expirado. Debe actualizarla.' });
    } else if (mensaje.includes('533')) {
      return res.status(403).json({ message: 'La cuenta está deshabilitada. Contacta al administrador.' });
    } else if (mensaje.includes('701')) {
      return res.status(403).json({ message: 'La cuenta ha expirado.' });
    } else if (mensaje.includes('773')) {
      return res.status(403).json({ message: 'Debe cambiar su contraseña antes de iniciar sesión.' });
    } else if (mensaje.includes('775')) {
      return res.status(403).json({ message: 'La cuenta está bloqueada. Contacta al administrador.' });
    }
  

    return res.status(500).json({ message: 'Error interno del servidor. Contacta al administrador.' });
  }
  
  }
  

export const me = async (req, res) => {
  try {

    const user = await obtenerUsuarioPorId(req.user.id); // <-- el ID viene del token JWT decodificado
    console.log('me: ',user)
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({
      id: user.id,
      name: user.name,
      role: user.role,
      email: user.email,
      numEmp: user.numEmp,
    });

  } catch (error) {
    console.error('Error en /me:', error.message);
    res.status(500).json({ message: 'Error al obtener información del usuario' });
  }
};

export const logout = (req, res) => {
  res.clearCookie('tokenjson')
  res.json({ message: 'Sesión cerrada' })
}


export const getMenuByRole = (req, res) => {

  const role = req.user?.role
  console.log('getMenuByRole: ',role)
  if (!role || !menusByRole[role]) {
    return res.status(403).json({ message: 'Rol no autorizado' })
  }
  res.json(menusByRole[role])
}
