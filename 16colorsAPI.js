load("sbbsdefs.js");
load("http.js");

var siteRoot = "http://sixteencolors.net";
var apiRoot = "http://api.sixteencolors.net/v0";
var itemsPerPage = 30;

var theYear;
var currentPackList = [];
// 1. //http://api.sixteencolors.net/v0/year  -- get list of years
// Sample Data // {"packs":690,"year":1997}

function checkYearListings(){
	request = new HTTPRequest();
	yearEndpoint = apiRoot + "/year";
	yearResponse = request.Get(yearEndpoint);
	yearList = request.body;
	console.putmsg("If the following number is more than 24 or 25 there's a bug-> " + yearList.length + "\r\n It represents this data length of \r\n\1r\1h" + JSON.stringify(yearList));  //length returns 653 for some reason BUG
	console.pause();
	return yearList;
}
theYearList = checkYearListings();

//BUG ELABORATION
//displayYears shows 653 items in the yearList Array should be more like 25 (1990-2015) and keys don't mach up with data
//in other words the following function is motherfunked

function displayYears(){
	for(i=0;i<theYearList.length;i++){
		var yearInfo = theYearList[i];
		console.putmsg("\1y\1h" + i + "\1w" + yearInfo.year + "\1n\1g packs : " + yearInfo.packs + "\1h pages : " + yearInfo.packs/itemsPerPage + "\r\n");
	}
}

// 2. //http://api.sixteencolors.net/v0/year/1997 -- grab a year (this one has over 600 paks![pagination])
// sample return data: need name // [{"name":"01ninja","filename":"01ninja.zip","groups":[],"year":1997,"month":null},
// 

function browsePacksInYear(aYear){
	//displayYears();
	request = new HTTPRequest();
	aYearEndpoint = apiRoot + "/year/" + aYear;
	aYearResponse = request.Get(aYearEndpoint);
	packsByYearList = request.body;
	for(key in request.response_headers){
		console.putmsg("\1m" + key + " \1h" + request.response_headers[key] +"\r\n");
	}
}

browsePacksInYear(1993);

// PART THREE CHECK FILES IN A PACK GIVEN A STRING WITH THE PACK NAME AND RETRIEVE THE FILE AND DISPLAY IT

// 3. http://api.sixteencolors.net/v0/pack/01ninja -- Get pack details and file contents  -
//{"fullsize":"/pack/01ninja/FZ-BLUE.ANS/fullscale","uri":"/pack/01ninja/FZ-BLUE.ANS","filename":"FZ-BLUE.ANS","pack":{"uri":"/pack/01ninja","name":"01ninja","filename":"01ninja.zip"},
//"file_location":"/pack/01ninja/FZ-BLUE.ANS/download","thumbnail":"/pack/01ninja/FZ-BLUE.ANS/preview"},{

function getListInPack(pack){
	var request = new HTTPRequest();
	var packRoute = apiRoot + "/pack/" + pack;
	//console.putmsg(packRoute +"\r\n")
	var packResponse = request.Get(packRoute);
	var rawPackList = request.body;
	//let's parse the list to get the ansi and other stuff after we filter by extebsion
	var parsedResponse = JSON.parse(rawPackList);
	var ansiFiles = parsedResponse.files;
	var filteredFiles = [];

		for(i=0;i<ansiFiles.length;i++){
			ansiFile = ansiFiles[i];
			ansiFileExt = ansiFile.filename.substring(ansiFile.filename.length - 3,ansiFile.filename.length).toUpperCase();
				if(ansiFileExt == "ASC" || ansiFileExt == "TXT" ||ansiFileExt == "ANS") {
					filteredFiles.push(ansiFile);
				}
		}
	currentPackList = filteredFiles;
	return filteredFiles;
}

function displayPackList(pack){
	console.putmsg("\1h\1r" + pack + "\r\n");
	packList = currentPackList;
		for(i=0;i<packList.length;i++){
			var ansiFile = packList[i];
			console.putmsg("\1y\1h" +i +"\1w  " + ansiFile.filename + "\r\n");
		}
}

function askForAnsiFromPack(pack){
	thePackList = getListInPack(pack);
	displayPackList(pack);  //for convenience  interface TBD
	choice = -1;
		while(choice < 0 || choice > thePackList.length){
			console.putmsg("Enter a numer from 0 to " + thePackList.length);
			choice = console.getnum();
		}
	ansiChoice = thePackList[choice];
	ansiChoiceDownload = ansiChoice.file_location;
	console.putmsg(ansiChoiceDownload);
	console.pause();
	console.clear();
	return ansiChoiceDownload;	
}

console.clear();
console.print(grabAnsi(askForAnsiFromPack("blocktronics_wtf4")));


//4. http://sixteencolors.net/pack/01ninja/FZ-BLUE.ANS/download -- use file location parameter to get the download URL (dont use 'api' prefix)

//console.print(grabAnsi("/pack/01ninja/FZ-BLUE.ANS/download"));;

function grabAnsi(fileLocation){
	var request = new HTTPRequest();
	var ansiRoute = siteRoot + fileLocation;
	ansiResponse = request.Get(ansiRoute);
	var ansiBody = request.body;
	return ansiBody;

}
