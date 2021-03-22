
let request = require("request");
let cheerio = require("cheerio")
let fs = require("fs");
let path = require("path");

function matchesdata(url) // url --> result page link
{
    request(url, cb)
}

// function to create a new folder/directory if already exists then ignore
function makefolder(src) {
    if (fs.existsSync(src) == false) {
        fs.mkdirSync(src);
    }
}

// callback function --> getting every match scorecard url
function cb(err, response, html)
{
    let cheerioSelector = cheerio.load(html);

    let matchcard = cheerioSelector(".col-md-8.col-16 .match-info-link-FIXTURES");
    //console.log(matchcard.length)  // number of matches in ipl 2020
    for (let i = 0; i < matchcard.length; i++) {

        let matchesLink = cheerioSelector(matchcard[i]).attr("href")
        let fullmatchlink = "https://www.espncricinfo.com/" + matchesLink // url for getting every match scorecard
        request(fullmatchlink, cb1);
    }
}

 // callback function for --> extracting  batsman data  
//                        --> make a json file named playerName i.e RohitSharma.json
//                        --> put the json file in Team Name Folder 
//                        --> put the whole data in IPL 2020 Folder 
function cb1(err, response, html)

{
    // Teams Folder 



    let cheerioSelector = cheerio.load(html);
    let globalElement = cheerioSelector(".match-info.match-info-MATCH .description").text()
    let globalarr =globalElement.split(',')
    let venue = globalarr[1];
    let matchDate= globalarr[2]; 
    let element = cheerioSelector(".team .name-detail .name-link .name")
    let firstTeamname = cheerioSelector(element[0]).text()  // extracting the team names
    let secondTeamname = cheerioSelector(element[1]).text()
    let mainFolderpath = path.join(__dirname, "IPL 2020"); // make a folder naming ipl 2020
    let mainFolder = makefolder(mainFolderpath);
    let team1Folder = makefolder(path.join(mainFolderpath, firstTeamname));
    let team2Folder = makefolder(path.join(mainFolderpath, secondTeamname));

    // extract the each batsmen data and put that into team folder by file name --> playername.json

    let table = cheerioSelector(".table.batsman") // extract the batsman table 
    let whichTeam = 1; // counter to help in which folder playername has to be put

    for (let i = 0; i < table.length; i++) // table length-> 2
    {
        let teambatsmen = cheerioSelector(table[i]).find("tr")
        for (let j = 0; j < teambatsmen.length; j++) {
            let teambatsmendata = cheerioSelector(teambatsmen[j]).find("td");

            if (teambatsmendata.length == 8) // only these have required data 
            {
                let Playername = cheerioSelector(teambatsmendata[0]).text();
                let Runs = cheerioSelector(teambatsmendata[2]).text();
                let Balls = cheerioSelector(teambatsmendata[3]).text();
                let Fours = cheerioSelector(teambatsmendata[5]).text();
                let Sixes = cheerioSelector(teambatsmendata[6]).text();
                let Strike_Rate = cheerioSelector(teambatsmendata[7]).text();
                
                // console.log(Playername, Runs, Balls)
                let opponent_Team = whichTeam==1? secondTeamname:firstTeamname;

                let obj = {    // push all details in object 
                    name: Playername,
                    runs: Runs,
                    ball: Balls,
                    fours: Fours,
                    sixes: Sixes,
                    Strike_Rate: Strike_Rate,
                    opponent_Team:opponent_Team,
                    venue_Name : venue,
                    Match_date : matchDate
                }

                // here we make a file named playername.json and put that into team folder with (whichTeam counter we have taken)
                let arr = []
                arr.push(obj);
                let playerfile = JSON.stringify(arr); // convert into string for json 
                if (whichTeam == 1)  // team->1 then make a json file and put that file in team 1 folder
                {
                    let folder_path = path.join(mainFolderpath, firstTeamname)
                    let file_path = path.join(folder_path, Playername + ".json");
                    if (fs.existsSync(file_path) == false)  // if no file then create one 
                    {
                        fs.writeFileSync(file_path, playerfile);
                    }
                    else { // if there is file then add the contents in it 
                        let folder_path = path.join(mainFolderpath, firstTeamname)
                        let file_path = path.join(folder_path, Playername + ".json");
                        let content = fs.readFileSync(file_path);
                        let ans = JSON.parse(content);
                        ans.push(obj);
                        let contentInFile = JSON.stringify(ans);
                        fs.writeFileSync(file_path, contentInFile);


                    }
                }
                else {

                    // team->2 then make a json file and put that file in team 2 folder

                    let folder_path = path.join(mainFolderpath, secondTeamname)
                    let file_path = path.join(folder_path, Playername + ".json");
                    if (fs.existsSync(file_path) == false) {
                        fs.writeFileSync(file_path, playerfile);
                    }
                    else {
                        let folder_path = path.join(mainFolderpath, secondTeamname)
                        let file_path = path.join(folder_path, Playername + ".json");
                        let content = fs.readFileSync(file_path);
                        let ans = JSON.parse(content);
                        ans.push(obj);
                        let contentInFile = JSON.stringify(ans);
                        fs.writeFileSync(file_path, contentInFile);
                    }
                }
            }
        }
        whichTeam = 2; // after 1st table change counter to team 2 
    }
    whichTeam = 1; // after team 2 content is over change counter to 1 so that next time we can repeat the sam process



}

module.exports =
{
    mdfn: matchesdata
}