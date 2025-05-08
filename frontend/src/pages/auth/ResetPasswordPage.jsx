import { useState, useEffect } from 'react';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import {
    Alert,
    Box,
    Button,
    Divider,
    Grid,
    Link,
    Paper,
    TextField,
    Typography,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const ResetPasswordPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const { resetPasswordWithToken } = useAuth();
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!token) {
            setError('Invalid or missing reset token. Please request a new password reset link.');
        }
    }, [token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    function isPasswordStrong(password) {
        // At least 8 characters, contains numbers and letters
        return password.length >= 8 && password.length <= 100 && /[A-Za-z]/.test(password) && /[0-9]/.test(password);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate password
        if (!formData.password || !formData.confirmPassword) {
            setError('Please enter and confirm your new password');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!isPasswordStrong(formData.password)) {
            setError('Password must be at least 8 characters and contain both letters and numbers');
            return;
        }

        try {
            setLoading(true);
            setError('');
            setSuccess('');

            await resetPasswordWithToken(token, formData.password);
            setSuccess('Your password has been successfully reset. You can now login with your new password.');
            
            // Redirect to login page after 3 seconds
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.message || 'Failed to reset your password. The link may have expired.');
            console.error('Password reset error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Paper sx={{ p: 4, maxWidth: '500px', width: '100%' }}>
                <Typography variant="h4" component="h1" align="center" gutterBottom>
                    Reset Password
                </Typography>

                <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 3 }}>
                    Enter your new password
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 3 }}>
                        {success}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <TextField
                        label="New Password"
                        name="password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        helperText="Password must be at least 8 characters long with letters and numbers"
                    />

                    <TextField
                        label="Confirm New Password"
                        name="confirmPassword"
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        size="large"
                        disabled={loading || !token}
                        sx={{ mt: 3, mb: 2 }}
                    >
                        {loading ? 'Resetting Password...' : 'Reset Password'}
                    </Button>
                </form>

                <Divider sx={{ my: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                        OR
                    </Typography>
                </Divider>

                <Grid container justifyContent="center">
                    <Grid item>
                        <Typography variant="body2">
                            <Link component={RouterLink} to="/login">
                                Back to Login
                            </Link>
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default ResetPasswordPage;
