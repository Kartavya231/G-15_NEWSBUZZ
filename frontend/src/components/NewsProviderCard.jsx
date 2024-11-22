import { useEffect, useState } from 'react';
import { POST } from '../api';
import { toast } from "react-hot-toast";
import { useNavigate } from 'react-router-dom';

const useFollowStatus = (baseURL, provider, onUnfollow) => {
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState();
  const [isShrinking, setIsShrinking] = useState(false);

  useEffect(() => {
    const checkFollow = async () => {
      try {
        const response = await POST('/api/userdo/isfollowed', { baseURL: baseURL });
        if (response.data.success) {
          setIsFollowing(response.data.isFollowing);
        } else if (response.data?.caught) {
          navigate("/login");
        }
      } catch (error) {
        console.error('Failed to check follow status:', error);
      }
    };
    checkFollow();
  }, [baseURL, navigate]);

  const toggleFollow = async () => {
    try {
      const endpoint = isFollowing ? '/api/userdo/unfollow' : '/api/userdo/follow';
      const payload = { baseURL: baseURL };

      const response = await POST(endpoint, payload);

      if (response.data.success === true) {
        setIsFollowing((prev) => !prev);
        toast.success(
          isFollowing ? 'You have UnFollowed successfully!' : 'You have Followed successfully!'
        );
        if (isFollowing && provider === "following") {
          setIsShrinking(true);
          setTimeout(() => {
            onUnfollow();
          }, 500);
        }
      } else if (response.data?.caught) {
        navigate("/login");
      } else {
        console.error(response.data.message);
        toast.error('Something went wrong, please try again later.');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  return { isFollowing, isShrinking, toggleFollow };
};

export default useFollowStatus;