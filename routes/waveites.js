var express = require('express');
var router = express.Router();
const {check} = require("express-validator");
const waveitesController = require("../controller/waveitesController");





function loginpro(){
    return[
        check("email","Your Email is Not Correct").isEmail(),
        check("password")
        .isLength({min:4,max:12}).withMessage("Password Must be 4 character")
    ]
}

function signpro(){
    return[
        check("name","Your Namw is Not Correct Format").matches(/^[a-zA-Z ]+$/,'g'),
        check("email","Your Email is Not Correct Format").isEmail(),
        check("phone","Your Phone Number is Wrong").isMobilePhone("en-IN"),
        check("password").isLength({min:4, max:8}).withMessage("Password Must Be 4 to 8 Character"),
        check("cpassword").isLength({min:4, max:8}).withMessage("Password Must Be 4 to 8 Character")
        // .matches("password").withMessage("password must be matched.")
        
    ]
}
function custpro(){
    return[
        check("name","Your Namw is Not Correct Format").matches(/^[a-zA-Z ]+$/,'g'),
        check("email","Your Email is Not Correct Format").isEmail(),
        check("phone","Your Phone Number is Wrong").isMobilePhone("en-IN"),
        // .matches("password").withMessage("password must be matched.")
        
    ]
}

function profilepro(){
    return[
        check("title","Your Not Correct Format").notEmpty(),
        check("description","Your decription is to short").notEmpty(),
        check("myfile","choose").notEmpty(),
        // .matches("password").withMessage("password must be matched.")
        
    ]

}


router.get("/", function(req,res){
    res.render("project/waveites",{title:"hello world wave"});
});

router.get('/login',waveitesController.login);
router.get('/signup',waveitesController.singup);

router.post('/login',loginpro(),waveitesController.loginProcess);

router.post('/signup',signpro(),waveitesController.signprocess);

router.get('/dashboard',waveitesController.dashboard);
router.get('/customer',waveitesController.customer);
router.get('/logout',waveitesController.logout);
router.post('/customer',custpro(),waveitesController.customerpost);
router.post('/getcustomers',waveitesController.getCustomer1);
router.post("/upcustomer",waveitesController.upcustomer1);
router.get("/delete/:id",waveitesController.delete1)
router.get("/getapi",waveitesController.getapi)
router.get("/profile",waveitesController.profile)
router.post("/profile",profilepro(),waveitesController.profilepros)




module.exports = router;