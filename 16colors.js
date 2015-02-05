// main() -->
// setModemSpeed() --> selectAYear()--> browsePacksInYear() --> findPagesInAYear() --> displayPackPage() 
// --> selectAPack() --> getListFromPack() -->  askForAnsiFromPack() --> grabAnsi() --> showAnsi();

load("sbbsdefs.js");
load("http.js");
load("json-client.js");

console.clear();
console.attributes = BG_BLACK|WHITE;
var siteRoot = "http://sixteencolors.net";
var apiRoot = "http://api.sixteencolors.net/v0";
var itemsPerPage = 30;
var filter = true;
var theYear;
var thePacks;
var currentPack;
var currentPackList = [];
var currentAnsiFile;
var modemSpeed = 9;

menuOptions = [{hotkey:"Y", description:"Select a Year"},{hotkey:"P", description:"Select Pack from Current Year " + theYear},{hotkey:"B", description:"Browse Ansi's in Pack " + currentPack},{hotkey:"X", description:"Exit Program"}]

main();
function main(){
try{
	setModemSpeed();
	selectAYear();  
	} 
	catch(err){
		if(err == "quit"){
			console.clear();
			console.putmsg("\1cLooks like you've chosen to quit\r\n\1nThanks for using the 16 colors ANSI viewer.\r\n\1hCheck out my other projects at github/chairmanmow\r\n\1yOr visit my BBS: \1wfutureland.grudgemirror.com\r\n");
			console.pause();
		} else {
			console.putmsg("\1h\1r\1iCrash detected, restarting");
			console.putmsg("\r\n\1y" + err);
			console.pause();
			console.clear();
			main();
		}
	}
}

//this function sets the global modemSpeed var
function setModemSpeed(speed){
		if(speed == undefined  || speed < 1){
			console.putmsg("\r\n\1h\1cEnter Your Simulated Modem Speed.\r\n\r\n");
			speed = -1;
				while(speed < 0 || speed > 128){
					console.putmsg("\1h\1mCurrent Speed\1g=\1r "+ modemSpeed+ "000\1c bps\r\n\r\n\1h\1yEnter a number from \1w1 \1yto \1w128 \1y or Enter to keep current speed\1r--> ");
					speed = console.getnum();
					if(speed <= 0){
						speed = modemSpeed;
					}
				}
		} 
	modemSpeed = parseInt(speed);
	console.putmsg("\r\n\1h\1wModem Speed set to \1r" + modemSpeed + "000 \1ybps\r\n")
}

//a prompt that gets displayed to remind you what you're browsing and at whatspeed
function showGlobalPrompt() {
	packPromptStr = "";
		if(currentPack == ""){ packPromptStr = "\1h\1rYou must select a Pack!"; } else { packPromptStr = currentPack;}
		console.putmsg("\r\n\1h\1m16colors.net archive \1y**\1r" + modemSpeed + "000\1wbps\1y**: \1cYear: \1w" + theYear + " \1cPack: \1w" + packPromptStr + "\r\n");
}

//selects the year that you want to look at packs from.
function selectAYear(aYear){
		if(aYear == undefined  || aYear < 1990 || aYear > 2015){
			console.putmsg("\r\n\1h\1wSelect a Year\r\n");
			aYear = -1;
				while(aYear < 1990 || aYear > 2015){
					console.putmsg("\1h\1cEnter a year from 1990 to 2015\1y--> " );
					aYear = console.getnum();
				}
		}
	theYear = aYear;
	currentPack = "";  //there is a switch that relies on currentPack being used as a blank string
	browsePacksInYear(theYear); 
}

//looks at packs from a given year
function browsePacksInYear(aYear){
	currentPage = 1;
	numberOfPages = findPagesInYear(aYear);
	displayPackPage();
		while(currentPack == ""){ pageNavPrompt();}
}

//This is an http function to find out how many pages worth of packs there are in a year.

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
	approxResults = numberOfPages * 30 - 29;
	console.putmsg("\r\n\1h\1w" + theYear + "\1m\1h Number of Pages : \1h " + numberOfPages + " \1yApproximate Packs : " + approxResults + "-" + numberOfPages * 30 + " \r\n\r\n");
	return numberOfPages;
}
//this is an http function to check a page besides the first one.
function checkPageListing(){
		request2 = new HTTPRequest();
		completeYearEndpoint = apiRoot + "/year/" + theYear + "?page=" + currentPage + "&rows=30";	
		entireYearResponse = request2.Get(completeYearEndpoint);
		thePacks = JSON.parse(request2.body);
}



//display the packs from a year as a list, etc files in a directory
function displayPackPage(){
		for(i=0;i<thePacks.length;i++){
			var aPack = thePacks[i];
			console.putmsg("\1g " + i + " \1cName \1r -- \1h\1y " + aPack.name +"\r\n" ); //+ "\1y yearr:\1h\1m " + aPack.year + "\r\n"
		}
}
//really messy function that controls navigating through a year.
function pageNavPrompt(){
	showGlobalPrompt();
	console.putmsg("\1m Enter a choice ")
	pageNavOptions = [{hotkey:"S", description:"Select Pack and List Files"},{hotkey:"N", description:"Next Page of Packs"},{hotkey:"P", description:"Previous Page of Packs"},{hotkey:"J", description:"Jump to Page Number"},{hotkey:"Y", description:"Select a Year"},{hotkey:"M", description:"Set Modem Speed"},{hotkey:"X", description:"Exit Program"}]

		for(i=0;i<pageNavOptions.length;i++){
			console.putmsg("\1g" + pageNavOptions[i].hotkey +"\1h\1y, " )
		}

	console.putmsg("\1h ?\1i\1r:\1n\r\nPage \1h\1y" + currentPage + "\1n of \1y" + numberOfPages);
	var pagePromptSel = console.getstr();

		if(parseInt(pagePromptSel) < thePacks.length && parseInt(pagePromptSel) >= 0) {
			selectAPack(parseInt(pagePromptSel));
		} else { 
			switch(pagePromptSel.toUpperCase()){
				case "S" :
				currentPack = "";
					browsePacksInYear(theYear);
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
				case "M" :
					setModemSpeed();
					break;
				case "X" :
					throw("quit");
				default :
					console.putmsg("Enter a Valid Selection\r\n");
					break;
			}
		}
	}

function selectAPack(packNum){
	choice = packNum;
	currentPack = thePacks[choice].name;
	askForAnsiFromPack(currentPack);
}


//http function to get a list of files from a pack with optional extension filtering.
function getListFromPack(pack,filterOff){
	var request = new HTTPRequest();
	var packRoute = apiRoot + "/pack/" + pack;
	var packResponse = request.Get(packRoute);
	var rawPackList = request.body;
	//let's parse the list to get the ansi and other stuff after we filter by extebsion
	var parsedResponse = JSON.parse(rawPackList);
	var ansiFiles = parsedResponse.files;
	var filteredFiles = [];
		for(i=0;i<ansiFiles.length;i++){
			ansiFile = ansiFiles[i];
			ansiFileExt = ansiFile.filename.substring(ansiFile.filename.length - 3,ansiFile.filename.length).toUpperCase();
				if(filterOff == true){if(ansiFileExt != "EXE" && ansiFileExt != "COM" && ansiFileExt != "GIF" && ansiFileExt != "JPG"){ filteredFiles.push(ansiFile)}
					} else {
						if(ansiFileExt == "ASC" || ansiFileExt == "ANS" ||ansiFileExt == "TXT" ) {filteredFiles.push(ansiFile); }
				}			
		}
	currentPackList = filteredFiles;
	return filteredFiles;
}

//function to display files from preceding function getListFromPack()

function displayPackList(pack){
	console.clear();
	console.putmsg("\1h\1r" + pack + "\r\n");
	packList = currentPackList;

		for(i=0;i<packList.length;i++){
			var ansiFile = packList[i];
			console.putmsg("\1y\1h " +i +" \1n\1m*\1c --\1m *\1w\1h " + ansiFile.filename + "\r\n");
		}
}


//after you selected a Pack this will be your prompt to choose an ANSI to display
function askForAnsiFromPack(pack){
	thePackList = getListFromPack(pack);
	packListLength = thePackList.length - 1;
	if(packListLength < 0){
		console.putmsg("\1r\r\nNo valid files found in Pack, blame me or blame sixteen colors.\r\n\1c Enter \1h\1yY\1n if you want to see an unfiltered version with more files\r\nSometimes ansi groups use different file extensions, however, there may be some unviewable files.");
		if(console.getkey(K_UPPER) ==  "Y"){
			thePackList = getListFromPack(currentPack,true);
			packListLength = thePackList.length - 1;
		} else {
			selectAYear();
			return;
		}
	}
	displayPackList(pack);  //for convenience  interface TBD

	while(1){
		choice = "";
		showGlobalPrompt();
		console.putmsg("Enter a number from 0 to " + thePackList.length - 1 + "\r\n or \1yA \1n- ll at once \1yC \1n- change Packs or \1yM\1n - Modem speeds or\1y D\1n -Display files or\1y X\1n to exit");
		choice = console.getstr();

		if(choice.toUpperCase() == "C"){
			currentPack = "";
			browsePacksInYear(theYear);
			return;
			}else if (choice.toUpperCase() == "A"){
				showAllAnsisInPack();
			}else if(choice.toUpperCase() == "D"){
				displayPackList(pack); 
			} else if(choice.toUpperCase() == "M"){
			setModemSpeed(); 
		} 
		else if(choice.toUpperCase() == "X"){
			throw("quit");
		} else if(parseInt(choice) == NaN){
			console.putmsg("\1h\r\nINVALID SELECTION\r\n");
		} 
		else if(parseInt(choice) != NaN && parseInt(choice) >= 0 && parseInt(choice) <= packListLength) {
				ansiChoice = thePackList[parseInt(choice)];
				ansiChoiceDownload = ansiChoice.file_location;
				console.putmsg("\1m" + ansiChoiceDownload + "\r\n");
				grabAnsi(ansiChoiceDownload);
				console.putmsg("\1cYour Ansi will display after you press a key. \r\n\1h\1r\1iPRESS \1yQ\1r TO ABORT ANSI DISPLAY\r\n");
				console.pause;
				console.clear();
				showAnsi();
				console.pause();
				console.clear();
				displayPackList(pack);
		} else {
			console.putmsg("\r\n\1rMake a valid selection\r\n");	
		}
	}
}	

//this function will go through all ANSI's in a pack and display them as more of a slidehosw
function showAllAnsisInPack(){		
	var i;
	console.putmsg("Enter \1h\1yY\1n to clear & pause between AnSIs");
	var clearScreen = console.getkey().toUpperCase();
		for(i=0;i<thePackList.length;i++){
				if(clearScreen == "Y"){console.clear();}
			ansiToGet = thePackList[i];
			console.putmsg("\r\n\1h\1g\r\n UPCOMING \1r *** \1y" + ansiToGet.file_location + " \1yOr***\1g BELOW\r\n\r\n\1n");	
			grabAnsi(ansiToGet.file_location);
				if(console.inkey(K_UPPER, 500) == "Q"){ break; }
			showAnsi();
			console.putmsg("\r\n\1h\1c\r\n THAT WAS \1m *** \1w" + ansiToGet.file_location + " \1m***\1c ABOVE\r\n\r\n\1n");
		}
}

//this is  the function that chunks and displays the ansi, throttling it in the process
function showAnsi(){
	currentAnsiFileChunk = currentAnsiFile.split("");
	 while(currentAnsiFileChunk.length > 0) { 
	 		console.write(currentAnsiFileChunk.splice(0,modemSpeed).join(""));
                  if(console.inkey(K_UPPER, 1) == "Q"){ break; }
        }
}

//this goes and grabs the ANSI and puts it in a global variable containing the current ANSI
function grabAnsi(fileLocation){
	var request = new HTTPRequest();
	var ansiRoute = siteRoot + fileLocation;
	ansiResponse = request.Get(ansiRoute);
	var ansiBody = request.body;
	currentAnsiFile =  ansiBody;
	return ansiBody;
}
