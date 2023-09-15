package com.mycompany.myapp.service.mapper;

import com.mycompany.myapp.domain.Country;
import com.mycompany.myapp.domain.Region;
import com.mycompany.myapp.service.dto.CountryDTO;
import com.mycompany.myapp.service.dto.RegionDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Country} and its DTO {@link CountryDTO}.
 */
@Mapper(componentModel = "spring")
public interface CountryMapper extends EntityMapper<CountryDTO, Country> {
    @Mapping(target = "region", source = "region", qualifiedByName = "regionRegionName")
    CountryDTO toDto(Country s);

    @Named("regionRegionName")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "regionName", source = "regionName")
    RegionDTO toDtoRegionRegionName(Region region);
}
