import { useState } from 'react';
import Modal from '../ui/Modal';
import { UserCircleIcon, Link2Icon, PlusIcon, Trash2Icon, BriefcaseIcon, GraduationCapIcon } from 'lucide-react';

export default function ProfileForm({ profile, onProfileUpdated }) {
  const [formData, setFormData] = useState({
    name: profile.profile.name || '',
    passionateText: profile.profile.passionateText || '',
    bio: profile.profile.bio || '',
    avatar: profile.profile.avatar || '',
    socialLinks: {
      github: profile.profile.socialLinks?.github || '',
      linkedin: profile.profile.socialLinks?.linkedin || '',
      twitter: profile.profile.socialLinks?.twitter || '',
      personalWebsite: profile.profile.socialLinks?.personalWebsite || ''
    },
    skills: profile.profile.skills || [],
    education: profile.profile.education || [],
    workExperience: profile.profile.workExperience || []
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(profile.profile.avatar || '');
  const [newSkill, setNewSkill] = useState({ techName: '', skillsUsed: '' });
  const [newEducation, setNewEducation] = useState({ 
    collegeName: '', 
    branch: '', 
    course: '', 
    yearOfPassout: '' 
  });
  const [newWorkExperience, setNewWorkExperience] = useState({
    companyName: '',
    position: '',
    duration: '',
    description: '',
    currentlyWorking: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('socialLinks.')) {
      const socialField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialField]: value
        }
      }));
    } else if (name === 'avatar') {
      setFormData(prev => ({ ...prev, [name]: value }));
      setAvatarPreview(value);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSkillChange = (e, index, field) => {
    const { value } = e.target;
    const updatedSkills = [...formData.skills];
    updatedSkills[index][field] = field === 'skillsUsed' ? value.split(',') : value;
    setFormData(prev => ({ ...prev, skills: updatedSkills }));
  };

  const handleEducationChange = (e, index, field) => {
    const { value } = e.target;
    const updatedEducation = [...formData.education];
    updatedEducation[index][field] = value;
    setFormData(prev => ({ ...prev, education: updatedEducation }));
  };

  const handleWorkExperienceChange = (e, index, field) => {
    const { value, type, checked } = e.target;
    const updatedWorkExperience = [...formData.workExperience];
    updatedWorkExperience[index][field] = type === 'checkbox' ? checked : value;
    setFormData(prev => ({ ...prev, workExperience: updatedWorkExperience }));
  };

  const addSkill = () => {
    if (newSkill.techName.trim() === '') return;
    
    const skillsUsedArray = newSkill.skillsUsed.split(',').map(skill => skill.trim());
    
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, {
        techName: newSkill.techName,
        skillsUsed: skillsUsedArray
      }]
    }));
    
    setNewSkill({ techName: '', skillsUsed: '' });
  };

  const removeSkill = (index) => {
    const updatedSkills = [...formData.skills];
    updatedSkills.splice(index, 1);
    setFormData(prev => ({ ...prev, skills: updatedSkills }));
  };

  const addEducation = () => {
    if (newEducation.collegeName.trim() === '') return;
    
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, {
        collegeName: newEducation.collegeName,
        branch: newEducation.branch,
        course: newEducation.course,
        yearOfPassout: newEducation.yearOfPassout
      }]
    }));
    
    setNewEducation({ collegeName: '', branch: '', course: '', yearOfPassout: '' });
  };

  const removeEducation = (index) => {
    const updatedEducation = [...formData.education];
    updatedEducation.splice(index, 1);
    setFormData(prev => ({ ...prev, education: updatedEducation }));
  };

  const addWorkExperience = () => {
    if (newWorkExperience.companyName.trim() === '') return;
    
    setFormData(prev => ({
      ...prev,
      workExperience: [...prev.workExperience, {
        companyName: newWorkExperience.companyName,
        position: newWorkExperience.position,
        duration: newWorkExperience.duration,
        description: newWorkExperience.description,
        currentlyWorking: newWorkExperience.currentlyWorking
      }]
    }));
    
    setNewWorkExperience({
      companyName: '',
      position: '',
      duration: '',
      description: '',
      currentlyWorking: false
    });
  };

  const removeWorkExperience = (index) => {
    const updatedWorkExperience = [...formData.workExperience];
    updatedWorkExperience.splice(index, 1);
    setFormData(prev => ({ ...prev, workExperience: updatedWorkExperience }));
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  
  try {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const res = await fetch(`${BACKEND_URL}/api/profiles/me/profile`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ profile: formData }),
      credentials: 'include'
    });
    
    if (!res.ok) {
      throw new Error('Failed to update profile');
    }
    
    const data = await res.json();
    onProfileUpdated(data);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  } catch (err) {
    console.error("Profile update error:", err);
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
        <h2 className="text-2xl font-bold flex items-center">
          <UserCircleIcon className="h-8 w-8 mr-3" />
          Profile Settings
        </h2>
        <p className="text-indigo-100 mt-1">Customize how others see your portfolio</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-8">
          {/* Avatar & Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  {avatarPreview ? (
                    <img 
                      src={avatarPreview} 
                      alt="Profile preview" 
                      className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="h-32 w-32 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <UserCircleIcon className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
                  <div className="flex">
                    <input
                      type="url"
                      name="avatar"
                      value={formData.avatar}
                      onChange={handleChange}
                      className="flex-1 p-2 border rounded-l-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="https://"
                    />
                    <button
                      type="button"
                      onClick={() => setAvatarPreview('')}
                      className="bg-gray-100 px-3 rounded-r-lg border-t border-r border-b border-gray-300 hover:bg-gray-200"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Name*</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Passionate About</label>
                <input
                  type="text"
                  name="passionateText"
                  value={formData.passionateText}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g. Building scalable web applications"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Headline</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows="3"
                  placeholder="Tell your professional story..."
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-indigo-800 mb-4 flex items-center">
              <Link2Icon className="h-5 w-5 mr-2" />
              Social Connections
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <svg className="h-5 w-5 mr-2 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                  </svg>
                  GitHub
                </label>
                <input
                  type="url"
                  name="socialLinks.github"
                  value={formData.socialLinks.github}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="https://github.com/username"
                />
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <svg className="h-5 w-5 mr-2 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn
                </label>
                <input
                  type="url"
                  name="socialLinks.linkedin"
                  value={formData.socialLinks.linkedin}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <svg className="h-5 w-5 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                  Leetcode
                </label>
                <input
                  type="url"
                  name="socialLinks.twitter"
                  value={formData.socialLinks.twitter}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="https://twitter.com/username"
                />
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Link2Icon className="h-5 w-5 mr-2 text-purple-600" />
                  Personal Website
                </label>
                <input
                  type="url"
                  name="socialLinks.personalWebsite"
                  value={formData.socialLinks.personalWebsite}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="https://"
                />
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-indigo-800 mb-4">Skills</h3>
            <div className="space-y-4">
              {formData.skills.map((skill, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{skill.techName}</h4>
                    <button
                      type="button"
                      onClick={() => removeSkill(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2Icon className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Technology</label>
                      <input
                        type="text"
                        value={skill.techName}
                        onChange={(e) => handleSkillChange(e, index, 'techName')}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Skills Used (comma separated)</label>
                      <input
                        type="text"
                        value={skill.skillsUsed.join(', ')}
                        onChange={(e) => handleSkillChange(e, index, 'skillsUsed')}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium mb-3">Add New Skill</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Technology</label>
                    <input
                      type="text"
                      value={newSkill.techName}
                      onChange={(e) => setNewSkill({...newSkill, techName: e.target.value})}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="e.g. Full-Stack Development"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Skills Used (comma separated)</label>
                    <input
                      type="text"
                      value={newSkill.skillsUsed}
                      onChange={(e) => setNewSkill({...newSkill, skillsUsed: e.target.value})}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="e.g. React,Tailwind css,Node Js,Express Js,MongoDB"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={addSkill}
                  className="flex items-center px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Skill
                </button>
              </div>
            </div>
          </div>

          {/* Education Section */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-indigo-800 mb-4 flex items-center">
              <GraduationCapIcon className="h-5 w-5 mr-2" />
              Education
            </h3>
            <div className="space-y-4">
              {formData.education.map((edu, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{edu.collegeName}</h4>
                    <button
                      type="button"
                      onClick={() => removeEducation(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2Icon className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">College Name</label>
                      <input
                        type="text"
                        value={edu.collegeName}
                        onChange={(e) => handleEducationChange(e, index, 'collegeName')}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                      <input
                        type="text"
                        value={edu.branch}
                        onChange={(e) => handleEducationChange(e, index, 'branch')}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="e.g. B.Tech"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                      <input
                        type="text"
                        value={edu.course}
                        onChange={(e) => handleEducationChange(e, index, 'course')}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="e.g. Computer Science"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Year of Passout</label>
                      <input
                        type="number"
                        value={edu.yearOfPassout}
                        onChange={(e) => handleEducationChange(e, index, 'yearOfPassout')}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="e.g. 2023"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium mb-3">Add New Education</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">College Name</label>
                    <input
                      type="text"
                      value={newEducation.collegeName}
                      onChange={(e) => setNewEducation({...newEducation, collegeName: e.target.value})}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="e.g. XYZ University"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                    <input
                      type="text"
                      value={newEducation.branch}
                      onChange={(e) => setNewEducation({...newEducation, branch: e.target.value})}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="e.g. B.Tech"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                    <input
                      type="text"
                      value={newEducation.course}
                      onChange={(e) => setNewEducation({...newEducation, course: e.target.value})}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="e.g. Computer Science"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year of Passout</label>
                    <input
                      type="number"
                      value={newEducation.yearOfPassout}
                      onChange={(e) => setNewEducation({...newEducation, yearOfPassout: e.target.value})}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="e.g. 2023"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={addEducation}
                  className="flex items-center px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Education
                </button>
              </div>
            </div>
          </div>

          {/* Work Experience Section */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-indigo-800 mb-4 flex items-center">
              <BriefcaseIcon className="h-5 w-5 mr-2" />
              Work Experience
            </h3>
            <div className="space-y-4">
              {formData.workExperience.map((work, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{work.companyName}</h4>
                    <button
                      type="button"
                      onClick={() => removeWorkExperience(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2Icon className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                      <input
                        type="text"
                        value={work.companyName}
                        onChange={(e) => handleWorkExperienceChange(e, index, 'companyName')}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                      <input
                        type="text"
                        value={work.position}
                        onChange={(e) => handleWorkExperienceChange(e, index, 'position')}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="e.g. Software Engineer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                      <input
                        type="text"
                        value={work.duration}
                        onChange={(e) => handleWorkExperienceChange(e, index, 'duration')}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="e.g. Jan 2020 - Present"
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={work.description}
                      onChange={(e) => handleWorkExperienceChange(e, index, 'description')}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      rows="3"
                      placeholder="Describe your role and responsibilities..."
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`currentlyWorking-${index}`}
                      checked={work.currentlyWorking}
                      onChange={(e) => handleWorkExperienceChange(e, index, 'currentlyWorking')}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`currentlyWorking-${index}`} className="ml-2 block text-sm text-gray-700">
                      Currently working here
                    </label>
                  </div>
                </div>
              ))}

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium mb-3">Add New Work Experience</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                    <input
                      type="text"
                      value={newWorkExperience.companyName}
                      onChange={(e) => setNewWorkExperience({...newWorkExperience, companyName: e.target.value})}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="e.g. Google"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                    <input
                      type="text"
                      value={newWorkExperience.position}
                      onChange={(e) => setNewWorkExperience({...newWorkExperience, position: e.target.value})}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="e.g. Software Engineer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                    <input
                      type="text"
                      value={newWorkExperience.duration}
                      onChange={(e) => setNewWorkExperience({...newWorkExperience, duration: e.target.value})}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="e.g. Jan 2020 - Present"
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newWorkExperience.description}
                    onChange={(e) => setNewWorkExperience({...newWorkExperience, description: e.target.value})}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    rows="3"
                    placeholder="Describe your role and responsibilities..."
                  />
                </div>
                <div className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    id="currentlyWorkingNew"
                    checked={newWorkExperience.currentlyWorking}
                    onChange={(e) => setNewWorkExperience({...newWorkExperience, currentlyWorking: e.target.checked})}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="currentlyWorkingNew" className="ml-2 block text-sm text-gray-700">
                    Currently working here
                  </label>
                </div>
                <button
                  type="button"
                  onClick={addWorkExperience}
                  className="flex items-center px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Work Experience
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition-all"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving Changes...
                </>
              ) : 'Save Profile'}
            </button>
          </div>
        </div>
      </form>

      {/* Success Modal */}
      <Modal isOpen={showSuccess} onClose={() => setShowSuccess(false)}>
        <div className="text-center p-6">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Profile Updated!</h3>
          <p className="text-gray-600 mb-6">Your changes have been saved successfully.</p>
          <button
            onClick={() => setShowSuccess(false)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Continue Editing
          </button>
        </div>
      </Modal>
    </div>
  );
}