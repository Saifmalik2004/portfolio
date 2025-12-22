package com.saif.portfolio.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "project_key_features")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectKeyFeature {

    @EmbeddedId
    private ProjectKeyFeatureId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("projectId")
    @JoinColumn(name = "project_id")
    private Project project;

    // ✅ Add equals() and hashCode() — delegate to embedded id
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ProjectKeyFeature)) return false;
        ProjectKeyFeature that = (ProjectKeyFeature) o;
        return this.id != null && this.id.equals(that.id);
    }

    @Override
    public int hashCode() {
        return id != null ? id.hashCode() : 0;
    }
}
