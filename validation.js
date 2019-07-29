const Joi=require('@hapi/joi');



const registerValidation=(data)=>{

    const schema={
        firstName :Joi.string().min(6).required(),
        lastName :Joi.string().min(6).required(),
        userName :Joi.string().min(6).required(),
        phone :Joi.string().required(),
        email :Joi.string().min(8).required().email(),
        password :Joi.string().min(6).required()
    }

    return Joi.validate(data,schema)

}



const loginValidation=(data)=>{

    const schema={
        userName :Joi.string().required(),
        password :Joi.string().min(6).required()
    }

    return Joi.validate(data,schema)

}

module.exports.registerValidation=registerValidation;
module.exports.loginValidation=loginValidation;
