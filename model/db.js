const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const urlSchema = new Schema({
  originalUrl: String,
  shortUrl: Number
});

const Url = mongoose.model('urls', urlSchema);

exports.createAndSaveUrl = (urlToAdd, done) => {
  isEmptyCollection((err, res) => {
    if(err) return done(err);
    if(res){
      const url = new Url({
        originalUrl: urlToAdd,
        shortUrl: 1
      });
      
      url.save((err, data) => {
        if(err) return done(err, null);
        done(null, data.shortUrl)
      });
    }else if(!res){
      isUrlInDB(urlToAdd, (err, res) => {
        if(err) return done(err);
        if(res){
          return done(null, res)
        }else{
          latestUrlSaved((err, res) => {
          console.log(`get short ${res}`)
          const short = res + 1;
          const url = new Url({
            originalUrl: urlToAdd,
            shortUrl: short
          });
          
          url.save((err, data) => {
            if(err) return done(err);
            done(null, data.shortUrl)
          })
          })
        }
      })         
    }
  })
}

exports.findUrlByShortName = (shortUrl, cb) => {
  Url.findOne({shortUrl: shortUrl}, (err, data) => {
    if(err) return cb(err, null);
    cb(null, data.originalUrl)
  })
}

const isEmptyCollection = (done) => {
  Url.countDocuments((err, count) => {
    if(!err && count === 0){
      return done(null, true);  
    } else if(err){
      return done(err, null);
    }else{
      return done(null, false)
    }
  })
};

const isUrlInDB = (url, done) => {
  Url.findOne({originalUrl: url}, (err, data) => {
    if (err) return done(err);
    if (data) { 
      return done(null, data.shortUrl);
    } else {
      return done(null, null);
    }
  })
};

const latestUrlSaved = (cb) => {
  Url.find()
     .sort({shortUrl: -1})
     .limit(1)
     .exec((err, data) => {
        if(err) return cb(err, null);
        cb(null, data[0].shortUrl)
      })
}

