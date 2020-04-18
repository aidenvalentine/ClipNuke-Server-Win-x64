TITLE ClipNuke Node
@echo off
set freePort=
set startPort=2000

:SEARCHPORT
netstat -o -n -a | find "LISTENING" | find ":%startPort% " > NUL
if "%ERRORLEVEL%" equ "0" (
  echo "port unavailable %startPort%"
  set /a startPort +=1
  GOTO :SEARCHPORT
) ELSE (
  echo "port available %startPort%"
  set freePort=%startPort%
  GOTO :FOUNDPORT
)

:FOUNDPORT
echo free %freePort%
java.exe -jar ./selenium-server-standalone-3.8.1.jar -role node -port %freePort% -hub http://localhost:4444/grid/register -maxSession 1

set ip_address_string="IPv4 Address"
set java_path="%ProgramFiles%/Oracle/Java/javapath/"
echo ClipNuke Node Connection Test
for /f "usebackq tokens=2 delims=:" %%f in (`ipconfig ^| findstr /c:%ip_address_string%`) do echo Your ClipNuke Node IP Address is: %%f
cd %ProgramFiles%/Oracle/Java/javapath/