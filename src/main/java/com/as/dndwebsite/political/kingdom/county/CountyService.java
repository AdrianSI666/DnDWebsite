package com.as.dndwebsite.political.kingdom.county;

import com.as.dndwebsite.description.Description;
import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.dto.DescriptionDTO;
import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.EntryFullDTO;
import com.as.dndwebsite.dto.ImageDTO;
import com.as.dndwebsite.dto.PageInfo;
import com.as.dndwebsite.exception.NotFoundException;
import com.as.dndwebsite.image.Image;
import com.as.dndwebsite.mappers.DomainMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class CountyService implements ICountyService {
    private final CountyRepository countyRepository;
    private final DomainMapper<Entry, EntryDTO> mapper;
    private final DomainMapper<Description, DescriptionDTO> descriptionMapper;
    private final DomainMapper<Image, ImageDTO> imageMapper;
    public static final String COUNTY_NOT_FOUND_MSG =
            "County with name %s not found";

    @Override
    public Page<EntryDTO> getCounties(PageInfo page) {
        log.debug("Getting counties");
        Pageable paging = PageRequest.of(page.number() - 1, page.size(), Sort.by(Sort.Direction.DESC, "id"));
        Page<County> countyPage = countyRepository.findAll(paging);
        return countyPage.map(mapper::map);
    }

    @Override
    public EntryFullDTO getCounty(String name) {
        log.debug("Getting County");
        County county = countyRepository.findByName(name).orElseThrow(
                () -> new NotFoundException(String.format(COUNTY_NOT_FOUND_MSG, name)));
        Optional<EntryDTO> kingdom = Optional.empty();
        if(county.getKingdom() != null) kingdom = Optional.of(mapper.map(county.getKingdom()));
        return new EntryFullDTO(mapper.map(county),
                kingdom,
                county.getRegions().stream().map(mapper::map).toList(),
                county.getDescriptions().stream().map(descriptionMapper::map).toList(),
                county.getImages().stream().map(imageMapper::map).toList()
                );
    }

    @Override
    public EntryDTO saveCounty(EntryDTO county) {
        log.debug("Saving new County {}", county.name());
        return mapper.map(countyRepository.save(new County(county.name(), county.shortDescription())));
    }

    @Override
    public void updateCounty(EntryDTO county, Long countyId) {
        log.debug("Updating continent {} with id {}", county.name(), countyId);
        County oldCounty = countyRepository.findById(countyId).orElseThrow(
                () -> new NotFoundException(String.format(COUNTY_NOT_FOUND_MSG, countyId)));
        oldCounty.setShortDescription(county.shortDescription());
        oldCounty.setName(county.name());
    }

    @Override
    public void deleteCounty(Long id) {
        log.debug("Deleting County with id: {}", id);
        countyRepository.deleteById(id);
    }

    @Override
    public List<EntryDTO> getAllCounties() {
        return countyRepository.findAll().stream().map(mapper::map).toList();
    }
}
