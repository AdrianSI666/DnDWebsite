<h1> DnDWebsite </h1>
Website to write and store data of races, cultures and places.
<h3>Check branch ReactTS for latest updates</h3>

<h1>!!!!! This page went under hard reconstruction and now frontend from main branch doesn't match backend and won't work!!!!</h1>
Backend still works fine, while frontend is beeing reconstructed on branch "reactTS". When I will finish, it will merge to main again, till then you can only use or get inspiration from backend reliably.

<h2> To run it </h2>

1. You need to install on your computer:
  -java 17
  -node
  -postgreSQL

2. Open DnDWebsite\src\main\resources\application.yml.
  At line 10 and 11 you need to enter your user and password to postgreSQL and at line 9 you need to write database name at the end replacing "/dnd" with your database name that you created in postgreSQL.
  
3. Run DnDWebsite-{VERSION_NUMBER}.jar file from the main path. (not original and also to have better controll, do it with terminal with command java -jar DnDWebsite-1.0.jar, unless you want to close this application with some task menagger)
4. Open in terminal frontend folder "DnDWebsite\src\main\frontend" and write to commands "npm install" and after all have been installed "npm start".
