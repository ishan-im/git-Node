const {check} = require('express-validator'); 

exports.userRegisterValidator =  [
        check('name')
            .not()
            .isEmpty()
            .isLength({ min: 1 })
            .withMessage('Name is required'),
        check('email')
            .isEmail()
            .withMessage('Must be a valid email address'),
        check('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long'),
        check('categories')
            .isLength({ min: 6 })
            .withMessage('Pick at least one category')
    ];




 exports.userLoginValidator =  [
        
        check('email')
            .isEmail()
            .withMessage('Must be a valid email address'),
        check('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long')
            
    ];
    
    


    exports.userUpdateValidator =  [

        check('name')
            .not()
            .isEmpty()
            .isLength({ min: 1 })
            .withMessage('Name is required'),
       

    ];
