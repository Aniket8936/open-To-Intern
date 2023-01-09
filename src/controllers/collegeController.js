 const collegeModel = require('../models/collegeModel')
const validator = require('validator')
const isValid = function(value) {
    if (typeof value=== "undefined" || typeof value ===null) return false
    if (typeof value=== "string" &&  value.trim().length===0) return false
    if (typeof value=== "number" &&  value.trim().length===0) return false
    return true
}
const valid = /^https?:\/\/.*\.(?:png|jpg|jpeg)/

const createCollege = async function(req, res) {

    try {
        const { name, fullName, logoLink } = req.body

        if (Object.keys(req.body).length == 0) {
            return res.status(400).send({ status: false, message: "Kindly enter your details." })
        }


        let final = {}
        if (!isValid(name)) {
            return res.status(400).send({ status: false, message: "Invalid College name or college name is not mentioned." })
        }
        if (!/^[a-zA-Z]{2,10}$/.test(name)) {
            return res.status(400).send({ status: false, message: "Invalid College Name" })
        }
        const duplicateName = await collegeModel.findOne({ name: name.toLowerCase() }) 
        if (duplicateName) {
            return res.status(400).send({ status: false, message: "The college name is already there, you can directly apply for the internship." })
        }
        final.name = name.toLowerCase()


        if (!isValid(fullName)) {
            return res.status(400).send({ status: false, message: "Invalid College full name or College full name is not mentioned." })
        }
        if (!/^[a-zA-Z ,]{3,50}$/.test(fullName)) {
            return res.status(400).send({ status: false, message: "Invalid College full name" })
        }
        const duplicate = await collegeModel.findOne({ fullName: fullName })
        if (duplicate) {
            return res.status(400).send({ status: false, message: "The college full name is already there, you can directly apply for the internship." })
        }
        final.fullName = fullName


        if (!isValid(logoLink)) {
            return res.status(400).send({ status: false, message: "Invalid College Logolink or College Logolink is not mentioned." })
        }
        if (!valid.test(logoLink) || !validator.isURL(logoLink)) {
            return res.status(400).send({ status: false, message: "The logoLink is not valid." })
        }
        final.logoLink = logoLink

        let saveData = await collegeModel.create(final)

        return res.status(201).send({ status: true, data: saveData})

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}
  module.exports.createCollege=createCollege
