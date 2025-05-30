import {
  getCurrentUser,
  getPartnerInfo,
  getRelationship,
} from "@/lib/appwrite";
import { Relationship, User } from "@/types";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useMemo,
  useCallback,
} from "react";
import * as SplashScreen from "expo-splash-screen";

interface GlobalContextProps {
  isLogged: boolean;
  setIsLogged: React.Dispatch<React.SetStateAction<boolean>>;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  relationship: Relationship | null;
  setRelationship: React.Dispatch<React.SetStateAction<Relationship | null>>;
  partner: User | null;
  setPartner: React.Dispatch<React.SetStateAction<User | null>>;
}

const GlobalContext = createContext<GlobalContextProps | undefined>(undefined);

export const useGlobalContext = (): GlobalContextProps => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};

interface GlobalProviderProps {
  children: ReactNode;
}

const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [relationship, setRelationship] = useState<Relationship | null>(null);
  const [partner, setPartner] = useState<User | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser as unknown as User);
        setIsLogged(true);

        if (currentUser.relationshipId) {
          const rel = await getRelationship(currentUser.relationshipId);
          setRelationship(rel as unknown as Relationship);

          if (rel?.$id) {
            const part = await getPartnerInfo(rel.$id, currentUser.$id);
            setPartner(part as unknown as User);
          }
        } else {
          setRelationship(null);
        }
      } else {
        setIsLogged(false);
        setUser(null);
        setRelationship(null);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
      SplashScreen.hideAsync();
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser, !user, !relationship, !partner]);

  const contextValue = useMemo(
    () => ({
      isLogged,
      setIsLogged,
      user,
      setUser,
      loading,
      relationship,
      setRelationship,
      partner,
      setPartner,
    }),
    [isLogged, user, loading, relationship, partner]
  );

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
