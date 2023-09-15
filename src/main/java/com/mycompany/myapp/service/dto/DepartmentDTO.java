package com.mycompany.myapp.service.dto;

import java.io.Serializable;
import java.util.Objects;
import javax.persistence.Lob;
import javax.validation.constraints.*;

/**
 * A DTO for the {@link com.mycompany.myapp.domain.Department} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class DepartmentDTO implements Serializable {

    private Long id;

    @NotNull
    private String departmentName;

    @Lob
    private byte[] departmentPic;

    private String departmentPicContentType;

    @Lob
    private String departmentDescription;

    @Lob
    private byte[] departmentInfoPdf;

    private String departmentInfoPdfContentType;
    private LocationDTO location;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public byte[] getDepartmentPic() {
        return departmentPic;
    }

    public void setDepartmentPic(byte[] departmentPic) {
        this.departmentPic = departmentPic;
    }

    public String getDepartmentPicContentType() {
        return departmentPicContentType;
    }

    public void setDepartmentPicContentType(String departmentPicContentType) {
        this.departmentPicContentType = departmentPicContentType;
    }

    public String getDepartmentDescription() {
        return departmentDescription;
    }

    public void setDepartmentDescription(String departmentDescription) {
        this.departmentDescription = departmentDescription;
    }

    public byte[] getDepartmentInfoPdf() {
        return departmentInfoPdf;
    }

    public void setDepartmentInfoPdf(byte[] departmentInfoPdf) {
        this.departmentInfoPdf = departmentInfoPdf;
    }

    public String getDepartmentInfoPdfContentType() {
        return departmentInfoPdfContentType;
    }

    public void setDepartmentInfoPdfContentType(String departmentInfoPdfContentType) {
        this.departmentInfoPdfContentType = departmentInfoPdfContentType;
    }

    public LocationDTO getLocation() {
        return location;
    }

    public void setLocation(LocationDTO location) {
        this.location = location;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof DepartmentDTO)) {
            return false;
        }

        DepartmentDTO departmentDTO = (DepartmentDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, departmentDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "DepartmentDTO{" +
            "id=" + getId() +
            ", departmentName='" + getDepartmentName() + "'" +
            ", departmentPic='" + getDepartmentPic() + "'" +
            ", departmentDescription='" + getDepartmentDescription() + "'" +
            ", departmentInfoPdf='" + getDepartmentInfoPdf() + "'" +
            ", location=" + getLocation() +
            "}";
    }
}
