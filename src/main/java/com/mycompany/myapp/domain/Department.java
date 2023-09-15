package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Type;

/**
 * A Department.
 */
@Entity
@Table(name = "department")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Department implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "department_name", nullable = false)
    private String departmentName;

    @Lob
    @Column(name = "department_pic")
    private byte[] departmentPic;

    @Column(name = "department_pic_content_type")
    private String departmentPicContentType;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "department_description")
    private String departmentDescription;

    @Lob
    @Column(name = "department_info_pdf")
    private byte[] departmentInfoPdf;

    @Column(name = "department_info_pdf_content_type")
    private String departmentInfoPdfContentType;

    @OneToMany(mappedBy = "department")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "jobs", "manager", "department" }, allowSetters = true)
    private Set<Employee> employees = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "country" }, allowSetters = true)
    private Location location;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Department id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDepartmentName() {
        return this.departmentName;
    }

    public Department departmentName(String departmentName) {
        this.setDepartmentName(departmentName);
        return this;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public byte[] getDepartmentPic() {
        return this.departmentPic;
    }

    public Department departmentPic(byte[] departmentPic) {
        this.setDepartmentPic(departmentPic);
        return this;
    }

    public void setDepartmentPic(byte[] departmentPic) {
        this.departmentPic = departmentPic;
    }

    public String getDepartmentPicContentType() {
        return this.departmentPicContentType;
    }

    public Department departmentPicContentType(String departmentPicContentType) {
        this.departmentPicContentType = departmentPicContentType;
        return this;
    }

    public void setDepartmentPicContentType(String departmentPicContentType) {
        this.departmentPicContentType = departmentPicContentType;
    }

    public String getDepartmentDescription() {
        return this.departmentDescription;
    }

    public Department departmentDescription(String departmentDescription) {
        this.setDepartmentDescription(departmentDescription);
        return this;
    }

    public void setDepartmentDescription(String departmentDescription) {
        this.departmentDescription = departmentDescription;
    }

    public byte[] getDepartmentInfoPdf() {
        return this.departmentInfoPdf;
    }

    public Department departmentInfoPdf(byte[] departmentInfoPdf) {
        this.setDepartmentInfoPdf(departmentInfoPdf);
        return this;
    }

    public void setDepartmentInfoPdf(byte[] departmentInfoPdf) {
        this.departmentInfoPdf = departmentInfoPdf;
    }

    public String getDepartmentInfoPdfContentType() {
        return this.departmentInfoPdfContentType;
    }

    public Department departmentInfoPdfContentType(String departmentInfoPdfContentType) {
        this.departmentInfoPdfContentType = departmentInfoPdfContentType;
        return this;
    }

    public void setDepartmentInfoPdfContentType(String departmentInfoPdfContentType) {
        this.departmentInfoPdfContentType = departmentInfoPdfContentType;
    }

    public Set<Employee> getEmployees() {
        return this.employees;
    }

    public void setEmployees(Set<Employee> employees) {
        if (this.employees != null) {
            this.employees.forEach(i -> i.setDepartment(null));
        }
        if (employees != null) {
            employees.forEach(i -> i.setDepartment(this));
        }
        this.employees = employees;
    }

    public Department employees(Set<Employee> employees) {
        this.setEmployees(employees);
        return this;
    }

    public Department addEmployee(Employee employee) {
        this.employees.add(employee);
        employee.setDepartment(this);
        return this;
    }

    public Department removeEmployee(Employee employee) {
        this.employees.remove(employee);
        employee.setDepartment(null);
        return this;
    }

    public Location getLocation() {
        return this.location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public Department location(Location location) {
        this.setLocation(location);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Department)) {
            return false;
        }
        return id != null && id.equals(((Department) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Department{" +
            "id=" + getId() +
            ", departmentName='" + getDepartmentName() + "'" +
            ", departmentPic='" + getDepartmentPic() + "'" +
            ", departmentPicContentType='" + getDepartmentPicContentType() + "'" +
            ", departmentDescription='" + getDepartmentDescription() + "'" +
            ", departmentInfoPdf='" + getDepartmentInfoPdf() + "'" +
            ", departmentInfoPdfContentType='" + getDepartmentInfoPdfContentType() + "'" +
            "}";
    }
}
