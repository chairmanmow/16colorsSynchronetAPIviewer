load("sbbsdefs.js");
load("http.js");
console.clear();
console.attributes = BG_BLACK|WHITE;
var siteRoot = "http://sixteencolors.net";
var apiRoot = "http://api.sixteencolors.net/v0";
var itemsPerPage = 30;

var theYear;
var thePacks;
var currentPack;
var currentPackList = [];
var currentAnsiFile;
menuOptions = [{hotkey:"Y", description:"Select a Year"},{hotkey:"P", description:"Select Pack from Current Year " + theYear},{hotkey:"B", description:"Browse Ansi's in Pack " + currentPack},{hotkey:"X", description:"Exit Program"}]
try{
	selectAYear();  
} 
catch(err){
	if(err == "quit"){
		console.clear();
		console.putmsg("\1cLooks like you've chosen to quit\r\n\1nThanks for using the 16 colors ANSI viewer.\r\n\1hCheck out my other projects at github/chairmanmow\r\n")
	} else {
		console.putmsg("\1h\1r\1iCrash detected, restarting");
		console.pause();
		console.clear();
		selectAYear();
	}
}
// selectAYear()--> browsePacksInYear() --> findPagesInAYear() --> displayPackPage() --> selectAPack() --> getListFromPack() -->  askForAnsiFromPack() --> grabAnsi() --> print();


function showGlobalPrompt() {
	packPromptStr = "";
	if(currentPack == ""){
		packPromptStr = "\1h\1rYou must select a Pack!";
	} else {
		packPromptStr = currentPack;
	}
	console.putmsg("\r\n\1h\1m16colors.net archive \1y*** \1cYear: \1w" + theYear + " \1cPack: \1w" + packPromptStr + "\r\n");
}
// 1. //http://api.sixteencolors.net/v0/year  -- get list of years
// Sample Data // {"packs":690,"year":1997}

function selectAYear(){
		console.putmsg("\r\n\1h\1wSelect a Year\r\n");
		choice = -1;
		while(choice < 1990 || choice > 2015){
			console.putmsg("\1h\1cEnter a year from 1990 to 2015\1y--> " );
			choice = console.getnum();
		}
		theYear = choice;
		currentPack = "";
		browsePacksInYear(theYear);
}

// 2. //http://api.sixteencolors.net/v0/year/1997 -- grab a year (this one has over 600 paks![pagination])
// sample return data: need name // [{"name":"01ninja","filename":"01ninja.zip","groups":[],"year":1997,"month":null},
 

function selectAPack(){
		console.putmsg("\r\n\1rSelect a Pack Number.  ");
		choice = -1;
		var packLength = thePacks.length - 1;
		while(choice < 0 || choice > packLength){
			console.putmsg("\1yEnter a number from 0 to " + packLength);
			choice = console.getnum();
		}
		currentPack = thePacks[choice].name;
		askForAnsiFromPack(currentPack);
		console.clear();
		console.print(grabAnsi(askForAnsiFromPack(currentPack)));
	}

function browsePacksInYear(aYear){
	currentPage = 1;
	numberOfPages = findPagesInYear(aYear);

	//console.putmsg("\1h\1yTotal Packs Received  approx\1c " + numberOfPages * 30 + "\r\n");
	displayPackPage();
		while(currentPack == ""){
		pageNavPrompt();

		}


}

function displayPackPage(){
			for(i=0;i<thePacks.length;i++){
			var aPack = thePacks[i];
			console.putmsg("\1g " + i + " \1cName \1r -- \1h\1y " + aPack.name +"\r\n" ); //+ "\1y yearr:\1h\1m " + aPack.year + "\r\n"
		}
}
function pageNavPrompt(){
	pageNavOptions = [{hotkey:"S", description:"Select Pack and List Files"},{hotkey:"N", description:"Next Page of Packs"},{hotkey:"P", description:"Previous Page of Packs"},{hotkey:"J", description:"Jump to Page Number"},{hotkey:"Y", description:"Select a Year"},{hotkey:"X", description:"Exit Program"}]
	showGlobalPrompt();

	console.putmsg("\1m Enter a choice ")
	for(i=0;i<pageNavOptions.length;i++){
		console.putmsg("\1g" + pageNavOptions[i].hotkey +"\1h\1y, " )
	}
	console.putmsg("\1h ?\1i\1r:\1n\r\nPage \1h\1y" + currentPage + "\1n of \1y" + numberOfPages);
	var pagePromptSel = console.getkey();
	switch(pagePromptSel.toUpperCase()){
		case "S" :
			selectAPack();
			return;
		case "N" :
			if(currentPage + 1 <= numberOfPages){
				currentPage++;
				checkPageListing();
				displayPackPage();
				return;
			} else {
					console.putmsg("\1rLast Page Reached!\r\n");
					break;
			}
		case "P" :
			if(currentPage - 1 > 0){
				currentPage--;
				checkPageListing();
				displayPackPage();
				return;
			} else {
				console.putmsg("\1rYou are on the first page!\r\n")
					break;
			}
		case "J" :
			choice2 = -1;
			while(choice2 < 1 || choice2 > numberOfPages){
				console.putmsg("\1h\1rSelect a Page number \1y--> ");
				choice2 = console.getnum();
			}
			currentPage = parseInt(choice2);
			checkPageListing();
			displayPackPage();
		return;
		case "Y" :
			selectAYear();
			return;
			case "?" :
			console.putmsg("\r\n");
			for(i=0;i<pageNavOptions.length;i++){
				console.putmsg(pageNavOptions[i].hotkey + " --- " + pageNavOptions[i].description + "\r\n" )
			}
			break;
		case "X" :
			throw("quit");
			default :
			console.putmsg("Enter a Valid Selection\r\n");
			break;
	}

function checkPageListing(){
		request2 = new HTTPRequest();
		completeYearEndpoint = apiRoot + "/year/" + theYear + "?page=" + currentPage + "&rows=30";
		
		entireYearResponse = request2.Get(completeYearEndpoint);

		thePacks = JSON.parse(request2.body);
	}

}

function findPagesInYear(aYear){
	theYear = aYear;
	request = new HTTPRequest();
	aYearEndpoint = apiRoot + "/year/" + aYear + "?p=1&rows=30";
	aYearResponse = request.Get(aYearEndpoint);
	packsByYearList = request.body;	
	//the next 12 or so lines basically are a way of parsing the header to figure out how many pages of packs there are.

	var pageLinkInfo = "";
		for(i=0;i<request.response_headers.length;i++){
			var paramStr = request.response_headers[i];
			if(paramStr.substring(0,5) == "Link:"){
				pageLinkInfo = paramStr;
			break;
			}
		}
	thePacks = JSON.parse(request.body);
	pageLinkInfo = pageLinkInfo.replace("\\","");
	matchLoc1 = pageLinkInfo.indexOf('>; rel="last"');
	numberOfPages = pageLinkInfo.substring(matchLoc1-30,matchLoc1);
	matchLoc2 = numberOfPages.indexOf("page=");
	matchLoc3 = numberOfPages.indexOf("&rows")
	numberOfPages = numberOfPages.substring(matchLoc2+5,matchLoc2 + 7);
	numberOfPages = parseInt(numberOfPages);
	console.putmsg("\r\n\1h\1w" + theYear + "\1m\1h Number of Pages : \1h " + numberOfPages + " \1yApproximate Packs : " + numberOfPages * 30 + " \r\n\r\n");
	return numberOfPages;
}


// PART THREE CHECK FILES IN A PACK GIVEN A STRING WITH THE PACK NAME AND RETRIEVE THE FILE AND DISPLAY IT

// 3. http://api.sixteencolors.net/v0/pack/01ninja -- Get pack details and file contents  -
//{"fullsize":"/pack/01ninja/FZ-BLUE.ANS/fullscale","uri":"/pack/01ninja/FZ-BLUE.ANS","filename":"FZ-BLUE.ANS","pack":{"uri":"/pack/01ninja","name":"01ninja","filename":"01ninja.zip"},
//"file_location":"/pack/01ninja/FZ-BLUE.ANS/download","thumbnail":"/pack/01ninja/FZ-BLUE.ANS/preview"},{

function getListFromPack(pack){
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
	console.clear();
	console.putmsg("\1h\1r" + pack + "\r\n");
	packList = currentPackList;
		for(i=0;i<packList.length;i++){
			var ansiFile = packList[i];
			console.putmsg("\1y\1h " +i +" \1w  " + ansiFile.filename + "\r\n");
		}
}

function askForAnsiFromPack(pack){
	thePackList = getListFromPack(pack);
	packListLength = thePackList.length - 1;
	if(packListLength < 0){
		console.putmsg("\1r\r\nNo valid files found in Pack, blame me or blame sixteen colors.\r\n\1c Returning to pack Selection");
		selectAYear();
		return;
	}
	displayPackList(pack);  //for convenience  interface TBD
	while(1){
	choice = "";
			showGlobalPrompt();
			console.putmsg("Enter a number from 0 to " + packListLength + "\r\n or \1yC \1nto change Packs or\1y D\1n to Display files or\1y X\1n to exit");
			choice = console.getstr();

		if(choice.toUpperCase() == "C"){
			selectAYear();
			return;
		}else if(choice.toUpperCase() == "D"){
			displayPackList(pack); 
		} 
		else if(choice.toUpperCase() == "X"){
			throw("quit");
		} else if(parseInt(choice) != NaN) {
			if(parseInt(choice) < 0 || parseInt(choice) > packListLength){
				console.putmsg("\r\n\1\rEnter a valid number\r\n");
			} else {
				ansiChoice = thePackList[parseInt(choice)];
				ansiChoiceDownload = ansiChoice.file_location;
				console.putmsg(ansiChoiceDownload);
				grabAnsi(ansiChoiceDownload);
				console.clear();
				console.print(currentAnsiFile);
				console.pause();
				console.clear();
				displayPackList(pack);
				}
		} else {
			console.putmsg("\1r\r\nInvalid Selection.\r\n")
		}
	}	
	return ansiChoiceDownload;	
}


//console.print(grabAnsi(askForAnsiFromPack("blocktronics_wtf4")));


//4. http://sixteencolors.net/pack/01ninja/FZ-BLUE.ANS/download -- use file location parameter to get the download URL (dont use 'api' prefix)

//console.print(grabAnsi("/pack/01ninja/FZ-BLUE.ANS/download"));;

function grabAnsi(fileLocation){
	var request = new HTTPRequest();
	var ansiRoute = siteRoot + fileLocation;
	ansiResponse = request.Get(ansiRoute);
	var ansiBody = request.body;
	currentAnsiFile = ansiBody;
	return ansiBody;

}