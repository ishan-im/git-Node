const Category = require('../models/category')

const Link = require('../models/link')

const slugify = require('slugify')

const formidable = require('formidable')

const { v4: uuidv4 } = require('uuid');

const AWS = require('aws-sdk')

const fs = require('fs')

const { Buffer } = require('node:buffer');



//AWS s3

const s3 = new AWS.S3({

    
    accessKeyId: process.env.AMAZON_ACCESS_KEY_ID,
    secretAccessKey: process.env.AMAZON_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION 

})


exports.create = (req,res) =>{

    let form = new formidable.IncomingForm()

    form.parse(req, (err,fields, files)=>{

        if(err){

            console.log(err);

            return res.status(400).json({

                error: "Image could not upload"
            })

        }

        // console.table(fields,files);

        const {name, content} = fields

        const {image} = files

        const slug = slugify(name)


        let category = new Category({name, content, slug})

        if(image.size > 2000000){
            return res.status(400).json({
                error: 'Image should be less than 2 mb:('
            })
        }


        //upload to s3

        const params = {

            Bucket: 'gitnode-bucket',
            Key: `category/${uuidv4()}`,
            Body: fs.readFileSync(image.filepath),
            ACL:  "public-read",
            ContentType: 'image/jpg'

        }

        console.log(params);


        s3.upload(params, (err,data)=>{

            if(err){

                console.log(err);

                return res.status(400).json({

                    error: 'Upload to s3 failed'

                })
            }

            console.log('AWS upload res data', data);

            category.image.url = data.Location

            category.image.key = data.Key

            console.log(category.image.url, 1000 , category.image.key);


            //save to database

            category.save((err,success)=>{

              if(err){

                    console.log(err);
    
                    return res.status(400).json({
    
                        error: 'Save to Database failed'
    
                    })
                }

                return res.json(success)

            })

        })

    })



}


exports.createCategory = (req,res)=>{


    const {name,content,image} = req.body

    // image data

    const base64Data = new Buffer.from(image.replace(/^data:image\/\w+;base64,/,''),'base64');

    console.log('FROM CREATE CATEGORy function: ', base64Data);

    // console.table(name,base64Data,content)

    const type = image.split(';')[0].split('/')[1]


    const slug = slugify(name)


    let category = new Category({name, content, slug})


    //upload to s3

    const params = {

        Bucket: 'gitnode-bucket',
        Key: `category/${uuidv4()}.${type}`,
        Body: base64Data,
        ACL:  "public-read",
        ContentEnCoding: 'base64',
        ContentType: `image/${type}`

    }


    console.log('LOG FROM create category function: ',params, name);


    s3.upload(params, (err,data)=>{

        if(err){

            console.log(err);

            return res.status(400).json({

                error: 'Upload to s3 failed'

            })
        }

        console.log('AWS upload res data', data);

        category.image.url = data.Location

        category.image.key = data.Key
        
        category.postedBy = req.auth._id

        console.log(category.image.url, " " , category.image.key, " ",category.postedBy);


        


        //save to database

        category.save((err,success)=>{

          if(err){

                console.log(err);

                return res.status(400).json({

                    error: 'Save to Database failed'

                })
            }

            return res.json(success)

        })

    })

}




exports.list = (req,res)=>{

    Category.find({}).exec((err,data)=>{

        if(err){

            console.log(err);

            return res.status(400).json({
                error: 'category could not load :('
            })

        }
        
        console.log("category data server: ",data);
        res.json(data);
    })
    
}


exports.read = (req,res)=>{

    const {slug} = req.params

    let limiT = (req.body.limit) ? parseInt(req.body.limit) : 10

    let skiP = (req.body.skip) ? parseInt(req.body.skip) : 0


    Category.findOne({slug})
    .populate('postedBy', '_id name userName')
    .exec((err,category)=>{


        if(err){
            return res.status(400).json({

                error: 'Could not load category'

            })
        }

        // res.json(category)

        Link.find({categories: category})
        .populate('postedBy', '_id name userName')
        .populate('categories', 'name')
        .sort({createdAt: -1})
        .limit(limiT)
        .skip(skiP)
        .exec((err, links)=>{

            if(err){

                return res.status(400).json({

                    error: 'Could not load links of category'

                })
            }


            res.json({category, links})
        })
    })


    
}



exports.update = (req,res)=>{

    const {slug} = req.params

    const {name, image, content} = req.body

    //Upload new image

    const base64Data = new Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64');

    console.log('FROM update CATEGORY function: ', base64Data);

    // console.table(name,base64Data,content)

    const type = image.split(';')[0].split('/')[1]

    Category.findOneAndUpdate({slug}, {name, content}, {new: true}).exec((err, update)=>{

       if(err){

            console.log(err);

            res.status(400).json({

                error: 'Could not find category to update'

            })
       } 

       console.log('Updated', update);

        // image data

         
    

       if(image){

          

        //remove existing image

        const deleteParams = {

            Bucket: 'gitnode-bucket',
            Key: `${update.image.key}`,

        }


        s3.deleteObject(deleteParams, (err,success)=>{

            if(err){
                console.log('S3 DELETE ERROR :( ', err);
            }

            else{
                console.log('S3 Deleted during Update ', update);
             }
        })

       

        const params = {

            Bucket: 'gitnode-bucket',
            Key: `category/${uuidv4()}.${type}`,
            Body: base64Data,
            ACL:  "public-read",
            ContentEnCoding: 'base64',
            ContentType: `image/${type}`
        
        }

        s3.upload(params, (err,data)=>{

            if(err){
    
                console.log(err);
    
                return res.status(400).json({
    
                    error: 'Upload to s3 failed'
    
                })
            }
    
            console.log('AWS upload res data', data);
    
            update.image.url = data.Location
    
            update.image.key = data.Key
            
            
    
            console.log(update.image.url, " " , update.image.key, " ",update.postedBy);
    
    
            
    
    
            //save to database
    
            update.save((err,success)=>{
    
              if(err){
    
                    console.log(err);
    
                    return res.status(400).json({
    
                        error: 'Save to Database failed'
    
                    })
                }
    
                 res.json(success)
    
            })
    
        })
       
       }

       else{

        res.json(update)

       }
        

    })


    
}


 




exports.remove = (req,res)=>{

    const {slug} = req.params

    Category.findOneAndRemove({slug}).exec((err,data)=>{

        if(err){
    
            console.log('Remove category: ',err);

            return res.status(400).json({

                error: 'Remove category  failed:( '

            })
        }

         //remove existing image

         const deleteParams = {

            Bucket: 'gitnode-bucket',
            Key: `${data.image.key}`,

        }


        s3.deleteObject(deleteParams, (err,success)=>{
            if(err){
                console.log('S3 DELETE ERROR :( ', err);
            }

            else{
                console.log('S3 Deleted during Delete', data);
             }
        })


        res.json({

            message:'Category deleted successfully'
        })
    
    })

    
}