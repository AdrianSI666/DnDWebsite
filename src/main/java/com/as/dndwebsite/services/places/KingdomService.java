package com.as.dndwebsite.services.places;

import com.as.dndwebsite.domain.Image;
import com.as.dndwebsite.domain.places.Continent;
import com.as.dndwebsite.domain.places.Kingdom;
import com.as.dndwebsite.exception.BadRequestException;
import com.as.dndwebsite.exception.NotFoundException;
import com.as.dndwebsite.repository.places.ContinentRepository;
import com.as.dndwebsite.repository.places.KingdomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

import static com.as.dndwebsite.services.places.ContinentService.CONTINENT_NOT_FOUND_MSG;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class KingdomService {
    private final KingdomRepository kingdomRepository;
    private final ContinentRepository continentRepository;
    private final static String KINGDOM_NOT_FOUND_MSG =
            "kingdom with name %s not found";

    public List<Kingdom> getkingdoms() {
        log.info("Getting kingdoms");
        return kingdomRepository.findAll();
    }

    public Kingdom getkingdom(String name) {
        log.info("Getting kingdom");
        return kingdomRepository.findByName(name).orElseThrow(
                () -> new NotFoundException(String.format(KINGDOM_NOT_FOUND_MSG, name)));
    }

    public Kingdom savekingdom(Kingdom kingdom) {
        log.info("Saving new kingdom {}",kingdom.getName());
        return kingdomRepository.save(kingdom);
    }

    public Kingdom updatekingdom(Kingdom kingdom){
        return kingdomRepository.save(kingdom);
    }

    public void deletekingdom(Long id){
        kingdomRepository.deleteById(id);
    }

    public void saveImageToKingdom(MultipartFile file, Long id){
        try {
            byte[] image= file.getBytes();
            log.info("Saving file to kingdom {}",id);
            if(image.length>0){
                Kingdom kingdom=kingdomRepository.findById(id).orElseThrow(()-> new NotFoundException(String.format(KINGDOM_NOT_FOUND_MSG, id)));
                log.info("File original name: " + file.getOriginalFilename());
                log.info("File name: " + file.getOriginalFilename());
                kingdom.getImages().add(new Image(image,file.getOriginalFilename()));
            }
        }catch (IOException e){
            throw new BadRequestException("Couldn't read file." + e.getMessage());
        }
    }

    public List<Kingdom> getKingdomsRelatedToContinent(String name){
        Continent continent = continentRepository.findByName(name).orElseThrow(() -> new NotFoundException(String.format(CONTINENT_NOT_FOUND_MSG, name)));
        return kingdomRepository.findAllByContinent(continent);
    }
}
