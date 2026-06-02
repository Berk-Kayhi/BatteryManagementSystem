import React, { createContext, useState, useContext, useEffect } from "react";
import { authApi, type User } from "../services/api";

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string, remember?: boolean) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const isAuthenticated = !!user;

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const currentUser = await authApi.me();
                setUser(currentUser);
            } catch (error) {
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (email: string, password: string, remember = false) => {
        const data = await authApi.login({ email, password, remember });
        setUser(data.user);
    };

    const logout = async () => {
        await authApi.logout();
        setUser(null);
    };

    const contextValue: AuthContextType = {
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};