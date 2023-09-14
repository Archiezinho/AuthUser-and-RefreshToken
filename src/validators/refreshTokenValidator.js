const { checkSchema } = require('express-validator');

module.exports = {
    addAction: checkSchema({
        refreshToken:{
            notEmpty: true
        }
    })
};