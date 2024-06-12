package com.as.dndwebsite.bestiary;

import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import com.as.dndwebsite.exception.NotFoundException;
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

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class BeastService implements IBeastService{

    private final BeastRepository beastRepository;
    public static final String BEAST_NOT_FOUND_MSG = "beast with name %s not found";
    private final DomainMapper<Entry, EntryDTO> mapper;
    @Override
    public Page<EntryDTO> getBeasts(PageInfo page) {
        log.info("Getting beasts");
        Pageable paging = PageRequest.of(
                page.number() - 1,
                page.size(),
                Sort.by(Sort.Direction.DESC,"id"));
        Page<Beast> beastpage = beastRepository.findAll(paging);
        return beastpage.map(mapper::map);
    }

    @Override
    public EntryDTO getBeast(String name) {
        log.info("Getting beast");
        return beastRepository.findByName(name).orElseThrow(
                () -> new NotFoundException(
                        String.format(BEAST_NOT_FOUND_MSG,name)));
    }

    @Override
    public EntryDTO saveBeast(EntryDTO beast) {
        log.info("Saving new beast {}",beast.name());
        Beast saveBeast = beastRepository.save(new Beast(beast.name(),beast.shortDescription()));
        return mapper.map(saveBeast);
    }

    @Override
    public void updateBeast(EntryDTO beast, Long id) {
        log.info("Updating Beast {} with id {}", beast.name(), id);
        Beast oldBeast = beastRepository.findById(id).orElseThrow(
                () -> new NotFoundException(String.format(BEAST_NOT_FOUND_MSG,id)));
        oldBeast.setName((beast.name()));
        oldBeast.setShortDescription(beast.shortDescription());
    }

    @Override
    public void deleteBest(Long id) {
        Beast beast = beastRepository.findById(id).orElseThrow(
                () -> new NotFoundException(String.format(BEAST_NOT_FOUND_MSG,id))
        );
        log.info("Deleting Beast with id {}",id);
        beastRepository.delete(beast);
    }

    @Override
    public List<EntryDTO> getAllBeasts() {
        return beastRepository.findAll().stream().map(mapper::map).toList();
    }
}
