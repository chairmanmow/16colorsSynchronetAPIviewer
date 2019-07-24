# I have no idea if this still works against the current 16colors api
Last I tried to use this 16colors was down for a long time and I think they changed it around.  It was also really bad at handling the error for when the site was down.  If anyone wants me to look at this again, let me know, but for now I'd expect it not to work without some modification (2019)

# 16colorsSynchronetAPIviewer
THIS IS A WORKING FIRST VERSION - IF YOU INSTALL, PLEASE STAR, FOLLOW OR KEEP AN EYE ON THIS PROJECT FOR UPDATES.  PLANNED SECOND VERSION WILL LIKELY INCORPORATE COMMENTING AND UPVOTING THAT WILL BE INTERBBS-CAPABLE IN ORDER TO CREATE A NEW BROWSING MODE TO BETTER NAVIGATE THE ARCHIVE.

This is a Door for Synchronet BBS software that displays ANSI files from the 16colors.net archive via their API.

It will allow you to : <br>1) List the packs in a year <br>2) Select a Pack and List the Files and<br> 3) Select and View a File

This uses synchronets javascript functions combined with the 16colors.net api and file structures, to display ansi from their massive library without having to download the archive.  I cobbled this together in under a day with some tips from the 16colors guys and their approval to tap into the API and grab files.  

To install on Synchronet, it is the same as any other Javascript Executable.  In SCFG, it would look something like, provided you've saved the 16colors.js in a directory /xtrn/16colors/:

...!!! * SCFG SETTINGS * !!!... (everything else default values are fine)<br><br>
Name       :                Sixteen Colors Archive       <--- any name is fine<br>
Internal Code      :        16COLORS                     <--- your own code is fine just needs to be unique<br>
Start-up Directory    :     ../xtrn/16colors             <--- where the file is<br>
Command Line          :     ?16colors.js                 <--- the filename preceded by a "?"<br>
Multiple Concurrent Users : Yes                          <--- multiple users can use at once<br>
<br><br>
Since this took a day to complete, I basically completed what I consider core functionality - getting lists of files and viewing them.  I'm sure you can think of some improvements, and I also encourage you to try getting your feet wet if you can muster the courage.  Obviously, you are welcome to fork or improve or modify this code. I may improve it some, but I consider this a good start and suitable of release.  

<br><br>
I added some new features.  Nothing too fancy but there's like a slide show option where all the ANSI's in a pack roll by for you to zone out off of, and you can throttle ansi's to show at simulated modem speeds.


 Feel free to shoot suggestions, bug reports or money my way should you want something.
