const { json } = require("body-parser");
const { validationResult } = require("express-validator");
const waveitesModel = require("../modules/waveitesModel");
const { mongoose } = require("../database/db_crud");
const { cleanInput } = require("../helpers/helper");
const bcrypt = require("bcrypt");
const session = require("express-session");
const custModel = require("../modules/custModel");
const https = require("https");
const request = require("request");
const multer = require("multer");
const profileadd = require("../modules/profile-model");

var upload = multer({ dest: './public/images/' })



// var storage = multer.diskStorage({
//     destination: function(req,file,cb){
//         cb(null, "images/")
//     },
//     filename:function(req,file,cb){
//         cb(null, date.now()+file.originalname)
//     }
// })

// var upload = multer({storage:storage});


module.exports = {

    login: function (req, res) {
        res.render("project/login", { title: " welcom login", err: '' })
    },
    singup: function (req, res) {
        res.render("project/signup", { title: "Welcome To Ragister Page", err: '' });
    },
    loginProcess: function (req, res) {
        req.session.login = false;
        var result = validationResult(req);
        var errs = result.mapped();
        if (Object.keys(errs).length > 0) {
            res.render('project/login', { title: "post login", err: errs });
        } else {
            var data = req.body
            for (var key of Object.keys(data)) {
                data[key] = cleanInput(data[key]);
            }
            var email = data.email
            var password = data.password;
            waveitesModel.whereData({ "email": email }).then(function (data) {
                if (data == null) {
                    var msg = "email id is not exist";
                    res.render("project/login", { title: "page err", err: '', msgs: msg })
                } else {
                    var hash = data.password
                    bcrypt.compare(password, hash, function (err, result) {
                        if (err) {
                            throw err;
                        }
                        else if (result === true) {
                            req.session.loginIn = true;
                            res.redirect("dashboard");

                        } else {
                            var msg = "password Not Mached";
                            // var info_msg = { info_msg: { msg: msg } }
                            res.render("project/login", { err: "", msgs: msg })

                        }
                    });
                };

            });
            // waveitesModel.whereData({ "email": email }).then(function (data) {
            //     var hash = data.password
            //     bcrypt.compare(password, hash, function (err, result) {
            //         if (err) {
            //             throw err;
            //         } else if (result === true) {
            //             req.session.loginIn = true
            //             res.redirect("dashboard")

            //         } else {
            //             var msg = "password Not Mached";
            //             var info_msg = { info_msg: { msg: msg } }
            //             res.render("project/login", { err: info_msg })

            //         }
            //     })
            // })


        }


    },
    signprocess: function (req, res) {
        var result = validationResult(req)
        var errs = result.mapped()
        if (Object.keys(errs).length > 0) {
            res.render('project/signup', { title: "post signup", err: errs });
        } else {
            var data = req.body
            for (var key of Object.keys(data)) {
                data[key] = cleanInput(data[key]);
            }

            if (data["cpassword"] != data["password"]) {
                var msg = "password Not Mached";
                res.render("./project/signup", { err: '', msgs: msg });
                return false;
            }
            delete data["cpassword"];

            // check email is exist or not
            waveitesModel.whereData({ "email": data.email }).then(function (doc) {
                if (doc == null) {
                    var waveObj = waveitesModel.adData(data);
                    waveObj.save(function (err, doc) {
                        if (err) {
                            throw err;
                        } else {
                            bcrypt.hash(doc.password, 10, function (err, hash) {
                                if (err) {
                                    throw err;
                                } else {
                                    waveitesModel.userPawUpdate({ '_id': doc._id }, hash);
                                    // console.log(doc.id,"kkkkkk")
                                }
                            });

                            var msg = data.name + " account register seccessfully";
                            res.render("./project/signup", { err: '', msg: msg });
                            // req.flash('success', data.name + ' Your Data is Seccessfully Save');
                        }
                    });
                }
                else {
                    var msg = data.name + " email id already exist.";
                    res.render("./project/signup", { err: '', msgs: msg });
                }
            });
            //     if (isEmailExist.email === data["email"]) { // means email id exists
            //         var msg =data.name+ " email id already exist.";
            //         res.render("./project/signup",{err:'',msgs:msg});
            //     }

            //     var waveObj = waveitesModel.adData(data);
            //     waveObj.save(function(err,doc){
            //         if(err){
            //             throw err;
            //         }else{
            //             bcrypt.hash(doc.password, 10, function(err,hash){
            //                 if(err){
            //                     throw err;
            //                 }else{
            //                     waveitesModel.userPawUpdate({'_id':doc._id},hash);
            //                 }
            //             });

            //             var msg =data.name+ " account register seccessfully";
            //             res.render("./project/signup",{err:'',msg:msg});
            //             // req.flash('success', data.name + ' Your Data is Seccessfully Save');
            //         }
            //             // var msg =data.email+ " Your email is already exites";
            //             // res.render("./project/signup",{err:'',msg:msg});
            //             // req.flash('error', 'Account Exites ');
            // });
        }

    },
    dashboard: function (req, res) {
        if (req.session.login == undefined) {
            res.render("project/login");
        }
        res.render('project/dashboard', { title: "dashboard" })
    },
    customer: function (req, res) {
        if (req.session.login == undefined) {
            res.redirect("/waveites/login");
        }
        custModel.getCust1().then(function (data) {
            res.render("project/customer", { title: "hello cust.", err: '', cust_data1: data });
        })

    },
    logout: function (req, res) {
        // req.session.destroy();
        // res.redirect("/waveites")
        req.session.destroy(function (err) {
            if (err) {
                throw err;
            } else {
                res.redirect("/waveites");
            }
        });
    },
    customerpost: function (req, res) {
        var data = req.body;
        var error = validationResult(req);
        var errs = error.mapped();
        if (Object.keys(errs).length > 0) {
            custModel.getCust1().then(function (data) {
                res.render("project/customer", { title: "post cust", err: errs, cust_data1: data })
            })

        } else {
            var data = req.body;
            var objcust = custModel.addata1(data);
            objcust.save(function (err, data) {
                if (err) {
                    req.flash('error', 'Error updating user with id ');
                } else {
                    if (Object.keys(data).length > 0) {
                        req.flash('success', data.name + ' User Details Successfully Added.');
                    }
                }
                res.redirect("/waveites/customer");
            });
        }
    },

    getCustomer1: function (req, res) {
        customerID = req.body.id
        custModel.getCust1({ '_id': customerID }).then(function (doc) {
            res.json(doc);
        });
    },
    upcustomer1: function (req, res) {
        var id = req.body.id;
        var data = req.body;
        delete data["id"];
        custModel.updateCust1(id, data).then(function (doc) {
            res.json({ msg: "success", error: false });
            // req.flash('success', data.name + ' User Details Successfully Added.');
        });
    },
    delete1: function (req, res) {
        var id = req.params.id
        custModel.getDelete(id).then(function (done, doc) {
            // try{
            //     res.json({ msg: "success", error: false });
            //     // req.flash('success', data.name + ' Your Data is Delete Successfully.')
            //     // res.redirect("/waveites/customer")
            // }catch (err){
            //     throw err;
            // }

            // promise solve krne ka method
            const abc = new Promise(function (resolve, reject) {
                if (done) {
                    res.json({ msg: "success", error: false });
                    res.redirect("/waveites/customer")
                    resolve("errdkgfkdsgf");
                    // req.flash('success', data.name + ' Your Data is Delete Successfully.');
                } else {
                    // req.flash('error', 'Error updating user with id ');
                    reject("notdone")
                }
            })

        })
    },
    getapi: function (req, res) {
        request.get("http://api.openweathermap.org/data/2.5/weather?q=Delhi&appid=9eaecc3a1afaa2d2bc2226d788135fe1", function (error, response, body) {
            if (error) {
                return console.dir(error);
            }

            var x = JSON.parse(body);
            // console.log(x,'222222')
            var main = x.main;
            var weathermain = x.weather[0]["main"];

            // console.log(main,'dndhdh')
            var tamp = main.temp;
            var min_temp = main.temp_min;
            var max_temp = main.temp_max;
            res.render('project/getapi', { title: "hello api", tamp, min_temp, max_temp, weathermain });
        });
    },
    profile:function(req,res){
        var data = req.body
        profileadd.findimg().then(function(data){
            res.render("project/profile",{title:'profile page',err:'',data:data})
        })
        
    },

    profilepros: function(req,res){
        var error = validationResult(req);
        var errs = error.mapped();
        if(Object.keys(errs).length>0){
            profileadd.findimg().then(function(data){
                res.render("project/profile",{title:"post profile", err:errs,data:data})
            })
            
        }else{
            var uplad = upload.single('myfile')
            console.log(uplad,"111111111")
            var data = req.body
            var obja = profileadd.add(data);
            obja.save(function(doc){
                res.render("project/profile",{err:'', data:data})
            })
        }
        
    }
}

