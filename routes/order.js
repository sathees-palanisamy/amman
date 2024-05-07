


module.exports = app => {


app.post('/list', async (req, res) => {

    let query = "SELECT * FROM `orderDb` ORDER BY orderid DESC"; // query database to get all the players
  
    db.query(query, (err, result) => {
      res.json({ result });
    });
  
  });
  
  
  
  app.post('/create', async (req, res) => {
  
    // Disable caching for content files
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", 0);
  
    let query1 = "Select max(`orderid`) as maxid from `orderDb`";
  
    var maxorderId;
  
    db.query(query1, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
  
      if (result[0].maxid === null) {
        maxorderId = 1000;
      } else {
        maxorderId = result[0].maxid + 1;
      }
  
      let query = "INSERT INTO `orderDb` " + "(orderid, name, phone,gst,code,address,"
        + "particular1,"
        + "book1  ,"
        + "rate1  ,"
        + "particular2,"
        + "book2  ,"
        + "rate2  ,"
        + "particular3,"
        + "book3  ,"
        + "rate3  ,"
        + "particular4,"
        + "book4  ,"
        + "rate4  ,"
        + "particular5,"
        + "book5  ,"
        + "rate5  ,"
        + "particular6,"
        + "book6  ,"
        + "rate6  ,"
        + "particular7,"
        + "book7  ,"
        + "rate7  ,"
        + "particular8,"
        + "book8  ,"
        + "rate8  ,"
        + "particular9,"
        + "book9  ,"
        + "rate9  ,"
        + "count  ,"
        + "noOfCopies  ,"
        + "totalamt  ,"
        + "pendingamt  ,"
        + "paid  ,"
        + "paymentId  ,"
        + "paymentStatus  ,"
        + "paymentRef  ,"
        + "lastUpdateTimestamp ,"
        + "orderDate) VALUES (" +
        maxorderId + ", '" + req.body.name + "', '" + req.body.phone + "', '" + req.body.gst + "', '" + req.body.code + "', '" + req.body.address
        + "', '" + req.body.particular1
        + "', '" + req.body.book1
        + "', '" + req.body.rate1
        + "', '" + req.body.particular2
        + "', '" + req.body.book2
        + "', '" + req.body.rate2
        + "', '" + req.body.particular3
        + "', '" + req.body.book3
        + "', '" + req.body.rate3
        + "', '" + req.body.particular4
        + "', '" + req.body.book4
        + "', '" + req.body.rate4
        + "', '" + req.body.particular5
        + "', '" + req.body.book5
        + "', '" + req.body.rate5
        + "', '" + req.body.particular6
        + "', '" + req.body.book6
        + "', '" + req.body.rate6
        + "', '" + req.body.particular7
        + "', '" + req.body.book7
        + "', '" + req.body.rate7
        + "', '" + req.body.particular8
        + "', '" + req.body.book8
        + "', '" + req.body.rate8
        + "', '" + req.body.particular9
        + "', '" + req.body.book9
        + "', '" + req.body.rate9
        + "', '" + req.body.count
        + "', '" + req.body.noOfCopies
        + "', '" + req.body.totalamt
        + "', '" + req.body.pendingamt
        + "', '" + req.body.paid
        + "', '" + req.body.paymentId
        + "', '" + req.body.paymentStatus
        + "', '" + req.body.paymentRef
        + "', NOW()"
        + ", CURDATE()"
        + ")";
  
  
      db.query(query, (err, result) => {
        if (err) {
  
          return res.status(500).send(err);
        }
  
        return res.status(200).send({ orderid: maxorderId });
  
      });
  
  
    });
  
  
  
  
  })
  
  
  
  app.post('/delete', async (req, res) => {
  
    // Disable caching for content files
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", 0);
  
  
  
    let query = "DELETE FROM `orderDb` WHERE orderid = '" + req.body.orderid + "'";
    db.query(query, (err, result) => {
      if (err) {
  
        return res.status(500).send(err);
      }
      return res.status(200).send({ "errno": "0000", });
  
    });
  
  })
  
  
  
  app.post('/updateamount', async (req, res) => {

  
    // Disable caching for content files
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", 0);

    let query1 = "Select * from `orderDb` WHERE `orderid` = '" + req.body.orderid + "'";
  
  
    db.query(query1, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }

    var currentdate = new Date(); 
    var datetime = currentdate.getDate() + "/"
              + (currentdate.getMonth()+1)  + "/" 
              + currentdate.getFullYear() + " @ "  
              + currentdate.getHours() + ":"  
              + currentdate.getMinutes() 

     let curBalance =  parseInt(req.body.paid, 10) - parseInt(result[0].paid , 10)
    let curPayment =  parseInt(req.body.paid, 10);
    let curPending =  parseInt(req.body.pendingamt  , 10)

    let tpayref = `${curBalance} with cash on ${datetime}`
    let payRef = `${tpayref} | ${result[0].paymentRef}`;
  
  
  
    let query = "UPDATE `orderDbG1` SET  `paid` ='" + curPayment+ "',  `paymentRef` ='" + payRef +  "',  `pendingamt` ='" + curPending+"',  `lastUpdateTimestamp` =NOW()" + "  WHERE `orderid` = '" + req.body.orderid + "'";
  
  
    db.query(query, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      return res.status(200).send({ "errno": "0000", });
  
    });

});
  
  })
  
  app.post('/updatestatus', async (req, res) => {
  
  
    // Disable caching for content files
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", 0);
  
    let query = "UPDATE `orderDb` SET `status` = '" + req.body.status + "',  `lastUpdateTimestamp` =NOW()" + "  WHERE `orderid` = '" + req.body.orderid + "'";
  
  
    db.query(query, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      return res.status(200).send({ "errno": "0000", });
  
    });
  
  })
  
  app.post('/updatepayment', async (req, res) => {
  
  
    // Disable caching for content files
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", 0);
  
  
    let query1 = "Select * from `orderDb` WHERE `orderid` = '" + req.body.OrderID + "'";
  
  
  
    db.query(query1, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }

      var currentdate = new Date(); 
      var datetime = currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() 


      let curBalance =  parseInt(result[0].paid , 10)
      let curPayment =  parseInt(req.body.moneyRs , 10)
      let curPending =  parseInt(result[0].pendingamt  , 10)

  
      let newAmt = curPending - curPayment;
      let tpayref = `${curPayment} with ${req.body.paymentRef} on ${datetime}`
      let payRef = `${tpayref} | ${result[0].paymentRef}`;
      let newpaid = curBalance + curPayment;

      if (payRef.length > 900) {
        payRef = result[0].paymentRef
      }
  
      let query = "UPDATE `orderDb` SET `paymentId` = '" + req.body.paymentId + "',  `pendingamt` = '" + newAmt + "',  `paid` = '" + newpaid +"',  `paymentRef` = '" + payRef + "'  WHERE `orderid` = '" + req.body.OrderID + "'";
  
  
  
      db.query(query, (err, result) => {
        if (err) {
  
          return res.status(500).send(err);
        }
        return res.status(200).send({ "errno": "0000", });
  
      });
  
  
    });
  
  
  })

  app.post('/update', async (req, res) => {
  
  
    // Disable caching for content files
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", 0);
  
    let query = "UPDATE `orderDb` SET `name` = '" + req.body.name 
    + "',`phone` = '" + req.body.phone 
    + "',`gst` = '" + req.body.gst 
    + "',`code` = '" + req.body.code 
    + "',`address` = '" + req.body.address 
    + "',`particular1` = '" + req.body.particular1 
    + "',`particular2` = '" + req.body.particular2 
    + "',`particular3` = '" + req.body.particular3 
    + "',`particular4` = '" + req.body.particular4 
    + "',`particular5` = '" + req.body.particular5 
    + "',`particular6` = '" + req.body.particular6 
    + "',`particular7` = '" + req.body.particular7 
    + "',`particular8` = '" + req.body.particular8 
    + "',`particular9` = '" + req.body.particular9 
    + "',`book1` = '" + req.body.book1 
    + "',`book2` = '" + req.body.book2
    + "',`book3` = '" + req.body.book3 
    + "',`book4` = '" + req.body.book4 
    + "',`book5` = '" + req.body.book5 
    + "',`book6` = '" + req.body.book6 
    + "',`book7` = '" + req.body.book7 
    + "',`book8` = '" + req.body.book8 
    + "',`book9` = '" + req.body.book9 
    + "',`rate1` = '" + req.body.rate1 
    + "',`rate2` = '" + req.body.rate2
    + "',`rate3` = '" + req.body.rate3 
    + "',`rate4` = '" + req.body.rate4 
    + "',`rate5` = '" + req.body.rate5 
    + "',`rate6` = '" + req.body.rate6 
    + "',`rate7` = '" + req.body.rate7 
    + "',`rate8` = '" + req.body.rate8 
    + "',`rate9` = '" + req.body.rate9 
    + "',`count` = '" + req.body.count 
    + "',`pendingamt` = '" + req.body.pendingamt 
    + "',`noOfCopies` = '" + req.body.noOfCopies 
    + "',`totalamt` = '" + req.body.totalamt 
    + "',  `lastUpdateTimestamp` =NOW()" 
    + "  WHERE `orderid` = '" + req.body.orderId + "'";
  
  
    db.query(query, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      return res.status(200).send({ "errno": "0000", });
  
    });
  
  })
  
  
  
  app.post('/search', async (req, res) => {
  
    // Disable caching for content files
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", 0);
  
  
    let query = "Select * from `orderDb` WHERE `name` = '" + req.body.name + "'";
  
  
  
    db.query(query, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
  
      return res.json({ result });
  
    });
  
  })

  app.post('/order', async (req, res) => {
  
    // Disable caching for content files
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", 0);
  
  
    let query = "Select * from `orderDb` WHERE `orderid` = '" + req.body.searchOrderId + "'";
  
  
  
    db.query(query, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
  
      return res.json({ result });
  
    });
  
  })


};