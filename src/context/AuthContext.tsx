import { createContext, useContext, useState, useEffect } from 'react';

interface User {
    id: string;
    email: string;
    name?: string;
    isAdmin?: boolean;
}

interface ImpersonationState {
    isImpersonating: boolean;
    originalToken: string | null;
    originalUser: User | null;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, user: User) => void;
    logout: () => void;
    isLoading: boolean;
    impersonation: ImpersonationState;
    startImpersonation: (token: string, user: User) => void;
    stopImpersonation: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState(true);
    const [impersonation, setImpersonation] = useState<ImpersonationState>({
        isImpersonating: false,
        originalToken: null,
        originalUser: null
    });

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser && token) {
            setUser(JSON.parse(savedUser));
        }
        setIsLoading(false);
    }, [token]);

    const login = (newToken: string, newUser: User) => {
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
    };

    const logout = () => {
        // If impersonating, just stop impersonation
        if (impersonation.isImpersonating) {
            stopImpersonation();
            return;
        }
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    const startImpersonation = (impersonationToken: string, impersonatedUser: User) => {
        setImpersonation({
            isImpersonating: true,
            originalToken: token,
            originalUser: user
        });
        setToken(impersonationToken);
        setUser(impersonatedUser);
    };

    const stopImpersonation = () => {
        if (impersonation.originalToken && impersonation.originalUser) {
            setToken(impersonation.originalToken);
            setUser(impersonation.originalUser);
        }
        setImpersonation({
            isImpersonating: false,
            originalToken: null,
            originalUser: null
        });
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            login,
            logout,
            isLoading,
            impersonation,
            startImpersonation,
            stopImpersonation
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};

