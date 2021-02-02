const { json } = require("body-parser");
const https = require("https");
const customerModel = require("../modules/customerModel");
const { validationResult } = require("express-validator");
const { mongoose } = require("../database/db_crud");
var crudModal = require("../modules/module")
// const main = require("../main/main");
const bcrypt = require('bcrypt');
const { cleanInput } = require("../helpers/helper");
const request = require("request");

module.exports = {
    login: function (req, res) {
        res.render("./crud/login", { title: "Crud login page", err: '' });
    },

    signup: function (req, res) {
        res.render('crud/signup', { title: "crud signup page", err: '' });

    },

    postLogin: function (req, res) {
        req.session.login = false;
        var result = validationResult(req);
        var errs = result.mapped();
        if (Object.keys(errs).length > 0) {
            res.render('crud/login', { err: errs });
        } else {
            var loginData = req.body;
            for (var key of Object.keys(loginData)) {
                loginData[key] = cleanInput(loginData[key]);
            }
            var email = loginData.email
            var password = loginData.password
            var getData = crudModal.getCrudWhere({ "email": email }).then(function (data) {
                var hash = data.password;
                bcrypt.compare(password, hash, function (err, result) {
                    if (err) {
                        throw err;
                    }
                    else if (result === true) {
                        req.session.loginIn = true;
                        res.redirect("dashboard");
                    }
                    else {
                        var msg = "Password not match";
                        var us_notfnd = { us_notfnd: { msg: msg } };
                        res.render("crud/login", { title: "User Login", err: us_notfnd });
                    }
                });
                console.log("-----loo")
            });
            //    console.log(getData);
        };
    },

    postSign: function (req, res) {
        var result = validationResult(req);
        var errs = result.mapped();
        // console.log(errs); 
        if (Object.keys(errs).length > 0) {
            res.render("/crud/signup", { title: 'Ragister Seccessfully', err: errs });
            // console.log("ggkgkgA")


        } else {

            var data = req.body;
            // var obj = {
            //     name : data.name,
            //     email : data.email,
            //     password : data.password,
            console.log(data);
            for (var key of Object.keys(data)) {
                data[key] = cleanInput(data[key]);
            }
            console.log("newj-------");
            delete data["cpassword"];
            console.log(data, "delete pass");

            var crudObj = crudModal.addCrud(data)
            // console.log(crudObj,"lasst");
            crudObj.save(function (err, doc) {
                if (err) {
                    throw err;
                } else {
                    bcrypt.hash(doc.password, 10, function (err, hash) {
                        if (err) {
                            throw err;
                        } else {
                            crudModal.userPwdUpdate({ '_id': doc._id }, hash)
                        }
                    });
                    // console.log(doc,"sabse last");
                    var msg = data.name + " account register seccessfully";
                    res.render("./crud/signup", { err: '', msg: msg });
                }
                var msg = data.email + " account register exites";
                res.render("./crud/signup", { err: '', msg: msg });
            });

        }

    },

    dashboard: function (req, res) {
        if (req.session.login == undefined) {
            res.render("crud/login")
        }
        res.render("crud/dashboard", { title: "welcom to dashboard" });
    },
    logout: function (req, res) {
        req.session.destroy(function (err) {
            if (err)
                throw err;
            res.redirect('/crud')
        })
    },
    addcutomer: function (req, res) {
        customerModel.getCust().then(function (data) {
            res.render("crud/addcustomer", { title: 'welcom to addcutomer login', err: '', cust_data: data });
        });
    },
    addcutomerpost: function (req, res) {
        var result = validationResult(req)
        var errs = result.mapped();
        if (Object.keys(errs).length > 0) {
            customerModel.getCust().then(function (data) {
                res.render("crud/addcustomer", { title: 'welcom', err: errs, cust_data: data });
            });
        } else {
            var data = req.body
            console.log(data);
            var customer = customerModel.insertCust(data);
            customer.save(function (err, data) {
                if (err) {
                    // throw  err;
                    var info_msg = { info_msg: { msg: err } };

                    req.flash('error', 'Error updating user with id ');
                    // res.render("crud/addcustomer",{err:info_msg,cust_data:''});
                } else {
                    if (Object.keys(data).length > 0) {
                        // var msg = data.name +" your data is save";
                        // var info_msg ={info_msg:{msg:msg}};

                        req.flash('success', data.name + ' User Details Successfully Added.');

                        // res.render("crud/addcustomer",{title:"sabe jada",err:info_msg, cust_data:''});
                    }
                }

                res.redirect("/crud/addcustomer");
            })
        }
    },

    getCustomer: function (req, res) {
        customerID = req.body.id
        customerModel.getCust({ '_id': customerID }).then(function (doc) {
            res.json(doc);
        })
    },

    updateCustomer: function (req, res) {
        var id = req.body.id;
        var data = req.body;
        delete data["id"];
        customerModel.updateCust(id, data).then(function (doc) {
            res.json({ msg: "success", error: false });
        });
    },
    deleteData: function (req, res) {
        var id = req.params.id;
        console.log("sdfads :", id);
        customerModel.deleteCust(id).then(function (err, doc) {
            try {
                // req.flash('success', 'You Data Delete Seccessfully');
                // res.redirect("/crud/addcustomer");
                res.json({ msg: "success", error: false });
            } catch (err) {
                req.flash('error', 'Error updating user with id ');
                console.log(err);
                throw err;
            }
        });
    },

    custapi: function (req, res) {

        https.get("https://coderbyte.com/api/challenges/json/age-counting",function(response){
            var data="";
            response.on("data",function(chunk){
                // console.log(chunk,"lllllllll");
                data+=chunk;
                // console.log(data,"kkkkkk")
            });
            response.on('end',function(){
                var x = JSON.parse(data);
                    // console.log(data,"lllkkkkkkk")
                
                    var bodyData = x.data;

                    bodyData= bodyData.split(",");
                    // console.log(bodyData,"123333")
                    
                    var sno = 0;
                    bodyData.forEach(function (val) {
                        var arr = val.split("=");
                        console.log(arr,"222222")
                        if (arr[0] == " age" && arr[1] >50) {
                            sno++;
                        }
                    });
        
                    res.json(sno);
            });
        })
        .on("errror",function(error){
                console.log(error)
        })
        // request.get("https://coderbyte.com/api/challenges/json/age-counting", function (error, response, body) {
        //     if (error) {
        //         return console.dir(error, "dmbfds");
        //     }
        //     var x = JSON.parse(body);
        //     var data = x.data;
        //     data = data.split(",");
        //     var sno = 0;
        //     data.forEach(function (val) {
        //         var arr = val.split("=");
        //         if (arr[0] == " age" && arr[1] > 50) {
        //             sno++;
        //             console.log(arr)
        //         }
        //     });

        //     res.json(sno);
        // });
    }

}


// if(password!==password){
//     return res.json({
//         message:"Password does not matched",
//         error:err
//     });
// }else{
//     bcrypt.hash(password, 10, function(err, hash) {
//         // Store hash in your password DB.
//         if(err){
//             console.log("something wrong");
//             return res.json({
//                 message:"something wrong, try latter",
//                 error:err
//             });
//         }else{
//             var addcrud = crudModal.addCrud(data);
//             console.log(addcrud);
//             addcrud.save(function(err,data){
//                 if(err){
//                     var info_msg={info_msg:{msg:err}};
//                     res.render("crud/dashboard",{err:info_msg,cus_data:''});
//                 }
//             })



//         }
//     });

// }

    //     // const adbcrypt = bcrypt.hash(req.body.password,10);
        //     // console.log(adbcrypt);
        //     console.log("gjhgdfhb")
        //     var addata = crudModal.addCrud(obj)
        //     addata.save()
        //     console.log(addata);
        //   // var obh = res.json(req.body

        // var data = req.body
        //     console.log(data);
        //     var customer = customerModoal.insertCust(data)
        //     customer.save((err,data)=>{
        //         if(err){
        //             // throw err;
        //             var info_msg ={info_msg:{msg:err}};
        //             res.render("crud/addcustomer",{err:info_msg});
        //         }else{
        //             if(Object.keys(data).length>0){
        //                 var msg = "your data is save";
        //                 var info_msg ={info_msg:{msg:msg}};
        //                 res.render("crud/addcustomer",{err:info_msg});
        //             }
        //         }
        //     });
