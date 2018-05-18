const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const jwtValidator = require('express-jwt');
const config = require('../../config.json');
const connection =  require('../database/config');

exports.checkAuth = jwtValidator({secret: config.auth.JWT_KEY, requestProperty: 'authData' });

exports.login = (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;
    connection.query("SELECT email,password,name,activeUser,adminUser,userId FROM users WHERE email = ?", [email], (err, results, fields) => {
        if(err) {
            return res.status(500).json({
                message: "Cannot log in",
                error: err
            });
        }
        if(results.length == 0 ) {
            return res.status(401).json({
                message: "unauthorized"
            });
        } else {
            const storedPwd = results[0].password;
            const storedUsername = results[0].name; 
            const isActive = results[0].activeUser;
            const isAdmin = results[0].adminUser;
            bcrypt.compare(password, storedPwd, (err, result) => {
                if(err) {
                    return res.status(401).json({
                        message: 'Login failed!'
                    });
                }
                if(result) {
                    const token = jwt.sign(
                        {
                            email: email,
                            name: storedUsername,
                            isAdmin: isAdmin,
                            isActive: isActive

                        },
                        config.auth.JWT_KEY,
                        {
                            expiresIn: "1h"
                        }
                    );
                    return res.status(200).json({
                        message: 'auth successful',
                        token: token
                    });
                }
                return res.status(401).json({
                    message: 'Login failed!'
                });
            });
        }
    });
}
