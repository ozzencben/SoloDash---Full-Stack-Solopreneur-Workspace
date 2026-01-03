// services/userService.ts
import api from "@/services/axiosInstance";

export const userService = {
  /**
   * Profil fotoğrafını base64 formatında backend'e gönderir.
   */
  updateAvatar: async (base64Image: string) => {
    const response = await api.put("/users/avatar", { data: base64Image });
    return response.data;
  },
};
