<h1> DnDWebsite </h1>
Website to write and store data of races, cultures and places.

Main view of adding new entry.
![Temporary look of how the website look](META-INF/cultures07.2024.png)
Description board.
![Description board](META-INF/descriptions07.2024.png)
Adding images and linking cultures to regions.
![Images and links](META-INF/imagesNLinks07.2024.png)

<h2> How to run it locally </h2>

1. You need to install on your computer:
  - Java 17,
  - Node,
  - PostgreSQL

OR using Docker
 - Docker

2. Create an .env file in main folder with specified values:
- `DBUSERNAME=username` - name of user which have access to database you want to use 
- `DBPASSWORD=yourpassword` - password used for specified user in database
- `DBURL=name:port` - on which your database function,
if you use docker this value should be a name given to container that runs your database,
for example "database" as specified in docker-compose.yaml file at line 4.
- `DBNAME=name` - name of created database, you need to create it before you can run the application. 
Just an empty database is sufficient
- If you want to use https (online hosting):
  - `SSLPASSWORD=yourpassword` - password to ssl keystore containing private and public key certificate if you want to run it via internet in https.
  To generate this keystore I recommend this tutorial https://medium.com/@mckinseydigital/expose-https-spring-endpoints-using-self-signed-certificate-and-configure-channels-to-verify-the-ed97d626cdea .

3. Create second .env file for frontend folder in location "src/main/frontend/" with values:
- `SECURE_LOCAL_STORAGE_HASH_KEY` - private hash key that's used to keep token on user site safe. It needs to be at least 128 bites long. 
- If you want to use https (online hosting):
  - `HTTPS="true"` - information to react to run server in https mode.
  - `SSL_CRT_FILE` - localization of certification file (public key)
  - `SSL_KEY_FILE` - localization of private key

4. To run this by hand:
- Open main folder in your IDE and run program from file located in src/main/java/com.as.dndwebsite/DnDWebsiteApplication .
If you want to close it, just exit your IDE or stop it via options available in IDE.
- Open in terminal frontend folder "DnDWebsite\src\main\frontend" and write to commands `npm install` and after all have been installed `npm start`.
If you want to close it, click `ctrl+c` in terminal in which you ran earlier commands.

OR using docker
- Create docker image for backend from main folder using `Dockerfile` via command `docker build`
- Create docker image for frontend from "src/main/frontend" using the same method as above
- Create docker image for database, instruction for that are located in database folder, either follow them
or pull database image from docker hub and after that add a new database inside of it named like name you specified before in .env file.
- When you have them all created as images you can run them via `Docker-compose.yaml` file, but first update names to match
those of created images, then run it via command `docker-compose up`. Then in the same terminal you can close them via clicking
`ctrl+c`, or if you ran `docker compose up -r` to have free terminal use command `docker-compose stop`. To restart them later
use command `docker-compose start`.

That's it, you have running application where you can describe your world and when you meet for session you can show them
what you made. This application is still under development to be able to connect and show everything via internet.