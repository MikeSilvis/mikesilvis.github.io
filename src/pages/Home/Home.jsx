import React from 'react';
import { Link } from 'react-router-dom';
import { projects } from '../../data/projects';
import styles from './Home.module.css';

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.name}>Mike Silvis</h1>
        <div className={styles.role}>Software Engineer @ Square</div>
        <p className={styles.tagline}>
          Building robust, scalable systems. Passionate about clean code, developer tools, and impactful technology. Always learning, always shipping.
        </p>
      </div>

      <div className={styles.projectsSection}>
        <h2 className={styles.projectsTitle}>Projects</h2>
        <div className={styles.projectsGrid}>
          {projects.map(project => (
            <Link
              key={project.slug}
              to={`/projects/${project.slug}`}
              className={styles.projectCard}
              style={{ '--project-accent': project.accentColor }}
            >
              <span className={styles.projectEmoji}>{project.emoji}</span>
              <h3 className={styles.projectName}>{project.title}</h3>
              <p className={styles.projectDesc}>{project.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
