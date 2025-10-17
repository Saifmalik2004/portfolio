package com.saif.portfolio.model;

import java.io.Serializable;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectImageId implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private Integer projectId;
    private String image;
}
