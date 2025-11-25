import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

interface User {
    id: string;
    email: string;
    username?: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
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
                const response = await axios.get(`http://localhost:3001/auth/me`, {
                    withCredentials: true,
                });
                setUser(response.data);
            } catch (error) {
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (email: string, password: string) => {
        const response = await axios.post(
            `http://localhost:3001/auth/login`,
            { email, password },
            { withCredentials: true }
        );
        setUser(response.data.user || response.data);
    };

    const logout = async () => {
        await axios.post(
            `http://localhost:3001/auth/logout`,
            {},
            { withCredentials: true }
        );
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