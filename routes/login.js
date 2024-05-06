

module.exports = app => {

    /* Login Details */
app.post('/login', async (req, res) => {

    // Disable caching for content files
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", 0);
  
    let status = '';
  
    let query = "Select * from `loginDb` WHERE `Mail` = '" + req.body.user + "'";
  
  
  
    db.query(query, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
  
  
      let status;
      
      if (req.body.password === result[0].pwd) {
        status = 'success'
      }
  
  
      return res.json({ status });
  
    });
  

  
  });
  


};