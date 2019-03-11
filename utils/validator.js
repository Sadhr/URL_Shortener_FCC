const dns = require("dns")
const {URL} = require("url")

const urlRegExp = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/gi;

exports.validateHost = (url, cb) => {
  let longUrl = null;
  let err = null;
  
  try{
    longUrl = new URL(url)
  }catch(err){
    cb(err, null)
  }
  
  if(longUrl){
    dns.lookup(longUrl.hostname, (err, addresses, family) => {
      if(err) return cb(err, null);
      cb(null, longUrl.origin)
    })
  } 
};

exports.validateUrl = (url) => {
  return urlRegExp.test(url)  
}