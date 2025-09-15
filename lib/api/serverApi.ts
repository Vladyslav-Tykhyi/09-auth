import { cookies } from "next/headers";
import { nextServer } from "./api";
import { Note } from "@/types/note";
import { User } from "@/types/user";
import { AxiosResponse } from "axios";

export interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface SessionResponse {
  user: User;
  valid: boolean;
  expires?: string;
}

interface ApiError extends Error {
  config?: {
    url?: string;
  };
  response?: {
    status?: number;
    data?: {
      error?: string;
    };
  };
}

export const serverApi = {
  fetchNotes: async (
    page = 1,
    perPage = 12,
    search = "",
    tag?: string
  ): Promise<NotesResponse> => {
    try {
      const cookieStore = await cookies();
      const cookiesString = cookieStore
        .getAll()
        .map((cookie) => `${cookie.name}=${cookie.value}`)
        .join("; ");

      const params: Record<string, string> = {
        page: page.toString(),
        perPage: perPage.toString(),
        search,
      };

      if (tag && tag !== "All") {
        params.tag = tag;
      }

      const response = await nextServer.get<NotesResponse>("/notes", {
        params,
        headers: {
          Cookie: cookiesString,
        },
      });
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      console.error("Помилка запиту до /notes:", {
        url: apiError.config?.url,
        status: apiError.response?.status,
        data: apiError.response?.data,
        message: apiError.message,
      });

      if (apiError.response?.status === 401) {
        throw new Error("Unauthorized");
      }
      throw new Error(
        apiError.response?.data?.error ||
          apiError.message ||
          "Failed to fetch notes"
      );
    }
  },

  fetchNoteById: async (id: string): Promise<Note> => {
    try {
      const cookieStore = await cookies();
      const cookiesString = cookieStore
        .getAll()
        .map((cookie) => `${cookie.name}=${cookie.value}`)
        .join("; ");

      const response = await nextServer.get<Note>(`/notes/${id}`, {
        headers: {
          Cookie: cookiesString,
        },
      });
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      console.error("Error fetching note:", apiError);
      if (apiError.response?.status === 401) {
        throw new Error("Unauthorized");
      }
      throw new Error(
        apiError.response?.data?.error ||
          apiError.message ||
          "Failed to fetch note"
      );
    }
  },

  getMe: async (): Promise<User> => {
    try {
      const cookieStore = await cookies();
      const cookiesString = cookieStore
        .getAll()
        .map((cookie) => `${cookie.name}=${cookie.value}`)
        .join("; ");

      const response = await nextServer.get<User>("/users/me", {
        headers: {
          Cookie: cookiesString,
        },
      });

      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      console.error("Failed to fetch user:", apiError);
      if (apiError.response?.status === 401) {
        throw new Error("Unauthorized");
      }
      throw new Error(
        apiError.response?.data?.error ||
          apiError.message ||
          "Failed to fetch user profile"
      );
    }
  },

  // функція для перевірки сесії  check session
  checkSession: async (): Promise<AxiosResponse<SessionResponse>> => {
    try {
      const cookieStore = await cookies();
      const cookiesString = cookieStore
        .getAll()
        .map((cookie) => `${cookie.name}=${cookie.value}`)
        .join("; ");

      const response = await nextServer.get<SessionResponse>("/auth/session", {
        headers: {
          Cookie: cookiesString,
        },
      });

      return response;
    } catch (error) {
      const apiError = error as ApiError;
      console.error("Failed to check session:", {
        url: apiError.config?.url,
        status: apiError.response?.status,
        data: apiError.response?.data,
        message: apiError.message,
      });

      if (apiError.response?.status === 401) {
        throw new Error("Unauthorized");
      }
      throw new Error(
        apiError.response?.data?.error ||
          apiError.message ||
          "Failed to check session"
      );
    }
  },

  // Alternative method using fetch
  getMeWithFetch: async (): Promise<User> => {
    try {
      const cookieStore = await cookies();
      const cookiesString = cookieStore
        .getAll()
        .map((cookie) => `${cookie.name}=${cookie.value}`)
        .join("; ");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
        {
          headers: {
            Cookie: cookiesString,
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized");
        }
        throw new Error("Failed to fetch user profile");
      }

      return response.json();
    } catch (error) {
      const apiError = error as Error;
      console.error("Failed to fetch user with fetch:", apiError);
      throw new Error(apiError.message || "Failed to fetch user profile");
    }
  },
};

export const {
  fetchNotes,
  fetchNoteById,
  getMe,
  getMeWithFetch,
  checkSession,
} = serverApi;
