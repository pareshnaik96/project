const express = require("express")

const blogModel = require("../Models/blogModel")
const authorModel = require("../Models/authorModel")

let emailRegex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;

let createAuthor = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length != 0) {

            if (!data.fname) return res.status(400).send({ status: false, msg: "Please enter the required field fName" })
            if (!data.lname) return res.status(400).send({ status: false, msg: "Please enter the required field lName" })
            if (!data.title) return res.status(400).send({ status: false, msg: "Please enter the required field title" })
            if (!data.email) return res.status(400).send({ status: false, msg: "Please enter the required field email" })
            if (!data.password) return res.status(400).send({ status: false, msg: "Please enter the required field password" })

            if (data.fname.length <= 3) return res.status(400).send({ status: false, msg: "fName length should be min 3" })
            if (data.password.length <= 6) return res.status(400).send({ status: false, msg: "password length should be min 6" })

            if (!emailRegex.test(data.email))
                return res.status(400).send({ status: false, msg: "please provide valid email" })

            const usedEmail = await authorModel.findOne({email:data.email })
            if (usedEmail)
                return res.status(400).send({ status: false, msg: "Email Id already exists" })
           

            let saveData = await authorModel.create(data);
            res.status(201).send({ status: true, msg: saveData });
        }
        else {
            res.status(400).send({ status: false, msg: "NO USER INPUT" })
        }

    }
    catch (err) {
        console.log(err.message)
        res.status(500).send({ status: false, msg: err.message });
    }
}
module.exports.createAuthor = createAuthor
