"use client";

import { Icon } from "@/components/icons/icon";
import Modal from "@/components/shared/Modal";
import { Project, projectService } from "@/services/projectService";
import React, { useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [openSettingsId, setOpenSettingsId] = useState<number | null>(null);

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [newProject, setNewProject] = useState({
    name: "",
    amount: "",
    category: "Web App",
  });

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const res = await projectService.getMyProjects();
      setProjects(res.projects || []);
    } catch (error) {
      console.error("Projects could not be loaded:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name || !newProject.amount)
      return alert("Please fill all fields.");

    try {
      await projectService.createProject({
        title: newProject.name,
        budget: parseFloat(newProject.amount),
        category: newProject.category, // Backend'e kategori ekleniyor
        deadline: new Date().toISOString(),
      });
      await fetchProjects();
      setIsModalOpen(false);
      setNewProject({ name: "", amount: "", category: "Web App" }); // Form sıfırlama
    } catch (error) {
      console.error("Project creation failed:", error);
      alert("Project creation failed.");
    }
  };

  const handleEditClick = (project: Project) => {
    setSelectedProject(project);
    // Mevcut değerleri edite taşıma
    setNewProject({
      name: project.title,
      amount: project.budget.toString(),
      category: project.category || "Web App",
    });
    setIsEditModalOpen(true);
    setOpenSettingsId(null);
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;

    try {
      await projectService.updateProject(selectedProject.id, {
        title: newProject.name,
        budget: parseFloat(newProject.amount),
        category: newProject.category, // Güncellemede kategori desteği
      });
      await fetchProjects();
      setIsEditModalOpen(false);
      setSelectedProject(null);
      setNewProject({ name: "", amount: "", category: "Web App" });
    } catch (error) {
      console.error("Project update failed:", error);
      alert("Update failed.");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        await projectService.deleteProject(id);
        setProjects(projects.filter((p) => p.id !== id));
        setOpenSettingsId(null);
      } catch (error) {
        console.error("Project deletion failed:", error);
        alert("Delete failed.");
      }
    }
  };

  const handleToggleStatus = async (project: Project) => {
    const statusMap: Record<string, Project["status"]> = {
      PENDING: "IN_PROGRESS",
      IN_PROGRESS: "COMPLETED",
      COMPLETED: "PENDING",
    };
    const nextStatus = statusMap[project.status];

    try {
      await projectService.updateProject(project.id, { status: nextStatus });
      setProjects(
        projects.map((p) =>
          p.id === project.id ? { ...p, status: nextStatus } : p
        )
      );
    } catch (error) {
      console.error("Status update failed:", error);
      alert("Status update failed.");
    }
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchedSearch = project.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const normalizedStatus = filterStatus.toUpperCase().replace(" ", "_");
      const matchedStatus =
        filterStatus === "All" || project.status === normalizedStatus;
      return matchedSearch && matchedStatus;
    });
  }, [searchTerm, filterStatus, projects]);

  if (isLoading) return <div className={styles.loading}>Loading...</div>;

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>My Projects</h1>
            <p className={styles.subtitle}>
              You have {projects.length} projects.
            </p>
          </div>
          <button
            className={styles.addBtn}
            onClick={() => {
              setNewProject({ name: "", amount: "", category: "Web App" });
              setIsModalOpen(true);
            }}
          >
            <Icon name="plus" size={18} />
            <span>New Project</span>
          </button>
        </div>

        {/* Filtreleme ve Arama Barı */}
        <div className={styles.filterBar}>
          <div className={styles.searchWrapper}>
            <Icon name="search" size={18} color="var(--text-color-secondary)" />
            <input
              type="text"
              placeholder="Search projects..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className={styles.tabGroup}>
            {["All", "In Progress", "Completed", "Pending"].map((status) => (
              <button
                key={status}
                className={`${styles.tabBtn} ${
                  filterStatus === status ? styles.activeTab : ""
                }`}
                onClick={() => setFilterStatus(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Proje Listesi */}
        <div className={styles.projectGrid}>
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <div key={project.id} className={styles.projectCard}>
                <div className={styles.projectHeader}>
                  <h3 className={styles.projectName}>{project.title}</h3>
                  <span className={styles.projectCategory}>
                    {project.category || "General"}
                  </span>
                </div>
                <div className={styles.projectStats}>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Deadline</span>
                    <span className={styles.statValue}>
                      {new Date(project.deadline).toLocaleDateString("tr-TR")}
                    </span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Budget</span>
                    <span className={styles.statValue}>
                      ${project.budget.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className={styles.cardFooter}>
                  <span
                    className={`${styles.statusBadge} ${
                      styles[project.status.toLowerCase()]
                    }`}
                    onClick={() => handleToggleStatus(project)}
                    style={{ cursor: "pointer" }}
                  >
                    {project.status.replace("_", " ")}
                  </span>
                  <div style={{ position: "relative" }}>
                    <button
                      className={styles.editBtn}
                      onClick={() =>
                        setOpenSettingsId(
                          openSettingsId === project.id ? null : project.id
                        )
                      }
                    >
                      <Icon name="settings" size={18} />
                    </button>
                    <div
                      className={`${styles.settingsModal} ${
                        openSettingsId === project.id ? styles.active : ""
                      }`}
                    >
                      <button
                        className={styles.modalItem}
                        onClick={() => handleEditClick(project)}
                      >
                        <Icon name="edit" size={16} />
                        <span>Edit</span>
                      </button>
                      <button
                        className={styles.modalItem}
                        onClick={() => handleDelete(project.id)}
                        style={{ color: "#ef4444" }}
                      >
                        <Icon name="delete" size={16} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className={styles.noData}>No projects found.</p>
          )}
        </div>

        {/* Ekleme Modalı */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Create New Project"
        >
          <form onSubmit={handleAddProject} className={styles.form}>
            <div className={styles.formGroup}>
              <label>Project Name</label>
              <input
                type="text"
                value={newProject.name}
                onChange={(e) =>
                  setNewProject({ ...newProject, name: e.target.value })
                }
              />
            </div>
            <div className={styles.formGroup}>
              <label>Budget ($)</label>
              <input
                type="number"
                value={newProject.amount}
                onChange={(e) =>
                  setNewProject({ ...newProject, amount: e.target.value })
                }
              />
            </div>
            <div className={styles.formGroup}>
              <label>Category</label>
              <select
                value={newProject.category}
                onChange={(e) =>
                  setNewProject({ ...newProject, category: e.target.value })
                }
                className={styles.selectInput}
              >
                <option value="Web App">Web App</option>
                <option value="Mobile App">Mobile App</option>
                <option value="Design">Design</option>
                <option value="Consulting">Consulting</option>
              </select>
            </div>
            <button type="submit" className={styles.submitBtn}>
              Save Project
            </button>
          </form>
        </Modal>

        {/* Düzenleme Modalı */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Update Project"
        >
          <form onSubmit={handleUpdateProject} className={styles.form}>
            <div className={styles.formGroup}>
              <label>Project Name</label>
              <input
                type="text"
                value={newProject.name}
                onChange={(e) =>
                  setNewProject({ ...newProject, name: e.target.value })
                }
              />
            </div>
            <div className={styles.formGroup}>
              <label>Budget ($)</label>
              <input
                type="number"
                value={newProject.amount}
                onChange={(e) =>
                  setNewProject({ ...newProject, amount: e.target.value })
                }
              />
            </div>
            <div className={styles.formGroup}>
              <label>Category</label>
              <select
                value={newProject.category}
                onChange={(e) =>
                  setNewProject({ ...newProject, category: e.target.value })
                }
                className={styles.selectInput}
              >
                <option value="Web App">Web App</option>
                <option value="Mobile App">Mobile App</option>
                <option value="Design">Design</option>
                <option value="Consulting">Consulting</option>
              </select>
            </div>
            <button type="submit" className={styles.submitBtn}>
              Update Project
            </button>
          </form>
        </Modal>
      </div>
    </>
  );
}
