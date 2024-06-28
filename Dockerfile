FROM eclipse-temurin:17
MAINTAINER adrian.si
COPY target/DnDWebsite-0.0.1-SNAPSHOT.jar dndweb-0.0.1.jar
ENTRYPOINT ["java","-jar","/DndWebsite-1.jar"]