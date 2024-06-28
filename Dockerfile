FROM openjdk:17-jdk-temurin
MAINTAINER adrian.si
COPY target/DnDWebsite-0.0.1-SNAPSHOT.jar dndweb-0.0.1jar
ENTRYPOINT ["java","-jar","/DndWebsite-1.jar"]