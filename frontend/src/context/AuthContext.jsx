import {createContext, useContext, useEffect, useState} from 'react';
import {userApi} from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for saved user in localStorage
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        try {
            const userData = await userApi.login(credentials);
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            return userData;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const newUser = await userApi.register(userData);
            setUser(newUser);
            localStorage.setItem('user', JSON.stringify(newUser));
            return newUser;
        } catch (error) {
            console.error('Register error:', error);
            throw error;
        }
    };

    const requestPasswordReset = async (email) => {
        try {
            return await userApi.requestPasswordReset(email);
        } catch (error) {
            console.error('Password reset error:', error);
            throw error;
        }
    };

    const resetPasswordWithToken = async (token, newPassword) => {
        try {
            return await userApi.resetPasswordWithToken(token, newPassword);
        } catch (error) {
            console.error('Password reset with token error:', error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const isAuthenticated = () => !!user;

    const hasRole = (role) => {
        if (!user) return false;
        return user.role === role;
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                requestPasswordReset,
                resetPasswordWithToken,
                logout,
                isAuthenticated,
                hasRole,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;