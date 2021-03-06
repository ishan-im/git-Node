const regiterEmailParams = (email, token)=>{

    return {

        Source: process.env.EMAIL_FROM,
    
        Destination: {
    
            ToAddresses: [email]
    
        },
    
        ReplyToAddresses:[process.env.EMAIL_TO],
    
        Message: {
    
            Body: {
                Html:{
                    Charset: 'UTF-8',
                    Data: `<html>
                                  <h1> Verify your email address</h1 style="color:red;">
                                  <p>Please use the following link to complete your registration:</p>
                                  <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
                            </html>`
                }
            },
    
            Subject: {
                Charset: 'UTF-8',
                Data: 'Complete your registration'  
    
            }
    
        }
       }
    

}

module.exports = regiterEmailParams



const linkPublishedParams = (email, data)=>{

    return {

        Source: process.env.EMAIL_FROM,
    
        Destination: {
    
            ToAddresses: [email]
    
        },
    
        ReplyToAddresses:[process.env.EMAIL_TO],
    
        Message: {
    
            Body: {
                Html:{
                    Charset: 'UTF-8',
                    Data: `<html>
                                  <h1 style="color:#2C3639">New Link Published | <a href="gitnode.tech" style="color:#FFC107; font-size: 30px; text-decoration: none">gitNode</a></h1>
                                  <p>A new link titled <b>${data.title}</b> has been published in the following categories</p>

                                  ${data.categories.map(c => {

                                    return `
                                    
                                            <div>

                                                <h2>${c.name}</h2>

                                                <img src="${c.image.url}" alt="${c.image.name}" style="height:50px;"/>

                                                <h3><a href="${process.env.CLIENT_URL}/links/${c.slug}">Check it out</a></h3>

                                            </div>

                                    `

                                  }).join('------------------------')}


                                  <br/>

                                  <P>Do not wish to receive further notification?</P>
                                  <p><b><a href="http://localhost:3000/user/profile/update">Unsubscribe here (Uncheck the category you don't want) </a></b></p>
                                 
                            </html>`
                }
            },
    
            Subject: {
                
                Charset: 'UTF-8',
                Data: 'New link published!'  
    
            }
    
        }
       }
    

}

module.exports = linkPublishedParams



// const forgotPasswordEmailParams = (email, token)=>{

//     return {
//         Source: process.env.EMAIL_FROM,
//         Destination: {
//             ToAddresses: [email]
//         },
//         ReplyToAddresses: [process.env.EMAIL_FROM],
//         Message: {
//             Body: {
//                 Html: {
//                     Charset: 'UTF-8',
//                     Data: `
//                         <html>
//                             <h1>Reset Password Link</h1>
//                             <p>Please use the following link to reset your password:</p>
//                             <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
//                         </html>
//                     `
//                 }
//             },
//             Subject: {
//                 Charset: 'UTF-8',
//                 Data: 'Change your password'
//             }
//         }
//     };

// }

// module.exports = forgotPasswordEmailParams

