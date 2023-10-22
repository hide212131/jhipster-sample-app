package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Employee;
import jakarta.persistence.EntityGraph;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.Collections;
import java.util.Optional;

public class EmployeeRepositoryWithRelationshipsImpl implements EmployeeRepositoryWithRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Employee> findOneWithEagerRelationships(Long id) {
        EntityGraph<?> entityGraph = entityManager.createEntityGraph(Employee.class);
        entityGraph.addAttributeNodes("department");

        Employee employee = entityManager.find(Employee.class, id, Collections.singletonMap("jakarta.persistence.loadgraph", entityGraph));

        return Optional.ofNullable(employee);
    }
}
