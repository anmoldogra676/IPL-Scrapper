// Main Link from where we have to extract the data 
let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595"
let request = require("request");
let cheerio=  require("cheerio")
let fs = require("fs"); // file system module
let path = require("path")
let  links = require("./extract.js") // exports a function from other js file

request(url, cb) // made a request on  web page 


function makefolder(src)  // function to create a directory if already exists then ignore
{
     if(fs.existsSync(src)== false)
     {
         fs.mkdirSync(src);
     }
}
function cb(err, response,html) // callback fucntion for getting the result page link(where all matches are showed)
{
    if(err)
    console.log(err)
    else{

        let chSelector = cheerio.load(html);
        let element = chSelector(".jsx-850418440.navbar-nav .jsx-850418440.nav-item .nav-link ")
        let resultLink = chSelector(element[1]).attr("href")
        fullResultLink = "https://www.espncricinfo.com/"+ resultLink;
        links.mdfn(fullResultLink); // made a call for getting the required data 
        
       
        
       
    }
  
}

