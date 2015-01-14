# 16colorsSynchronetAPIviewer
This is a Door for Synchronet BBS software that displays ANSI files from the 16colors.net archive via their API.

It will allow you to 1) List the packs in a year 2) Select a Pack and List the Files and 3) Select and View a File

This uses synchronets javascript functions combined with the 16colors.net api and file structures, to display ansi from their massive library without having to download the archive.  I cobbled this together in under a day with some tips from the 16colors guys and their approval to tap into the API and grab files.  

To install on Synchronet, it is the same as any other Javascript Executable.  In SCFG, it would look something like, provided you've saved the 16colors.js in a directory /xtrn/16colors/:


                  Sixteen Colors Archive                  │                   │▒▒▒▒
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒├──────────────────────────────────────────────────────────┤                   │▒▒▒▒
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│ │Name                       Sixteen Colors Archive       │                   │▒▒▒▒
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│ │Internal Code              16COLORS                     │                   │▒▒▒▒
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│ │Start-up Directory         ../xtrn/16colors             │                   │▒▒▒▒
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│ │Command Line               ?16colors.js                 │                   │▒▒▒▒
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│ │Clean-up Command Line                                   │                   │▒▒▒▒
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│ │Execution Cost             None                         │───────────────────┘▒▒▒▒
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│ │Access Requirements                                     │▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│ │Execution Requirements                                  │▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│ │Multiple Concurrent Users  Yes                          │▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│ │Intercept I/O              No                           │▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│ │Native Executable          No                           │▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│ │Use Shell to Execute       No                           │▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│ │Modify User Data           No                           │▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│ │Execute on Event           No                           │▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
▒▒▒▒┌[?][?]────────────│ │Pause After Execution      No                           │▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
▒▒▒▒│          Online P│ │BBS Drop File Type         None                         │▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
▒▒▒▒├──────────────────│ │Place Drop File In         Node Directory               │▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
▒▒▒▒│ │NewSchool BBS Ga│ │Time Options...              

Since this took a day to complete, I basically completed what I consider core functionality - getting lists of files and viewing them.  I'm sure you can think of some improvements, and I also encourage you to try getting your feet wet if you can muster the courage.  Obviously, you are welcome to fork or improve or modify this code. I may improve it some, but I consider this a good start and suitable of release.  

 Feel free to shoot suggestions, donations or job offers (seriously), my way.  
