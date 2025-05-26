// src/pages/PublicProfilePage.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import DefaultTemplate from '../public/DefaultTemplate';
import MinimalTemplate from '../public/MinimalTemplate';
import ProfessionalTemplate from '../public/ProfessionalTemplate';

export default function PublicProfilePage() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
       const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/profiles/${username}`);

        setProfile(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Profile not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  const renderTemplate = () => {
    if (!profile) return null;

    switch (profile.template) {
      case 'minimal':
        return <MinimalTemplate profile={profile} />;
      case 'professional':
        return <ProfessionalTemplate profile={profile} />;
      default:
        return <DefaultTemplate profile={profile} />;
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="text-center py-10">
      <h2 className="text-2xl font-bold text-red-500">{error}</h2>
      <p className="mt-2">The profile you're looking for doesn't exist or may have been removed.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {renderTemplate()}
    </div>
  );
}