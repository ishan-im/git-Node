const {check} = require('express-validator'); 

exports.createCategoryValidator =  [

        check('name')
            .not()
            .isEmpty()
            .withMessage('Name is required'),

        check('image')
            .isEmpty()
            .withMessage('Image is required'),

        check('content')
            .isLength({ min: 20 })
            .withMessage('Conent is required and should be 20 characters long')
    ];



    exports.updateCategoryValidator =  [

        check('name')
            .not()
            .isEmpty()
            .withMessage('Name is required'),

        check('image')
            .isEmpty()
            .withMessage('Image is required'),

        check('content')
            .isLength({ min: 20 })
            .withMessage('Conent is required')
    ];
