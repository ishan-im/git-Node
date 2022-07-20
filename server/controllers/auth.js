const User = require('../models/user')
const Link = require('../models/link')

const AWS = require('aws-sdk')

const jwt = require('jsonwebtoken')

const { expressjwt: expressJwt } = require('express-jwt')

const { nanoid } = require('nanoid')

const regiterEmailParams = require('../helpers/email')


const _ = require('lodash')


AWS.config.update(
    {
        accessKeyId: process.env.AMAZON_ACCESS_KEY_ID,
        secretAccessKey: process.env.AMAZON_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION 
    }
)

const ses = new AWS.SES({ apiVersion: '2010-12-01'})


exports.registerController = (req, res,next) => {

   console.log(req.body);

   const {name, email, password, categories} = req.body

   console.log('name email password categories: ',name, email, password, categories );

   // check if user exist in our database

   User.findOne({email}).exec((err,user)=>{

       if(user){
         
        return res.status(400).json({
            
            error: 'Email is already taken :('
        })

       }

       //generate web token with user name email and password

        const token = jwt.sign({name,email,password,categories}, process.env.JWT_ACCOUNT_ACTIVATION, {
           expiresIn: '10m'
       });

       //send email

       const params = regiterEmailParams(email,token)

      
       const sendEmailonRegister = ses.sendEmail(params).promise()

    
       sendEmailonRegister.then(data=>{
           console.log('email submitted to SES',data);
           res.json({

               message: `Email has been sent to ${email}, Follow the instructions to complete registration`
           })
       })
       .catch(error=>{
    
            console.log('ses email on register', error);

            res.json({

                message: `could not complete your registration, please try again`
                
            })
    
       })
    

   })

  
};






// activate new register



 exports.registerActivate = (req,res) =>{

    const {token} = req.body

    console.log('token from register activate function: ',token);

    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function(err, decoded){

        if(err){

            console.log('Error from link expired: ', err );

            return res.status(401).json({

                error: 'Link Expired, Try again'

            })
        }


        const {name, email, password,categories} = jwt.decode(token);

        console.log(name,email, password,categories);

        const userName = nanoid() 

        
        console.log('Username from register activate: ',userName);

        User.findOne({email}).exec((err,user)=>{

            // if user already exist : 

            if(user){

                return res.status(401).json({

                    error:'Email is already taken'

                })
            }

            // create new user :

            const newUser = new User({ name, userName, email, password,categories})

            newUser.save((err, result)=>{

                if(err){

                    console.log('error from activate user: ', err);

                    return res.status(401).json({

                        error: 'Error saving user in database, try later'

                    })

                    //

                }

                return res.json({

                    message: 'Registration complete. Please login'

                })

            })


        })
    })
 

}





// Login 



exports.registerLogin = (req,res)=>{

    const {email, password} = req.body

    

    User.findOne({email}).exec((err,user)=>{

        if(err || !user){
            return res.status(400).json({
                error: ' User with that email does not exist, Please Sign Up'
            })
        }

        if(!user.authenticate(password)){
            return res.status(400).json({
                error:'Email and password do not match'
            })
        }

        //generate token and send to client

        const token = jwt.sign({_id: user._id},process.env.JWT_SECRET,{ expiresIn: '7d' })

        console.log(token);

        const {_id, name,email,role} = user

        return res.json({

            token,

            user: {_id, name,email,role}

        })

    })

}




// secure sign in 

exports.requireSignIn = expressJwt({secret: process.env.JWT_SECRET, algorithms: ["HS256"]})


exports.authMiddleware = (req, res, next)=>{

    const authUserId = req.auth._id;

    console.log(authUserId)

    

    User.findOne({ _id: authUserId }).exec((err, user) => {

        if (err || !user) {

            return res.status(400).json({

                error: 'User not found'

            });
        }
        
        req.profile = user;


        next();

    })


}






exports.adminMiddleware = (req,res,next)=>{

    const adminUserId = req.auth._id;

    console.log(adminUserId)

    User.findOne({_id: adminUserId}).exec((err,user)=>{

        if(err || !user){

            return res.status(400).json({

                error: "Admin not found :("

            })

        }


        if(user.role !== 'admin'){

            return res.status(400).json({

                error: 'Admin access denied :('

            })

        }

        req.profile = user

        next()

    })


}



exports.canUpdateDeleteLink = (req,res,next)=>{

    const {id} = req.params

    Link.findOne({_id:id}).exec((err,data)=>{

        if(err){

        console.log('ERROR from canUpdateDeleteLink function: ', err);
            return res.status(400).json({

                error: 'Could not find link :('
            })            
        }

        let authorizedUser = data.postedBy._id.toString() === req.auth._id.toString()

        if(!authorizedUser){

            return res.status(400).json({

                error: 'You are not authorized :('

            })

        }

        next()

    })


}




exports.forgotPassword = (req,res) =>{
    
    const {email} = req.body;

// check if user exists with that email



 User.findOne({email}).exec((err, user) => {

    

    if (err || !user) {

        console.log(err);

        return res.status(400).json({

            error: 'User with that email does not exist'

        });
    }
    // generate token and email to user

    console.log('forget pssword user: ', user);

    const token = jwt.sign({ name: user.name , email}, process.env.JWT_RESET_PASSWORD, { expiresIn: '10m' });

    console.log('token:', token);

    // send email
    const params = forgotPasswordEmailParams(email, token);

    // populate the db > user > resetPasswordLink


    


    // const sendEmail = ses.sendEmail(params).promise();

    // sendEmail
    //     .then(data => {
    //         console.log('ses reset pw success', data);

    //         return res.json({
    //             message: `Email has been sent to ${email}. Click on the link to reset your password`
    //         });
    //     })
    //     .catch(error => {
    //         console.log('ses reset pw failed', error);
    //         return res.json({
    //             message: `We could not vefiry your email. Try later.`
    //         });
    //     })

     return user.updateOne({ resetPasswordLink: token }, (err, success) => {

        if (err) {

            console.log(err);

            return res.status(400).json({

                error: 'Password reset failed. Try later.'

            });
        }

        const sendEmail = ses.sendEmail(params).promise();

        sendEmail
            .then(data => {
                console.log('ses reset pw success', data);

                return res.json({
                    message: `Email has been sent to ${email}. Click on the link to reset your password`
                });
            })
            .catch(error => {
                console.log('ses reset pw failed', error);
                return res.json({
                    message: `We could not vefiry your email. Try later.`
                });
            });
    });

});

}


exports.resetPassword = (req,res)=>{

    const {resetPasswordLink, newPassword} = req.body

    if(resetPasswordLink){

        //check for expiary

        jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, (error,success)=>{

            if(error){

                
                console.log(error);
    
                return res.status(400).json({
    
                    error: 'Link expired ,Try later.'
    
                });

            }

            User.findOne({resetPasswordLink}).exec((error,user)=>{

                if (error || !user) {
    
                    console.log(error);
        
                    return res.status(400).json({
        
                        error: 'Invalid Token. Try later.'
        
                    });
                }


                const updatedFields = {

                    password: newPassword,
                    resetPasswordLink: ""
                }


                user = _.extend(user, updatedFields)


                user.save((error,result)=>{


                    if (error) {
    
                        console.log(error);
            
                        return res.status(400).json({
            
                            error: 'Password reset failed. Try later.'
            
                        });
                    }


                    res.json({
                        message: 'Password reset success, login with new passowrd'
                    })

                })
                

    
            })
    


        })

      
    }

}









const forgotPasswordEmailParams = (email, token)=>{

    return {
        Source: process.env.EMAIL_FROM,
        Destination: {
            ToAddresses: [email]
        },
        ReplyToAddresses: [process.env.EMAIL_FROM],
        Message: {
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: `
                        <html>
                            <h1>Reset Password Link</h1>
                            <p>Please use the following link to reset your password:</p>
                            <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
                        </html>
                    `
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: 'Change your password'
            }
        }
    };

}