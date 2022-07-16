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
                                  <h1>New Link Published | gitnode.tech</h1 style="color:red;">
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
                                  <p><b>Unsubscribe here</b></p>
                                 
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