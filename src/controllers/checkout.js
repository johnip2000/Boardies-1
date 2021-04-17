const db = require('../config/database');
const runQuery = db.runQuery;
var Publishable_Key = 'pk_test_51IgdhXJkU7lcXnBPdPlB7gqMxOBT7IfjW9hr1YH2PlBaecDlsh1MKoXEfc4NlBVHT9HYBTbJrxaR2UNfvYMHfYkx00F8pPwiM2'
var Secret_Key = 'sk_test_51IgdhXJkU7lcXnBPAR7lZZW0twMl2ymjtvzx5RXWB8kxmMQsxYzIFSQa7tAc1OimqxF8JFqxTjUCubgRKrQoEx3i00YSnlM06w'

const stripe = require('stripe')(Secret_Key)

class CheckoutController {
    async Addresses(req, res) {
        //console.log(req.session);
        //console.log(req.query.Release);
        if (req.query.Release == "true") {
            req.session.ConfirmAddr = false;
            //console.log(req.session.ConfirmAddr);
        }
        var Tax = 0;
        var Shipping = 0;
        var TempTotalPrice = 0;
        var HavingAddr = false;
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;

        if (req.session.username != "" && typeof (req.session.username) != 'undefined') {
            runQuery('SELECT * FROM Users WHERE email = \'' + req.session.username + '\'', function (user) {
                isAdmin = user.recordset[0].isAdmin;
                if (isLogin) {
                    runQuery('SELECT * FROM Cart WHERE Useremail = \'' + req.session.username + '\'', function (result) {
                        runQuery('SELECT * FROM PreOrder WHERE UserEmail = \'' + req.session.username + '\'', function (presult) {
                            //console.log(req.session);
                            runQuery('SELECT * FROM Addresses a INNER JOIN Users u ON a.userID = u.UserID  WHERE u.userName = \'' + req.session.username + '\'', function (fetchaddress) {
                                try {
                                    //console.log(fetchaddress.recordset[0]);
                                    HavingAddr = true;

                                    //console.log(presult.recordset[0].TotalPrePrice);
                                    if (fetchaddress.recordset[0].province == "Alberta") {
                                        Tax = presult.recordset[0].TotalPrePrice * 0.05;
                                    } else if (fetchaddress.recordset[0].province == "British Columbia") {
                                        Tax = presult.recordset[0].TotalPrePrice * 0.12;
                                    } else if (fetchaddress.recordset[0].province == "Manitoba") {
                                        Tax = presult.recordset[0].TotalPrePrice * 0.12;
                                    } else if (fetchaddress.recordset[0].province == "NewBrunswick") {
                                        Tax = presult.recordset[0].TotalPrePrice * 0.15;
                                    } else if (fetchaddress.recordset[0].province == "Newfoundland and Labrador") {
                                        Tax = presult.recordset[0].TotalPrePrice * 0.15;
                                    } else if (fetchaddress.recordset[0].province == "Northwest Territories") {
                                        Tax = presult.recordset[0].TotalPrePrice * 0.5;
                                    } else if (fetchaddress.recordset[0].province == "Nova Scotia") {
                                        Tax = presult.recordset[0].TotalPrePrice * 0.15;
                                    } else if (fetchaddress.recordset[0].province == "Nunavut") {
                                        Tax = presult.recordset[0].TotalPrePrice * 0.05;
                                    } else if (fetchaddress.recordset[0].province == "Ontario") {
                                        Tax = presult.recordset[0].TotalPrePrice * 0.13;
                                    } else if (fetchaddress.recordset[0].province == "Prince Edward Island") {
                                        Tax = presult.recordset[0].TotalPrePrice * 0.15;
                                    } else if (fetchaddress.recordset[0].province == "Quebec") {
                                        Tax = presult.recordset[0].TotalPrePrice * 0.14975;
                                    } else if (fetchaddress.recordset[0].province == "Saskatchewan") {
                                        Tax = presult.recordset[0].TotalPrePrice * 0.11;
                                    } else if (fetchaddress.recordset[0].province == "Yukon") {
                                        Tax = presult.recordset[0].TotalPrePrice * 0.05;
                                    }

                                    TempTotalPrice = presult.recordset[0].TotalPrePrice + Tax;

                                    runQuery('UPDATE PreOrder SET \
                                        TotalPrePrice = \'' + presult.recordset[0].TotalPrePrice + '\' \,\
                                        DTax = \'' + Tax + '\' \,\
                                        DShipping = \'' + Shipping + '\' \ \
                                        WHERE UserEmail = \'' + req.session.username + '\' ', function (updateresult) {
                                    })

                                    return res.render('checkout/addresses', {
                                        isLogin,
                                        isAdmin,
                                        ItemsPurchase: result.recordset,
                                        Missinfo: "",
                                        Subtotal: presult.recordset[0].TotalPrePrice,
                                        DTax: Tax,
                                        DTempTotal: TempTotalPrice,
                                        DShipping: Shipping,
                                        HavAddr: HavingAddr,
                                        Daddr1: fetchaddress.recordset[0].address1,
                                        Daddr2: fetchaddress.recordset[0].address2,
                                        Dcity: fetchaddress.recordset[0].city,
                                        Dprovince: fetchaddress.recordset[0].province,
                                        DpostalCode: fetchaddress.recordset[0].postalCode,
                                        Dcountry: fetchaddress.recordset[0].country
                                    });
                                } catch (err) {
                                    runQuery('SELECT * FROM Cart WHERE UserEmail = \'' + req.session.username + '\'', function (directgocheckout) {
                                        //console.log(directgocheckout.recordset.length)
                                        if (directgocheckout.recordset.length == 0) {
                                            return res.render('pages/cart', {
                                                Warning: "Please add the item into the cart before checking out",
                                                listCart: directgocheckout.recordset,
                                                isLogin,
                                                isAdmin,
                                                Subtotal: 0,
                                                VoucherStatus: ""
                                            });
                                        } else {
                                            TempTotalPrice = presult.recordset[0].TotalPrePrice + Tax;
                                            HavingAddr = false;

                                            runQuery('UPDATE PreOrder SET \
                                                TotalPrePrice = \'' + presult.recordset[0].TotalPrePrice + '\' \,\
                                                DTax = \'' + Tax + '\' \,\
                                                DShipping = \'' + Shipping + '\' \ \
                                                WHERE UserEmail = \'' + req.session.username + '\' ', function (updateresult) {
                                            })

                                            return res.render('checkout/addresses', {
                                                isLogin,
                                                isAdmin,
                                                ItemsPurchase: result.recordset,
                                                Missinfo: "",
                                                Subtotal: TempTotalPrice,
                                                DTax: 0,
                                                DTempTotal: TempTotalPrice,
                                                DShipping: 0,
                                                HavAddr: HavingAddr,
                                                Daddr1: " ",
                                                Daddr2: " ",
                                                Dcity: " ",
                                                Dprovince: " ",
                                                DpostalCode: " ",
                                                Dcountry: " "
                                            });
                                        }
                                    })
                                }
                            })
                        });
                    })
                } else {
                    return res.render('pages/errors');
                }
            });
        } else {
            return res.redirect('/login');
        }
    }

    async PostAddresses(req, res) {
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;
        var Shipping = 0;
        var TempTotal = 0;
        //var Tax;
        //var TempTotalPrice;
        if (req.session.username != "" && typeof (req.session.username) != 'undefined') {
            runQuery('SELECT * FROM Users WHERE email = \'' + req.session.username + '\'', function (user) {
                isAdmin = user.recordset[0].isAdmin;
                if (isLogin) {
                    runQuery('SELECT * FROM Cart WHERE Useremail = \'' + req.session.username + '\'', function (result) {
                        runQuery('SELECT * FROM PreOrder WHERE UserEmail = \'' + req.session.username + '\'', function (presult) {
                            //console.log(req.body);

                            if (req.body.shippingAddressId == "savedaddress") {
                                //console.log("Saved Address")
                                runQuery('SELECT * FROM Addresses a INNER JOIN Users u ON a.userID = u.UserID  WHERE u.userName = \'' + req.session.username + '\'', function (fetchaddress) {
                                    //console.log(fetchaddress.recordset)
                                    runQuery('UPDATE PreOrder SET \
                                        DeliveryName = \'' + fetchaddress.recordset[0].name + '\', \
                                        DeliveryPhone = \'' + fetchaddress.recordset[0].phone + '\', \
                                        DeliveryAddress1 = \'' + fetchaddress.recordset[0].address1 + '\', \
                                        DeliveryAddress2 = \'' + fetchaddress.recordset[0].address2 + '\', \
                                        DeliveryCity = \'' + fetchaddress.recordset[0].city + '\', \
                                        DeliveryProvince = \'' + fetchaddress.recordset[0].province + '\', \
                                        DeliveryPostalCode = \'' + fetchaddress.recordset[0].postalCode + '\', \
                                        DeliveryCountry = \'' + fetchaddress.recordset[0].country + '\' \
                                        WHERE UserEmail = \'' + req.session.username + '\' ', function (updateresult) {
                                    })

                                    TempTotal = presult.recordset[0].TotalPrePrice + presult.recordset[0].DTax;


                                    return res.redirect('/checkout/shipping');
                                });
                            } else {
                                runQuery('SELECT * FROM Cart WHERE Useremail = \'' + req.session.username + '\'', function (result) {
                                    runQuery('SELECT * FROM PreOrder WHERE UserEmail = \'' + req.session.username + '\'', function (presult) {

                                        runQuery('UPDATE PreOrder SET \
                                        DeliveryName = \'' + req.body.fullName + '\', \
                                        DeliveryPhone = \'' + req.body.phone + '\', \
                                        DeliveryAddress1 = \'' + req.body.address1 + '\', \
                                        DeliveryAddress2 = \'' + req.body.address2 + '\', \
                                        DeliveryCity = \'' + req.body.city + '\', \
                                        DeliveryProvince = \'' + req.body.province + '\', \
                                        DeliveryPostalCode = \'' + req.body.postalCode + '\', \
                                        DeliveryCountry = \'' + req.body.country + '\' \
                                        WHERE UserEmail = \'' + req.session.username + '\' ', function (updateresult) {
                                        })

                                        if (req.session.ConfirmAddr == false) {
                                            var Tax = 0;


                                            if (req.body.province == "Alberta") {
                                                Tax = presult.recordset[0].TotalPrePrice * 0.05;
                                            } else if (req.body.province == "British Columbia") {
                                                Tax = presult.recordset[0].TotalPrePrice * 0.12;
                                            } else if (req.body.province == "Manitoba") {
                                                Tax = presult.recordset[0].TotalPrePrice * 0.12;
                                            } else if (req.body.province == "NewBrunswick") {
                                                Tax = presult.recordset[0].TotalPrePrice * 0.15;
                                            } else if (req.body.province == "Newfoundland and Labrador") {
                                                Tax = presult.recordset[0].TotalPrePrice * 0.15;
                                            } else if (req.body.province == "Northwest Territories") {
                                                Tax = presult.recordset[0].TotalPrePrice * 0.05;
                                            } else if (req.body.province == "Nova Scotia") {
                                                Tax = presult.recordset[0].TotalPrePrice * 0.15;
                                            } else if (req.body.province == "Nunavut") {
                                                Tax = presult.recordset[0].TotalPrePrice * 0.05;
                                            } else if (req.body.province == "Ontario") {
                                                Tax = presult.recordset[0].TotalPrePrice * 0.13;
                                            } else if (req.body.province == "Prince Edward Island") {
                                                Tax = presult.recordset[0].TotalPrePrice * 0.15;
                                            } else if (req.body.province == "Quebec") {
                                                Tax = presult.recordset[0].TotalPrePrice * 0.14975;
                                            } else if (req.body.province == "Saskatchewan") {
                                                Tax = presult.recordset[0].TotalPrePrice * 0.11;
                                            } else if (req.body.province == "Yukon") {
                                                Tax = presult.recordset[0].TotalPrePrice * 0.05;
                                            }
                                            //console.log(Tax);
                                            runQuery('UPDATE PreOrder SET \
                                            DTax = \'' + Tax + '\' \
                                            WHERE UserEmail = \'' + req.session.username + '\' ', function (updateresult) {
                                            })
                                            TempTotal = presult.recordset[0].TotalPrePrice + Tax;
                                            req.session.ConfirmAddr = true;

                                            return res.redirect('/checkout/shipping');
                                        } else {
                                            runQuery('SELECT * FROM PreOrder WHERE UserEmail = \'' + req.session.username + '\'', function (auresult) {
                                                TempTotal = auresult.recordset[0].TotalPrePrice + auresult.recordset[0].DTax;
                                                Tax = auresult.recordset[0].DTax;

                                                return res.redirect('/checkout/shipping');
                                            })
                                        }
                                    })
                                })
                            }
                            //return res.render('checkout/shipping', {isLogin, isAdmin, ItemsPurchase: result.recordset, Subtotal: presult.recordset[0].TotalPrePrice});
                        });
                    })
                } else {
                    return res.render('pages/errors');
                }
            });
        } else {
            return res.redirect('/login');
        }
    }

    async ShippingAndPayment(req, res) {
        var Tax = 0;
        var TempTotal = 0;
        var Shipping = 0;
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;
        var freeshipping = true;

        if (req.session.username != "" && typeof (req.session.username) != 'undefined') {
            runQuery('SELECT * FROM Users WHERE email = \'' + req.session.username + '\'', function (user) {
                isAdmin = user.recordset[0].isAdmin;
                if (isLogin) {
                    runQuery('SELECT * FROM PreOrder WHERE UserEmail = \'' + req.session.username + '\'', function (directgotoship) {
                        //console.log(directgotoship.recordset[0].DeliveryName)
                        if (directgotoship.recordset[0].DeliveryName == null) {

                            runQuery('SELECT * FROM Cart WHERE Useremail = \'' + req.session.username + '\'', function (result) {
                                runQuery('SELECT * FROM PreOrder WHERE Useremail = \'' + req.session.username + '\'', function (presult) {
                                    return res.redirect('/checkout/addresses');
                                });
                            })

                        } else {
                            runQuery('SELECT * FROM Cart WHERE Useremail = \'' + req.session.username + '\'', function (result) {
                                //for (var i=0; i< result.recordset.length; i++)
                                //console.log(result.recordset[i]);
                                runQuery('SELECT * FROM PreOrder WHERE UserEmail = \'' + req.session.username + '\'', function (presult) {
                                    //console.log(presult.recordset[0].TotalPrePrice);
                                    Tax = presult.recordset[0].DTax;
                                    TempTotal = presult.recordset[0].TotalPrePrice + Tax;

                                    //console.log(req.query)
                                    if (req.query.freeship == "true") {
                                        freeshipping = true;
                                        Shipping = 0;
                                        runQuery('UPDATE PreOrder SET \
                                            DShipping = \'' + Shipping + '\' \
                                            WHERE UserEmail = \'' + req.session.username + '\' ', function (updateship) {

                                        })
                                    } else if (req.query.freeship == "false") {
                                        freeshipping = false;
                                        Shipping = 4.99;
                                        TempTotal = TempTotal + Shipping;
                                        runQuery('UPDATE PreOrder SET \
                                            DShipping = \'' + Shipping + '\' \
                                            WHERE UserEmail = \'' + req.session.username + '\' ', function (updateship) {

                                        })
                                    }

                                    return res.render('checkout/shipping', {
                                        isLogin,
                                        isAdmin,
                                        ItemsPurchase: result.recordset,
                                        Subtotal: presult.recordset[0].TotalPrePrice,
                                        DTax: Tax,
                                        DTempTotal: TempTotal,
                                        DShipping: Shipping,
                                        ShipMethod: freeshipping
                                    });
                                })
                            })
                        }
                    })


                } else {
                    return res.render('pages/errors');
                }
            });
        } else {
            //console.log("Test Redirect")
            return res.redirect('/login');
        }
    }

    async PostShippingAndPayment(req, res) {
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;
        if (req.session.username != "" && typeof (req.session.username) != 'undefined') {
            runQuery('SELECT * FROM Users WHERE email = \'' + req.session.username + '\'', function (user) {
                isAdmin = user.recordset[0].isAdmin;
                if (isLogin) {
                    runQuery('SELECT * FROM Cart WHERE Useremail = \'' + req.session.username + '\'', function (result) {
                        runQuery('SELECT * FROM PreOrder WHERE UserEmail = \'' + req.session.username + '\'', function (presult) {
                            return res.redirect('/checkout/review')
                        });
                    })
                } else {
                    return res.render('pages/errors');
                }
            });
        } else {
            return res.redirect('/login');
        }
    }

    async Review(req, res) {
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;
        var TempTotal = 0;
        var Shipping = 0;
        var ShipMethod = "";
        var Tax = 0;
        var FeePay = 0;
        if (req.session.username != "" && typeof (req.session.username) != 'undefined') {
            runQuery('SELECT * FROM Users WHERE email = \'' + req.session.username + '\'', function (user) {
                isAdmin = user.recordset[0].isAdmin;
                if (isLogin) {
                    runQuery('SELECT * FROM Cart WHERE Useremail = \'' + req.session.username + '\'', function (result) {
                        runQuery('SELECT * FROM PreOrder WHERE UserEmail = \'' + req.session.username + '\'', function (presult) {
                            Tax = presult.recordset[0].DTax;
                            Shipping = presult.recordset[0].DShipping;
                            TempTotal = presult.recordset[0].TotalPrePrice + Tax + Shipping;
                            FeePay = TempTotal*100;
                            if(Shipping==0)
                            {
                                ShipMethod = "Free Shipping";
                            }else {
                                ShipMethod = "Express Shipping";
                            }

                            return res.render('checkout/review', {
                                isLogin,
                                isAdmin,
                                ItemsPurchase: result.recordset,
                                DTempTotal: TempTotal,
                                Subtotal: presult.recordset[0].TotalPrePrice,
                                DShipping: Shipping,
                                DTax: Tax,
                                DName: presult.recordset[0].DeliveryName,
                                DAddr1: presult.recordset[0].DeliveryAddress1,
                                DAddr2: presult.recordset[0].DeliveryAddress2,
                                DCity: presult.recordset[0].DeliveryCity,
                                DProv: presult.recordset[0].DeliveryProvince,
                                DPost: presult.recordset[0].DeliveryPostalCode,
                                DCountry: presult.recordset[0].DeliveryCountry,
                                DPhone: presult.recordset[0].DeliveryPhone,
                                ShippingMethod: ShipMethod,
                                key: Publishable_Key,
                                CustomerName: presult.recordset[0].DeliveryName,
                                Fee: FeePay
                            });
                        });
                    })
                } else {
                    return res.render('pages/errors');
                }
            });
        } else {
            return res.redirect('/login');
        }
    }

    async Payment(req, res){
        const isLogin = req.session.loggedin ? true : false;
        var isAdmin = false;
        var customer;
        var TotalFee = 0;
        var OriginalFee = 0;
        var Discount = 0;
        var FinalCharge = 0;
        var datePurchase = new Date();
        var yearPurchase = datePurchase.getFullYear();
        var monthPurchase = ("0" + (datePurchase.getMonth() + 1)).slice(-2);
        var dayPurchase = ("0" + datePurchase.getDate()).slice(-2);
        var hourPurchase = datePurchase.getHours();
        var minutePurchase = datePurchase.getMinutes();
        var secondPurchase = datePurchase.getSeconds();
        var wholePurchaseDate = yearPurchase + "-" + monthPurchase + "-" + dayPurchase + " " + hourPurchase + ":" + minutePurchase + ":" + secondPurchase +"(EDT)";
        var Recipedate = yearPurchase + "-" + monthPurchase + "-" + dayPurchase;
        var WholeAddress = "";
        const orderID = "BO"+ Math.random().toString(36).substr(2, 5);
        var insorderId = 0;
        var productTotal = 0;
        //console.log(orderID);
        delete req.session.ConfirmAddr;
        delete req.session.Voucher;
        runQuery('SELECT * FROM Users WHERE email = \'' + req.session.username + '\'', function (user) {
            runQuery('SELECT * FROM Cart WHERE Useremail = \'' + req.session.username + '\'', function (result) {
                runQuery('SELECT * FROM PreOrder WHERE UserEmail = \'' + req.session.username + '\'', function (presult) {
                    TotalFee = (presult.recordset[0].TotalPrePrice + presult.recordset[0].DTax + presult.recordset[0].DShipping) * 100
                    stripe.customers.create({
                        email: req.body.stripeEmail,
                        source: req.body.stripeToken,
                        name: presult.recordset[0].DeliveryName,
                        address: {
                            line1: presult.recordset[0].DeliveryAddress1,
                            line2: presult.recordset[0].DeliveryAddress2,
                            postal_code: presult.recordset[0].DeliveryPostalCode,
                            city: presult.recordset[0].DeliveryCity,
                            state: presult.recordset[0].DeliveryProvince,
                            country: presult.recordset[0].DeliveryCountry,
                        }
                    })
                        .then((customer) => {

                            return stripe.charges.create({
                                amount: Math.round(TotalFee),    // Charing Rs 25
                                description: 'Broadies',
                                currency: 'CAD',
                                customer: customer.id
                            });
                        })
                        .then((charge) => {
                            //res.send("Success") // If no error occurs
                            for (var i = 0; i < result.recordset.length; i++) {
                                OriginalFee = (result.recordset[i].Price * result.recordset[i].CartProductQuantity) + OriginalFee
                            }
                            FinalCharge = presult.recordset[0].TotalPrePrice + presult.recordset[0].DShipping + presult.recordset[0].DTax;
                            Discount = (OriginalFee + presult.recordset[0].DShipping + presult.recordset[0].DTax) - (presult.recordset[0].TotalPrePrice + presult.recordset[0].DShipping + presult.recordset[0].DTax)
                            //console.log(req.body)

                            res.render('checkout/confirmation', {
                                isLogin,
                                isAdmin,
                                ItemsPurchase: result.recordset,
                                CustomerName: presult.recordset[0].DeliveryName,
                                DAddr1: presult.recordset[0].DeliveryAddress1,
                                DAddr2: presult.recordset[0].DeliveryAddress2,
                                DCity: presult.recordset[0].DeliveryCity,
                                DProv: presult.recordset[0].DeliveryProvince,
                                DPost: presult.recordset[0].DeliveryPostalCode,
                                DCountry: presult.recordset[0].DeliveryCountry,
                                Subtotal: OriginalFee,
                                DShipping: presult.recordset[0].DShipping,
                                DTax: presult.recordset[0].DTax,
                                DDisc: Discount,
                                TotalCharge: FinalCharge,
                                orderDate: wholePurchaseDate,
                                orderNo: orderID,
                                daydate: Recipedate
                            });
                        })
                        .then((afterpayment) => {
                            WholeAddress = presult.recordset[0].DeliveryAddress1 + ", " +
                                presult.recordset[0].DeliveryAddress2 + ", " +
                                presult.recordset[0].DeliveryCity + ", " +
                                presult.recordset[0].DeliveryProvince + ", " +
                                presult.recordset[0].DeliveryPostalCode + ", " +
                                presult.recordset[0].DeliveryCountry;

                            runQuery('INSERT INTO Orders(userID, useraddress, subTotal, discount, shippingFee, tax, total, payment, orderDate, status)\
                                          VALUES (\'' + user.recordset[0].userID + '\', \
                                                    \'' + WholeAddress + '\', \
                                                    \'' + OriginalFee + '\', \
                                                    \'' + Discount + '\', \
                                                    \'' + presult.recordset[0].DShipping + '\', \
                                                    \'' + presult.recordset[0].DTax + '\', \
                                                    \'' + FinalCharge + '\', \
                                                    \'' + "VISA" + '\', \
                                                    \'' + wholePurchaseDate + '\', \
                                                     \'' + "On Progress" + '\')', function (updateresult) {
                                runQuery('SELECT * FROM Orders', function (Orderresult){
                                    insorderId = Orderresult.recordset.length

                                    //console.log(result.recordset)


                                    for(var i = 0; i < result.recordset.length; i++){
                                        productTotal = result.recordset[i].Price * result.recordset[i].CartProductQuantity
                                        runQuery('INSERT INTO Order_Details(orderID, productID, quantity, productTotal)\
                                                                        VALUES (\'' + insorderId  + '\', \
                                                                        \'' + result.recordset[i].ProductID + '\', \
                                                                        \'' + result.recordset[i].CartProductQuantity + '\', \
                                                                        \'' + productTotal + '\')', function (updateresult) {
                                            //console.log("Insert SUCCESS");
                                        })
                                    }
                                })
                            })
                        })
                        .then((afterinsert) => {
                            runQuery('DELETE FROM Cart WHERE Useremail = \'' + req.session.username + '\'', function (result){
                                //console.log("DELETE Cart SUCCESS");
                            })
                            runQuery('DELETE FROM PreOrder WHERE Useremail = \'' + req.session.username + '\'', function (result){
                                //console.log("DELETE PreOrder SUCCESS");
                            })
                            req.session.Voucher = false;
                        })
                        .catch((err) => {
                            //console.log(TotalFee)
                            res.send(err)    // If some error occurs
                        });
                })
            })
        })
    }




    // async PlaceOrder(req, res) {
    //     const isLogin = req.session.loggedin ? true : false;
    //     var isAdmin = false;
    //     if (req.session.username != "" && typeof (req.session.username) != 'undefined') {
    //         runQuery('SELECT * FROM Users WHERE email = \'' + req.session.username + '\'', function (user) {
    //             isAdmin = user.recordset[0].isAdmin;
    //             if (isLogin) {
    //                // return res.render('checkout/confirmation', {isLogin, isAdmin});
    //                 console.log("Test")
    //                 console.log(stripe.tokens.retrieve(
    //                     'tok_1IgwK9JkU7lcXnBPG3abHXpX'
    //                      req.body.stripeToken
    //                 ))
    //
    //             } else {
    //                 return res.render('pages/errors');
    //             }
    //         });
    //     }
    // }
}

module.exports = CheckoutController