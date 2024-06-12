package com.as.dndwebsite.maps.plane.continent.kingdom.region.regionbeast;

import com.as.dndwebsite.bestiary.Beast;
import com.as.dndwebsite.bestiary.BeastRepository;
import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import com.as.dndwebsite.exception.BadRequestException;
import com.as.dndwebsite.exception.NotFoundException;
import com.as.dndwebsite.mappers.DomainMapper;
import com.as.dndwebsite.maps.plane.continent.kingdom.region.RegionRepository;
import com.as.dndwebsite.maps.plane.continent.kingdom.region.RegionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.as.dndwebsite.maps.plane.continent.kingdom.region.Region;

import java.util.List;

import static com.as.dndwebsite.bestiary.BeastService.BEAST_NOT_FOUND_MSG;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class RegionBeastService implements IRegionBeastService {

    private final RegionRepository regionRepository;
    private final BeastRepository beastRepository;
    private final DomainMapper<Entry, EntryDTO> mapper;

    @Override
    public Page<EntryDTO> getBeastsRelatedToRegion(String name, PageInfo page) {
        Pageable paging =
                PageRequest.of(
                        page.number() - 1,
                        page.size(),
                        Sort.by(Sort.Direction.DESC, "id")
                );
        return beastRepository.findAllByRegions_Name(name, paging);
    }

    @Override
    public List<EntryDTO> getBeastsRelatedToRegion(Long id) {
        log.info("Getting beasts related to Region with id {}", id);
        return beastRepository.findAllByRegions_Id(id);
    }

    @Override
    public void addBeastToRegion(Long beastId, Long regionId) {
        Beast beast = beastRepository.findById(beastId).orElseThrow(
                () -> new NotFoundException(String.format(BEAST_NOT_FOUND_MSG, beastId)));
        Region region = regionRepository.findById(regionId).orElseThrow(
                () -> new NotFoundException(
                        String.format(RegionService.REGION_NOT_FOUND_MSG, regionId)));
        if (!region.getBeasts().add(beast)) throw new BadRequestException(
                "Region %s and Beast %s are already linked".formatted(region.getName(), beast.getName()));
        beast.getRegions().add(region);
    }

    @Override
    public void removeBeastFromRegion(Long beastId, Long regionId) {
        Beast beast = beastRepository.findById(beastId).orElseThrow(
                () -> new NotFoundException(String.format(BEAST_NOT_FOUND_MSG, beastId)));
        Region region = regionRepository.findById(regionId).orElseThrow(
                () -> new NotFoundException(String.format(RegionService.REGION_NOT_FOUND_MSG, regionId)));
        region.getBeasts().remove(beast);
        beast.getRegions().remove(region);
    }

    @Override
    public EntryDTO addNewBeastToRegion(EntryDTO beast, Long regionId) {
        Region region = regionRepository.findById(regionId).orElseThrow(
                () -> new NotFoundException(String.format(RegionService.REGION_NOT_FOUND_MSG,regionId)));
        Beast newBeast = beastRepository.save(
                new Beast(
                        beast.name(),
                        beast.shortDescription(),
                        region));
        region.getBeasts().add(newBeast);
        return mapper.map(newBeast);
    }
    @Override
    public List<EntryDTO> getRegionsRelatedToBeast(Long id) {
        return regionRepository.findAllByBeasts_Id(id);
    }

//    @Override
//    public Page<EntryDTO> getRegionsRelatedToBeast(String name, PageInfo page) {
//        Pageable paging = PageRequest.of(
//                page.number() - 1,
//                page.size(),
//                Sort.by(Sort.Direction.DESC,"id"));
//        return beastRepository.findAllByBeast_Name(name,paging);
//    }

    @Override
    public EntryDTO addNewRegionToBeast(EntryDTO region, Long beastId) {
        Beast beast = beastRepository.findById(beastId).orElseThrow(
                () -> new NotFoundException(
                        String.format(RegionService.REGION_NOT_FOUND_MSG,beastId)));
        Region newRegion = regionRepository.save(
                new Region(region.name(),region.shortDescription(),beast));
        beast.getRegions().add(newRegion);
        return mapper.map(newRegion);
    }
}
