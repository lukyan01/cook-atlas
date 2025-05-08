import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
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

const ForgotPasswordPage = () => {
    const { resetPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!email) {
            setError('Please enter your email address');
            return;
        }

        try {
            setLoading(true);
            setError('');
            setSuccess('');

            const result = await resetPassword(email);
            setSuccess('If an account with this email exists, you will receive a password reset link shortly.');
            
            // Clear the form
            setEmail('');
        } catch (err) {
            setError(err.message || 'Failed to send password reset link. Please try again.');
            console.error('Password reset error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Paper sx={{ p: 4, maxWidth: '500px', width: '100%' }}>
                <Typography variant="h4" component="h1" align="center" gutterBottom>
                    Forgot Password
                </Typography>

                <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 3 }}>
                    Enter your email to receive a password reset link
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
                        label="Email"
                        name="email"
                        type="email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={handleChange}
                        required
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        size="large"
                        disabled={loading}
                        sx={{ mt: 3, mb: 2 }}
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
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
                            Remember your password?{' '}
                            <Link component={RouterLink} to="/login">
                                Log in
                            </Link>
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default ForgotPasswordPage;
