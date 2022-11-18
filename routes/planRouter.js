const express = require("express")
const router = express.Router()
const { 
    getAllPlans, 
    getPlan, 
    createPlan, 
    updatePlan, 
    deletePlan 
} = require("../controllers/planController")


router.route("/")
    .get(getAllPlans)
    .post(createPlan)


router.route("/:id")
    .get(getPlan)
    .put(updatePlan)
    .delete(deletePlan)

module.exports = router