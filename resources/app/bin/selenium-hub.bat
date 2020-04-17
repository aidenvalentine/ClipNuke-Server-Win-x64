TITLE ClipNuke Hub
rem cd c:/ProgramData/Oracle/Java/javapath/
rem javaw.exe -jar ./selenium-server-standalone-3.141.59.jar -role hub
java.exe -jar ./selenium-server-standalone-3.8.1.jar -role hub -sessionTimeout 900 -maxSession 5 -browserTimeout 900
