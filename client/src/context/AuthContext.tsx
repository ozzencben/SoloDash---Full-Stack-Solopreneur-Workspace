"use client";

import React, { createContext, useContext, useState } from "react";

export interface Project {
  id: number;
  title: string;
  budget: number;
  status: string;
  category?: string;
  deadline?: string;
  createdAt?: string;
}

export interface User {
  id: string | number;
  email: string;
  name: string;
  role: string;
  title?: string; // Settings sayfasındaki 'Title' alanı için
  bio?: string; // Settings sayfasındaki 'About Me' alanı için
  avatarUrl?: string;
  projects?: Project[];
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  updateUser: (updatedData: Partial<User>) => void; // Profil güncellendiğinde state'i tazelemek için
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // İlk yüklemede sessionStorage'dan kullanıcıyı çekiyoruz (SSR dostu yapı)
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const savedUser = sessionStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(false);

  // Giriş yapıldığında hem state'i hem de depolamayı günceller
  const login = (userData: User) => {
    setUser(userData);
    sessionStorage.setItem("user", JSON.stringify(userData));
  };

  // Çıkış yapıldığında tüm bilgileri temizler
  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
    if (typeof window !== "undefined") {
      localStorage.removeItem("token"); // axiosInstance'daki token güvenliği için
    }
  };

  /**
   * Profil sayfasında (Settings) isim, başlık veya biyografi değiştiğinde
   * sayfa yenilenmeden tüm uygulamanın (Header, Dashboard vb.) güncellenmesini sağlar.
   */
  const updateUser = (updatedData: Partial<User>) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      const newUser = { ...prevUser, ...updatedData };
      sessionStorage.setItem("user", JSON.stringify(newUser));
      return newUser;
    });
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, updateUser, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook kullanımı: 'useAuth()' diyerek her yerden erişebilirsin
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth bir AuthProvider içerisinde kullanılmalıdır.");
  }
  return context;
};
