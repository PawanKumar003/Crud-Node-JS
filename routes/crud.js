var express = require('express');
var router = express.Router();
const crudController = require("../controller/crudcontroller");
const {check} = require("express-validator");


function logvalid(){
  return[
    check("email",'Email is not Correct').isEmail(),
    check("password")
      .isLength({min:4, max:8}).withMessage("Password Must Be 4 to 8 Corector")
      .isAlphanumeric().withMessage("Spacil crator are not allowed")
  ]
};

function signvalid(){
  return[
    check('name',"Name is not correct").matches(/^[a-zA-Z ]+$/,"g"),
    check('email','Email Id is not correct').isEmail(),
    check("password")
      .isLength({min:4 , max:8}).withMessage("Password must be 4 to 8 corecter")
      .isAlphanumeric().withMessage("spacial cracter are not allowed"),
    check("cpassword")
      .isLength({min:4 , max:8}).withMessage("Password must be 4 to 8 corecter")
      .isAlphanumeric().withMessage("spacial cracter are not allowed")
  ]
}

function cutomervalid(){
  return[
    check('name',"Name is not correct").matches(/^[a-zA-Z ]+$/,"g"),
    check('email','Email Id is not correct').isEmail(),
    check('phone','phone  number is not correct').isMobilePhone('en-IN'),
    check('adress','adress is not correct').notEmpty()
    
  ]
};





/* GET users listing. */
router.get('/', function(req, res) {
  res.render('crud/crud',{title: "Hello world"});

});

router.get("/getapi",crudController.custapi);

router.get('/login',crudController.login);

router.get('/signup',crudController.signup);

router.post('/login',logvalid(),crudController.postLogin);

router.post('/signup',signvalid(),crudController.postSign);

router.get('/dashboard',crudController.dashboard)
router.get('/addcustomer',crudController.addcutomer)
router.post('/addcustomer',cutomervalid(),crudController.addcutomerpost)

router.post('/updatecustomer',crudController.updateCustomer);
router.post('/getcustomer',crudController.getCustomer);
// router.get('/test',crudController.test);
router.get('/delete/:id',crudController.deleteData)

// router.get('/logout',crudController.logout);

module.exports = router;