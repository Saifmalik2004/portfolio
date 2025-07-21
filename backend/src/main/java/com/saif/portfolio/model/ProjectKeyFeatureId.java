package com.saif.portfolio.model;

import java.io.Serializable;

import jakarta.persistence.Embeddable;
import lombok.Data;

@Data
@Embeddable
public class ProjectKeyFeatureId implements Serializable {
    private Long projectId;
    private String keyFeature;
}
