start /wait powershell -Command "&{ Start-Process powershell -ArgumentList '-executionpolicy remotesigned','-File C:\Users\hduon\OneDrive\Desktop\docker_restart.ps1' -Verb RunAs}"
start /wait taskkill /IM "Docker Desktop.exe" /F
