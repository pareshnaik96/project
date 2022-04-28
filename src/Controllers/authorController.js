
const authorModel = require("../Models/authorModel")

let emailRegex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;

let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,15}$/

// Author Creation
let createAuthor = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length != 0) {

            if (!data.fname) return res.status(400).send({ status: false, msg: "Please enter the required field fName" })
            if (!data.lname) return res.status(400).send({ status: false, msg: "Please enter the required field lName" })
            if (!data.title) return res.status(400).send({ status: false, msg: "Please enter the required field title" })
            if (!data.email) return res.status(400).send({ status: false, msg: "Please enter the required field email" })
            if (!data.password) return res.status(400).send({ status: false, msg: "Please enter the required field password" })

            if (data.fname.length <= 2) return res.status(400).send({ status: false, msg: "fName length should be min 2" })

            // Email Validation
            if (!emailRegex.test(data.email))
                return res.status(400).send({ status: false, msg: "Please provide valid email" })
            // Unique Email
            const usedEmail = await authorModel.findOne({ email: data.email })
            if (usedEmail)
                return res.status(400).send({ status: false, msg: "Email Id already exists" })
            // Password Validation
            if (!passwordRegex.test(data.password))
                return res.status(400).send({ status: false, msg: "Your password should contain min 6-15 characters, min 1 uppercase, 1 lowercase and 1 special character(@$!%*?&)" })

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
