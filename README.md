# 16colorsSynchronetAPIviewer
This is a Door for Synchronet BBS software that displays ANSI files from the 16colors.net archive via their API.

It will allow you to : <br>1) List the packs in a year <br>2) Select a Pack and List the Files and<br> 3) Select and View a File

This uses synchronets javascript functions combined with the 16colors.net api and file structures, to display ansi from their massive library without having to download the archive.  I cobbled this together in under a day with some tips from the 16colors guys and their approval to tap into the API and grab files.  

To install on Synchronet, it is the same as any other Javascript Executable.  In SCFG, it would look something like, provided you've saved the 16colors.js in a directory /xtrn/16colors/:

...SCFG... (everything else default values are fine)<br>
Name       :                Sixteen Colors Archive       <--- any name is fine<br>
Internal Code      :        16COLORS                     <--- your own code<br>
Start-up Directory    :     ../xtrn/16colors             <--- where the file is<br>
Command Line          :     ?16colors.js                 <--- the filename preceded by a "?"<br>
Multiple Concurrent Users : Yes                          <--- multiple users can use at once<br>
<br>
Since this took a day to complete, I basically completed what I consider core functionality - getting lists of files and viewing them.  I'm sure you can think of some improvements, and I also encourage you to try getting your feet wet if you can muster the courage.  Obviously, you are welcome to fork or improve or modify this code. I may improve it some, but I consider this a good start and suitable of release.  

 Feel free to shoot suggestions, donations or job offers (seriously), my way.  
