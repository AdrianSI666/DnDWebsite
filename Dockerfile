FROM eclipse-temurin:17
MAINTAINER adrian.si
COPY target/DnDWebsite-0.0.1-SNAPSHOT.jar /
EXPOSE 8090
ENTRYPOINT ["java","-jar","/DnDWebsite-0.0.1-SNAPSHOT.jar"]