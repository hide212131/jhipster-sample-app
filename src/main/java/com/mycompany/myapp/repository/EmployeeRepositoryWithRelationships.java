package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Employee;
import java.util.Optional;

public interface EmployeeRepositoryWithRelationships {
    Optional<Employee> findOneWithEagerRelationships(Long id);
}
