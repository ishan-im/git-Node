const User = require('../models/user')

const Link = require('../models/link')

exports.read = (req,res)=>{

    

    User.findOne({_id: req.auth._id}).exec((err,user)=>{

        if(err){
            console.log(err);
            return res.status(400).json({
                
                error: 'User Not found :('

            })

        }

        Link.find({postedBy : user})
            .populate('categories', 'name slug')
            .populate('postedBy', 'name')
            .sort({createdAt: -1})
            .exec((err,links)=>{

                if(err){
                    console.log(err);
                    return res.status(400).json({
                        
                        error: 'Link Not found :('
        
                    })
        
                }

                user.hashed_password = undefined

                user.salt = undefined

                res.json({user, links})

            })

    })

    // return res.json(req.profile)

}