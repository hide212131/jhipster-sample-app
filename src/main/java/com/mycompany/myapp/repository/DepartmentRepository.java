package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Department;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Department entity.
 */
@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
    default Optional<Department> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Department> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Department> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct department from Department department left join fetch department.location",
        countQuery = "select count(distinct department) from Department department"
    )
    Page<Department> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct department from Department department left join fetch department.location")
    List<Department> findAllWithToOneRelationships();

    @Query("select department from Department department left join fetch department.location where department.id =:id")
    Optional<Department> findOneWithToOneRelationships(@Param("id") Long id);
}
