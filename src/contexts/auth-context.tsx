import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  sanitizeInput,
  validateEmail,
  validatePassword,
  validateRequired,
  validateUserType,
} from "@/lib/security";
import { supabase } from "@/lib/supabase";
import type { User } from "@/types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    userType: "sme" | "influencer"
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface UserInsertData {
  id: string;
  name: string;
  email: string;
  user_type: "sme" | "influencer";
  status?: "active" | "inactive" | "suspended";
  email_verified?: boolean;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error?.code === "PGRST116") {
        const { data: sessionData } = await supabase.auth.getSession();
        const email = sessionData.session?.user?.email || "";
        const { data: userMetadata } = await supabase.auth.getUser();
        const name = userMetadata.user?.user_metadata?.name || "";
        const userType = userMetadata.user?.user_metadata?.user_type || "sme";

        const { error: insertError } = await supabase.from("users").insert({
          id: userId,
          name,
          email,
          user_type: userType,
          status: "active" as const,
          email_verified: false,
        });

        if (insertError) {
          console.error("Error creating user profile:", insertError);
        } else {
          const { data: newUser } = await supabase
            .from("users")
            .select("*")
            .eq("id", userId)
            .single();
          if (newUser) {
            setUser(newUser as User);
          }
        }
      } else if (error) {
        console.error("Error fetching user:", error);
      } else {
        setUser(data as User);
      }
    } catch (error) {
      console.error("Error in fetchUser:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkUser = useCallback(async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchUser(session.user.id);
      }
    } catch (error) {
      console.error("Error checking user:", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchUser]);

  useEffect(() => {
    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUser(session.user.id);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [checkUser, fetchUser]);

  async function login(email: string, password: string) {
    const emailValidation = validateRequired(email, "Email");
    if (!emailValidation.valid) {
      throw new Error(emailValidation.error);
    }

    if (!validateEmail(email)) {
      throw new Error("Masukkan alamat email yang valid");
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      throw new Error(passwordValidation.error);
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      throw error;
    }
  }

  async function register(
    name: string,
    email: string,
    password: string,
    userType: "sme" | "influencer"
  ) {
    const nameValidation = validateRequired(name, "Nama");
    if (!nameValidation.valid) {
      throw new Error(nameValidation.error);
    }

    const sanitizedName = sanitizeInput(name.trim());
    if (sanitizedName.length < 2) {
      throw new Error("Nama minimal 2 karakter");
    }

    const emailValidation = validateRequired(email, "Email");
    if (!emailValidation.valid) {
      throw new Error(emailValidation.error);
    }

    if (!validateEmail(email)) {
      throw new Error("Masukkan alamat email yang valid");
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      throw new Error(passwordValidation.error);
    }

    if (!validateUserType(userType)) {
      throw new Error("Tipe pengguna tidak valid");
    }

    const { error: signUpError, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name: sanitizedName, user_type: userType },
      },
    });

    if (signUpError) {
      throw signUpError;
    }

    if (data.user) {
      const userData: UserInsertData = {
        id: data.user.id,
        name: sanitizedName,
        email,
        user_type: userType,
        status: "active",
        email_verified: false,
      };

      const { error: insertError } = await supabase
        .from("users")
        .insert(userData);

      if (insertError) {
        throw new Error("Gagal membuat profil pengguna. Silakan coba lagi.");
      }
    }
  }

  async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
