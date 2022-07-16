const Link = require('../models/link')
const User = require('../models/user')
const Category = require('../models/category')

const slugify = require('slugify')

const AWS = require('aws-sdk')

const linkPublishedParams = require('../helpers/email')


AWS.config.update(
    {
        accessKeyId: process.env.AMAZON_ACCESS_KEY_ID,
        secretAccessKey: process.env.AMAZON_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION 
    }
)

const ses = new AWS.SES({ apiVersion: '2010-12-01'})



//create, list, read, update, delete


exports.createLink = (req,res)=>{

    const {title, url, categories, type, medium} = req.body

    


    const slug = (title)

    let link = new Link({title, url, categories, type, medium, slug})

    //user

    link.postedBy = req.auth._id

    console.table({title,url,categories,type,medium,slug,})

    //categories

    // let arrayOfCategories = categories && categories.split(',')

    // link.categories = arrayOfCategories


    // save link to db

    link.save((err,data)=>{

        if(err){

            console.log('Error from create link, save: ',err);

            res.status(400).json({

                error: 'Saving Link Failed :('

            })

        }

        res.json(data)

        //find all users in this category

        User.find({Category: {$in : categories}}).exec((err,user)=>{

            if(err){

                console.log('Error finding user on  sending mail on link post : ',err);
    
                res.status(400).json({
    
                    error: 'Sending email  Failed :('
    
                })

                Category.find({_id: {$in : categories}}).exec((err,result)=>{

                   data.categories = result 


                   for(let i=1; i<user.length; i++){

                    const params = linkPublishedParams(user[i].email, data)

                    const sendEmail = ses.sendEmail(params).promise()

                    sendEmail

                    .then(success => {

                        console.log('Email submitted to ses: ', success);

                        return 
                    })
                    .catch(failure=>{

                        console.log('Email submitted to ses failure:( : ', failure);

                        return

                    })

                   }

                })
    
            }

        })


    })
 

}


exports.listLink = (req,res)=>{

    let limiT = (req.body.limit) ? parseInt(req.body.limit) : 10

    let skiP = (req.body.skip) ? parseInt(req.body.skip) : 0

    Link.find({})
    .populate('postedBy', 'name')
    .populate('categories', 'name, slug')
    .sort({createdAt: -1})
    .skip(skiP)
    .limit(limiT)
    .exec((err,data)=>{

        if(err){

            console.log('Error from list link: ',err );
            
            return res.status(400).json({

                error: 'Could not list link'

            })
        }

        res.json({data})
    })
    



}


exports.readLink = (req,res)=>{

    const {id} = req.params

    Link.findOne({_id: id}).exec((err,data)=>{

        if(err){

            console.log('Error from delete link: ', err );

            return res.status(400).json({

                error: 'Could not findLink :('

            })

        }

        res.json(data)

    })


    
}


exports.updateLink = (req,res)=>{

    const {id} = req.params

    const {title, url, categories, type, medium} = req.body

    const updatedContent = {title, url, categories, type, medium}

    Link.findOneAndUpdate({_id : id}, {title, url, categories, type, medium}, {new: true}).exec((err,updatedLink)=>{

        if(err){

            console.log('Error from update link: ', err );

            return res.status(400).json({

                error: 'Could not Update Link :('

            })

        }

        res.json(updatedLink)

    })


    
}


exports.deleteLink = (req,res)=>{

    const {id} = req.params

        Link.findOneAndRemove({_id :id}).exec((err,data)=>{

            if(err){

                console.log('Error from delete link: ', err );

                return res.status(400).json({
    
                    error: 'Could not Delete Link :('
    
                })
    
            }

            res.json({

                message: 'Link removed succesfully'

            })


        })
    
    
}


exports.clickCount = (req,res)=>{

    const {linkId} = req.body

    Link.findByIdAndUpdate(linkId, {$inc: {clicks: 1}}, {upsert: true, new: true}).exec((err,result)=>{

        if(err){

            return res.status(400).json({

                error: 'Could not update view count'

            })

        }

        return res.json(result)

    })

}