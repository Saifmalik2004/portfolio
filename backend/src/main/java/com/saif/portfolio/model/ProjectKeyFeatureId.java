package com.saif.portfolio.model;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Embeddable
@NoArgsConstructor
@AllArgsConstructor
public class ProjectKeyFeatureId implements Serializable {
    private Integer projectId;
    private String keyFeature;

    // Override equals and hashCode (Important for composite key to work correctly)
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ProjectKeyFeatureId)) return false;
        ProjectKeyFeatureId that = (ProjectKeyFeatureId) o;
        return Objects.equals(projectId, that.projectId) &&
               Objects.equals(keyFeature, that.keyFeature);
    }

    @Override
    public int hashCode() {
        return Objects.hash(projectId, keyFeature);
    }
}
