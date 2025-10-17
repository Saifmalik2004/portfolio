package com.saif.portfolio.service.assistantService.context;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.saif.portfolio.model.Blog;
import com.saif.portfolio.model.Project;
import com.saif.portfolio.model.Skill;
import com.saif.portfolio.repository.BlogRepository;
import com.saif.portfolio.repository.ProjectRepository;
import com.saif.portfolio.repository.SkillRepository;

@Component
public class ContextBuilder {

    @Autowired private ProjectRepository projectRepository;
    @Autowired private BlogRepository blogRepository;
    @Autowired private SkillRepository skillRepository;

    private static final String PERSONAL_INFO = """
        Name: Saif Malik
        Role: Full Stack Developer
        Location: Uttar Pradesh, India
        Education: Bachelor's in Computer Application (BCA)
        Languages: English, Hindi (dono mein mast fluent hai!)
        Hobbies: Coding, strategy games, tech blogs, open-source contributions
        Interests: AI & machine learning, scalable apps, cloud tech (AWS, Azure)
        Favorite Projects: TeamCollab App, ShopSphere
        Fun Fact: Saif loves experimenting with frameworks & clean code!
    """;

    public String build(String message) {
        StringBuilder context = new StringBuilder(PERSONAL_INFO).append("\n");

        if (contains(message, "project", "projects")) appendProjects(context);
        if (contains(message, "skill", "skills", "technology", "tech")) appendSkills(context);
        if (contains(message, "blog", "write", "article", "post")) appendBlogs(context);

        return context.toString();
    }

    public String determineSource(String message) {
        if (contains(message, "project", "projects")) return "projects";
        if (contains(message, "skill", "skills", "technology", "tech")) return "skills";
        if (contains(message, "blog", "write", "article", "post")) return "blogs";
        return "general";
    }

    private void appendProjects(StringBuilder context) {
        List<Project> projects = projectRepository.findAll();
        context.append("Projects:\n");
        projects.forEach(p ->
            context.append("- ").append(p.getTitle())
                   .append(": ").append(p.getDescription())
                   .append("\n")
        );
    }

    private void appendSkills(StringBuilder context) {
        List<Skill> skills = skillRepository.findAll();
        context.append("Skills:\n");
        skills.forEach(s ->
            context.append("- ").append(s.getName())
                   .append(" (Priority: ").append(s.getPriority()).append(")\n")
        );
    }

    private void appendBlogs(StringBuilder context) {
        List<Blog> blogs = blogRepository.findAll();
        context.append("Blogs:\n");
        blogs.forEach(b ->
            context.append("- ").append(b.getTitle())
                   .append(": ").append(b.getSummary())
                   .append("\n")
        );
    }

    private boolean contains(String text, String... keywords) {
        for (String keyword : keywords) {
            if (text.contains(keyword)) return true;
        }
        return false;
    }
}
