import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { ID, type Models } from "appwrite";
import { account } from "./appwrite";

type AuthContextType = {
  user: Models.User<Models.Preferences> | null;
  signUp: (
    name: string,
    email: string,
    password: string
  ) => Promise<string | null>;
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  isLoading: boolean;
  userEmail: string | null;
  userName: string | null;
  userVerified: boolean;
  setUserVerified: (verified: boolean) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    null
  );
  const [userVerified, setUserVerified] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const userData = await account.get();
        setUser(userData);
        setUserVerified(userData.emailVerification);
        setUserEmail(userData.email);
        setUserName(userData.name);
      } catch (error) {
        setUser(null);
        console.log("No user session found.", error);
      } finally {
        
        setIsLoading(false);
      }
    };

    checkUserSession();
  }, []); 

  const signUp = async (name: string, email: string, password: string) => {
    try {
      await account.create(ID.unique(), email, password, name);
      
      await signIn(email, password);
      return null;
    } catch (error) {
      if (error instanceof Error) {
        return error.message;
      }
      return "An error occurred while signing up";
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await account.createEmailPasswordSession(email, password);
      
      const userData = await account.get();
      setUser(userData);
      setUserEmail(userData.email);
      setUserName(userData.name);
      setUserVerified(userData.emailVerification);
      return null;
    } catch (error) {
      if (error instanceof Error) {
        return error.message;
      }
      return "An error occurred while signing in";
    }
  };

  const signOut = async () => {
    try {
      await account.deleteSession("current");
      setUser(null);
      setUserEmail(null);
      setUserName(null);
      setUserVerified(false);
    } catch (error) {
      console.log("Failed to sign out:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signUp,
        signOut,
        isLoading,
        userEmail,
        userName,
        userVerified,
        setUserVerified,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    
    console.warn("useAuth must be used within an AuthProvider");
    return {
      user: null,
      signIn: async () => "Auth context not available",
      signUp: async () => "Auth context not available",
      signOut: async () => {},
      isLoading: true, 
      userEmail: null,
      userName: null,
      userVerified: false,
      setUserVerified: () => {},
    };
  }
  return context;
}