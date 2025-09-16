import { nextServer, ApiError } from "./api";
import { Note, NewNote } from "@/types/note";
import { User, SignUpData, SignInData } from "@/types/user";

export interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

export const clientApi = {
  // Authentication methods
  signIn: async (credentials: SignInData): Promise<User> => {
    try {
      const response = await nextServer.post<User>("/auth/login", credentials);
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.response?.data?.error || apiError.message || "Login failed"
      );
    }
  },

  signOut: async (): Promise<void> => {
    try {
      await nextServer.post("/auth/logout");
    } catch (error: unknown) {
      const apiError = error as ApiError;

      // 404 → toch als success beschouwen
      if (apiError.response?.status === 404) {
        console.log("Logout endpoint returned 404, proceeding with cleanup");
        return;
      }

      throw new Error(
        apiError.response?.data?.error || apiError.message || "Logout failed"
      );
    }
  },

  signUp: async (userData: SignUpData): Promise<User> => {
    try {
      const response = await nextServer.post<User>("/auth/register", userData);
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;

      if (apiError?.response?.status === 409) {
        throw new Error("This email is already registered");
      }

      throw new Error(
        apiError?.response?.data?.error ||
          apiError?.message ||
          "Registration failed"
      );
    }
  },

  checkSession: async (): Promise<User | null> => {
    try {
      const response = await nextServer.get<User>("/auth/session");
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;

      // 401 = niet ingelogd → return null
      if (apiError.response?.status === 401) {
        return null;
      }

      throw new Error(
        apiError.response?.data?.error ||
          apiError.message ||
          "Session check failed"
      );
    }
  },

  getMe: async (): Promise<User> => {
    try {
      const response = await nextServer.get<User>("/users/me");
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.response?.data?.error ||
          apiError.message ||
          "Failed to get user data"
      );
    }
  },

  updateMe: async (data: Partial<User>): Promise<User> => {
    try {
      const response = await nextServer.patch<User>("/users/me", data);
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.response?.data?.error ||
          apiError.message ||
          "Failed to update user"
      );
    }
  },

  // Notes methods
  fetchNotes: async (
    page = 1,
    perPage = 12,
    search = "",
    tag?: string
  ): Promise<NotesResponse> => {
    try {
      const params: Record<string, string | number> = {
        page,
        perPage,
        search,
      };

      if (tag) {
        params.tag = tag;
      }

      const response = await nextServer.get<NotesResponse>("/notes", {
        params,
      });
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.response?.data?.error ||
          apiError.message ||
          "Failed to fetch notes"
      );
    }
  },

  fetchNoteById: async (id: string): Promise<Note> => {
    try {
      const response = await nextServer.get<Note>(`/notes/${id}`);
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.response?.data?.error ||
          apiError.message ||
          "Failed to fetch note"
      );
    }
  },

  createNote: async (note: NewNote): Promise<Note> => {
    try {
      const response = await nextServer.post<Note>("/notes", note);
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.response?.data?.error ||
          apiError.message ||
          "Failed to create note"
      );
    }
  },

  deleteNote: async (id: string): Promise<Note> => {
    try {
      const response = await nextServer.delete<Note>(`/notes/${id}`);
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.response?.data?.error ||
          apiError.message ||
          "Failed to delete note"
      );
    }
  },
};

export const {
  signIn,
  signOut,
  signUp,
  checkSession,
  getMe,
  updateMe,
  fetchNotes,
  fetchNoteById,
  createNote,
  deleteNote,
} = clientApi;

export const authApi = {
  signIn: clientApi.signIn,
  signOut: clientApi.signOut,
  signUp: clientApi.signUp,
  checkSession: clientApi.checkSession,
  getMe: clientApi.getMe,
  updateMe: clientApi.updateMe,
};

export const notesApi = {
  fetchNotes: clientApi.fetchNotes,
  fetchNoteById: clientApi.fetchNoteById,
  createNote: clientApi.createNote,
  deleteNote: clientApi.deleteNote,
};

export const usersApi = {
  getMe: clientApi.getMe,
  updateMe: clientApi.updateMe,
};
