package com.as.dndwebsite.domain;

import lombok.*;
import org.hibernate.annotations.Type;

import javax.persistence.*;

@Entity
@Getter
@Setter
@ToString
@RequiredArgsConstructor
@AllArgsConstructor
@Table(name="image", schema = "public")
public class Image {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private long id;
        @Lob
        @Type(type = "org.hibernate.type.ImageType")
        private byte[] image;
        private String name;

        public Image(byte[] encode, String name) {
                image=encode;
                this.name=name;
        }
}
