//app/routes.js

var mysql     = require('mysql');
var fs        = require('fs');
var _         = require('underscore');
var db        = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'root',
  database:'smartmirror'
});

var pictureNum = [];
var guestBook = [];
var allVisitantNum;
db.connect();

module.exports = function(app) {

  app.get('/',function(req,res){
    var query1 = "select count(*) from guestbook"
    db.query(query1,function(err,results){
      if(err)
        console.log(err);
      else {
        allVisitantNum = _.max(_.values(results[0]))
      }
    })

    var query2 = "SELECT * FROM guestbook"
    db.query(query2,function(err,results){
      if(err){
        console.log(err);
      }
      else {
        pictureNum = [];
        guestBook = [];
        for(var key in results){
          pictureNum.push(_.max(_.pick(results[key],'pictureNum')));
          guestBook.push(_.values(_.pick(results[key],'guestBookCol')));
        }
      }
    })
      res.redirect('/loading');
  })

  app.get('/loading',function(req,res){
    res.render('index.ejs',{
      pictureNum : pictureNum,
      guestBook : guestBook,
      visitNum : allVisitantNum
    });
  })

  app.post('/update',function(req,res){
    var index = req.body.index;
    var data = req.body.data; 
    if(!data){data = "한마디를 입력해 주세요 "};
    var updateQuery = "UPDATE `smartmirror`.`guestbook` SET `guestBookCol`='"+data+"'WHERE `pictureNum`='"+index+"'";
    db.query(updateQuery,function(err,results){
      if(err)
        console.log(err);
      else{
        res.redirect('/');
      }
    });
  })

  app.post('/delete',function(req,res){
    console.log(req.body.index);
    var index = req.body.index;
    var deleteQuery = "DELETE FROM `smartmirror`.`guestbook` WHERE `pictureNum`='"+index+"';";
    var filePath = "/home/ubuntu/jiam_2016_exhibition/exhibition/public/img/visitant/"+index+".jpg"
    db.query(deleteQuery,function(err,results){
      if(err)
        console.log(err);
      else{
        fs.unlink(filePath,function(err){
          if(err)
           console.log(err);
        })
        res.redirect('/')
      }
    });
  })
}
