<h1> DnDWebsite </h1>
Website to write and store data of races, cultures and places.

<h2> To run it </h2>

1. You need to install on your computer:
  -java 17
  -node
  -postgreSQL

2. Open DnDWebsite\src\main\resources\application.yml.
  At line 10 and 11 you need to enter your user and password to postgreSQL and at line 9 you need to write database name at the end replacing "/dnd" with your database name that you created in postgreSQL.

Alternate step 3. Open this main folder in your IDE and run it from src/main/java/com.as.dndwebsite/DnDWebsiteApplication
(Temporary this doesn't work) 3. Run DnDWebsite-{VERSION_NUMBER}.jar file from the main path. (not original and also to have better controll, do it with terminal with command java -jar DnDWebsite-1.0.jar, unless you want to close this application with some task menagger)

4. Open in terminal frontend folder "DnDWebsite\src\main\frontend" and write to commands "npm install" and after all have been installed "npm start".
