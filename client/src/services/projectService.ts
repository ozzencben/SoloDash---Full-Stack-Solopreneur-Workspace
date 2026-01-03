import api from "@/services/axiosInstance";

export interface CreateProduct {
  title: string;
  budget: number;
  deadline: Date | string;
  category: string;
}

export interface Project {
  id: number;
  title: string;
  budget: number;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  deadline: Date | string;
  createdAt: Date | string;
  category: string;
}

export type UpdateProjectData = Partial<Omit<Project, "id" | "createdAt">>;

export const projectService = {
  createProject: async (credentials: CreateProduct) => {
    const response = await api.post("/projects/create", credentials);
    return response.data;
  },

  getMyProjects: async (): Promise<{ projects: Project[] }> => {
    const response = await api.get("/projects/my-projects");
    return response.data;
  },

  // 'any' yerine 'UpdateProjectData' kullandık
  updateProject: async (id: number, data: UpdateProjectData) => {
    const response = await api.put(`/projects/update/${id}`, data);
    return response.data;
  },

  deleteProject: async (id: number) => {
    const response = await api.delete(`/projects/delete/${id}`);
    return response.data;
  },
};
