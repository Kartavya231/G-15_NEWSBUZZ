import React, { useState } from 'react';
import {
  Card,
  Box,
  Typography,
  InputBase,
  Button,
  InputAdornment,
  IconButton,
  styled
} from '@mui/material';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { POST } from '../api';
import toast from 'react-hot-toast';
import CryptoJS from 'crypto-js';
import { useNavigate } from 'react-router-dom';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: '440px',
  margin: '0 auto',
  padding: '32px',
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  borderRadius: '12px',
  backgroundColor: '#ffffff'
}));

const StyledInput = styled(InputBase)(({ theme }) => ({
  width: '100%',
  backgroundColor: '#f8fafc',
  borderRadius: '8px',
  border: '1px solid #e2e8f0',
  transition: 'all 0.2s ease-in-out',
  marginBottom: '16px',
  '& .MuiInputBase-input': {
    padding: '14px 16px',
    fontSize: '15px',
    '&::placeholder': {
      color: '#94a3b8',
      opacity: 1,
    },
  },
  '&:hover': {
    borderColor: '#cbd5e1',
  },
  '&.Mui-focused': {
    borderColor: '#3b82f6',
    backgroundColor: '#ffffff',
    boxShadow: '0 0 0 4px rgb(59 130 246 / 0.1)',
  }
}));

const StyledButton = styled(Button)(({ theme }) => ({
  width: '100%',
  padding: '12px',
  marginTop: '8px',
  borderRadius: '8px',
  textTransform: 'none',
  fontSize: '16px',
  fontWeight: 500,
  backgroundColor: '#3b82f6',
  color: '#ffffff',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: '#2563eb',
    boxShadow: '0 4px 6px -1px rgb(37 99 235 / 0.1), 0 2px 4px -2px rgb(37 99 235 / 0.1)',
  }
}));

const PasswordStrengthIndicator = styled(Box)(({ strength }) => ({
  height: '4px',
  borderRadius: '2px',
  backgroundColor:
    strength === 'strong' ? '#22c55e' :
      strength === 'medium' ? '#eab308' :
        strength === 'weak' ? '#ef4444' : '#e2e8f0',
  transition: 'all 0.2s ease-in-out'
}));

const RequirementItem = styled(Box)(({ met }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  color: met ? '#22c55e' : '#94a3b8',
  fontSize: '14px',
  marginBottom: '4px'
}));

const ResetPassword = ({ setShowModal }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  // Password requirements
  const requirements = {
    length: newPassword.length >= 8,
    number: /\d/.test(newPassword),
    special: /[!@#$%^&*]/.test(newPassword),
    capital: /[A-Z]/.test(newPassword)
  };

  // Calculate password strength
  const getPasswordStrength = () => {
    const metRequirements = Object.values(requirements).filter(Boolean).length;
    if (metRequirements === 4) return 'strong';
    if (metRequirements >= 2) return 'medium';
    if (metRequirements >= 1) return 'weak';
    return 'none';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    const EncryptOldPassword = CryptoJS.AES.encrypt(oldPassword, "news-aggregator-secret").toString();
    const EncryptNewPassword = CryptoJS.AES.encrypt(newPassword, "news-aggregator-secret").toString();

    const response = await POST('/api/changepassword', { password: EncryptNewPassword, CurrentPassword: EncryptOldPassword });
    // console.log(response.data);

    if (response.data.success) {
      toast.success(response.data.message);
      setShowModal(false);
      return;

    } else if (response.data?.caught) {
      // toast.error(response.data.message);
      setShowModal(false);
      navigate('/login'); return;
      return;
    } else {
      toast.error(response.data.message);
    }



    console.log('Password reset submitted');
  };

  return (
    <StyledCard>
      <Typography variant="h5" sx={{
        fontWeight: 600,
        mb: 1,
        color: '#0f172a'
      }}>
        Reset Password
      </Typography>
      <Typography variant="body2" sx={{
        mb: 4,
        color: '#64748b'
      }}>
        Please enter your old password and create a new password
      </Typography>

      <form onSubmit={handleSubmit}>
        <StyledInput
          type={showOldPassword ? 'text' : 'password'}
          placeholder="Current Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          fullWidth
          required
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowOldPassword(!showOldPassword)}
                edge="end"
                sx={{ mr: 1 }}
              >
                {showOldPassword ?
                  <EyeOff size={20} color="#64748b" /> :
                  <Eye size={20} color="#64748b" />
                }
              </IconButton>
            </InputAdornment>
          }
        />

        <StyledInput
          type={showNewPassword ? 'text' : 'password'}
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          fullWidth
          required
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowNewPassword(!showNewPassword)}
                edge="end"
                sx={{ mr: 1 }}
              >
                {showNewPassword ?
                  <EyeOff size={20} color="#64748b" /> :
                  <Eye size={20} color="#64748b" />
                }
              </IconButton>
            </InputAdornment>
          }
        />

        <Box sx={{ mb: 3 }}>
          <PasswordStrengthIndicator strength={getPasswordStrength()} />
          <Box sx={{ mt: 2 }}>
            <RequirementItem met={requirements.length}>
              {requirements.length ? <Check size={16} /> : <X size={16} />}
              At least 8 characters
            </RequirementItem>
            <RequirementItem met={requirements.number}>
              {requirements.number ? <Check size={16} /> : <X size={16} />}
              Contains a number
            </RequirementItem>
            <RequirementItem met={requirements.special}>
              {requirements.special ? <Check size={16} /> : <X size={16} />}
              Contains a special character
            </RequirementItem>
            <RequirementItem met={requirements.capital}>
              {requirements.capital ? <Check size={16} /> : <X size={16} />}
              Contains a capital letter
            </RequirementItem>
          </Box>
        </Box>

        <StyledInput
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          fullWidth
          required
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                edge="end"
                sx={{ mr: 1 }}
              >
                {showConfirmPassword ?
                  <EyeOff size={20} color="#64748b" /> :
                  <Eye size={20} color="#64748b" />
                }
              </IconButton>
            </InputAdornment>
          }
        />

        <StyledButton
          type="submit"
          variant="contained"
          disabled={
            !oldPassword ||
            !newPassword ||
            !confirmPassword ||
            newPassword !== confirmPassword ||
            getPasswordStrength() !== 'strong'
          }
        >
          Update Password
        </StyledButton>
      </form>
    </StyledCard>
  );
};

export default ResetPassword;