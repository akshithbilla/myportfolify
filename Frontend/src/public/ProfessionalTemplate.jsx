import { useState } from 'react';
import { motion } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { UserCircleIcon, BriefcaseIcon, GraduationCapIcon } from 'lucide-react';

export default function ProfessionalTemplate({ profile }) {
  const [selectedProject, setSelectedProject] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTech, setSelectedTech] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Use sample data if no profile is provided
  const displayProfile = profile || sampleProfile;
  const safeProjects = Array.isArray(displayProfile?.projects) ? displayProfile.projects : [];

 const categories = ['all', ...new Set(safeProjects.map(p => p?.category ?? 'Uncategorized'))];
  const allTech = [...new Set(safeProjects.flatMap(p => p?.techStack ?? []))];

  const filteredProjects = safeProjects.filter(project => {
    const matchesCategory = filter === 'all' || project?.category === filter;
    const matchesSearch = project?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project?.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTech = selectedTech.length === 0 ||
      selectedTech.some(tech => project?.techStack?.includes(tech));
    return matchesCategory && matchesSearch && matchesTech;
    
  });

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased">
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              {displayProfile?.profile?.avatar ? (
                <img
                  src={displayProfile.profile.avatar}
                  alt="User Avatar"
                  className="w-7 h-7 rounded-full object-cover"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center text-white">
                  <svg
                    className="w-6 h-6 text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"
                    />
                  </svg>
                </div>
              )}

              <span className="text-lg font-bold text-gray-900 tracking-tight">
                {displayProfile?.profile?.name || displayProfile?.username || 'My Profile'}
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {/* Social Icons */}
             </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white px-4 pt-4 pb-6 shadow-lg flex items-center justify-center">
            <div className="flex space-x-4">
              {displayProfile?.profile?.socialLinks?.github && (
                <a
                  href={displayProfile.profile.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-500 hover:text-gray-800 transition-colors duration-200"
                >
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.115 22 16.379 22 12.017 22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              )}
              {displayProfile?.profile?.socialLinks?.linkedin && (
                <a
                  href={displayProfile.profile.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-500 hover:text-blue-700 transition-colors duration-200"
                >
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              )}
              {displayProfile?.profile?.socialLinks?.twitter && (
                <a
                  href={displayProfile.profile.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-500 hover:text-blue-400 transition-colors duration-200"
                >
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              )}
              {displayProfile?.profile?.socialLinks?.personalWebsite && (
                <a
                  href={displayProfile.profile.socialLinks.personalWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-500 hover:text-purple-600 transition-colors duration-200"
                >
                  <span className="sr-only">Website</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" clipRule="evenodd" />
                  </svg>
                </a>
              )}
            </div>
            <br /> <br />
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-16 text-center">
          <div className="flex justify-center mb-8">
            {displayProfile?.profile?.avatar ? (
              <img 
                src={displayProfile.profile.avatar} 
                alt="Profile" 
                className="h-16 w-16 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="h-32 w-32 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <UserCircleIcon className="h-16 w-16 text-gray-400" />
              </div>
            )}
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            {`Hi, I'm ${displayProfile?.profile?.name || displayProfile?.username || 'My Portfolio'}`}
          </h1>
          
           
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            {displayProfile?.profile?.bio || 'Showcasing my projects and development work'}
          </p>
          
          <div className="flex justify-center gap-4">
            <a
              href="#projects"
              className="bg-blue-600 text-white py-2.5 px-6 rounded-lg font-semibold shadow-sm hover:bg-blue-700 transition duration-200"
            >
              View Projects
            </a>
            <a
              href="#contact"
              className="border border-blue-600 text-blue-600 py-2.5 px-6 rounded-lg font-semibold hover:bg-blue-50 transition duration-200"
            >
              Contact Me
            </a>
          </div>
        </section>
        <br /><br />

      <h2 className="text-4xl font-semibold mb-6 text-center text-blue-600">
  About Me
</h2>

{displayProfile?.profile?.passionateText && (
  <p className="text-xl font-medium mb-4 text-center text-gray-700 max-w-3xl mx-auto">
    {displayProfile.profile.passionateText}
  </p>
)}


<br />

{/* Skills Section */}
{displayProfile?.profile?.skills?.length > 0 && (
  <section className="mb-16">
    <div className="flex items-center mb-8">
      <div className="h-px bg-gray-200 flex-1"></div>
      <h2 className="text-4xl font-semibold mb-6 text-center text-blue-600">Skills</h2>
      <div className="h-px bg-gray-200 flex-1"></div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayProfile.profile.skills.map((skill, index) => (
        <div
          key={index}
          className="border border-gray-100 rounded-lg p-6 hover:border-gray-200 transition-colors"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {skill.techName}
          </h3>
          <div className="flex flex-wrap gap-2">
            {skill.skillsUsed.map((item, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-blue-50 text-blue-500 text-sm font-normal rounded-md"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  </section>
)}
{/* Education & Experience Section */}
{(displayProfile?.profile?.education?.length > 0 || displayProfile?.profile?.workExperience?.length > 0) && (
  <section className="mb-16">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      
      {/* Education Card */}
      {displayProfile?.profile?.education?.length > 0 && (
        <div className="p-6 rounded-xl border border-white/10 hover:-translate-y-1 transition-all">
          <h3 className="text-xl font-bold mb-4">🏫 Education</h3>
          <ul className="mt-2 text-base text-gray-300 space-y-2">
            {displayProfile.profile.education.map((edu, index) => (
              <li key={index}>
                <strong>{edu.course}</strong> {edu.branch && `in ${edu.branch}`} - {edu.collegeName}
                {edu.yearOfPassout && ` (${edu.yearOfPassout})`}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Experience Card */}
      {displayProfile?.profile?.workExperience?.length > 0 && (
        <div className="p-6 rounded-xl border border-white/10 hover:-translate-y-1 transition-all">
          <h3 className="text-xl font-bold mb-4">💼 Work Experience</h3>
          <div className="mt-2 text-base text-gray-300 space-y-4">
            {displayProfile.profile.workExperience.map((exp, index) => (
              <div key={index}>
                <h4 className="font-semibold">
                  {exp.position} {exp.duration && `(${exp.duration}${exp.currentlyWorking ? " • Current" : ""})`}
                </h4>
                <p className="text-gray-400">{exp.companyName}</p>
                {exp.description && (
                  <p className="text-gray-500">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  </section>
)}

<br /> <br />
 {/*---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */}

{/* Projects Section */}
<section id="projects" className="mb-20">
  <h2 className="text-4xl font-semibold mb-6 text-center text-blue-600">🚀 Featured Projects</h2>
<br /> <br />
  {/* Search + Filters */}
  <div className="mb-12 space-y-6">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      {/* Search */}
      <div className="relative flex-1 max-w-lg">
  <input
    type="text"
    placeholder="Search projects..."
    className="w-full pl-12 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
   
</div>


{/* Category Filter */}
<div className="mb-6">
  <h3 className="text-base font-semibold text-gray-800 mb-3 uppercase tracking-wide">
    Project Category
  </h3>
  <br />
  <div className="flex flex-wrap gap-3">
    {categories.map(category => (
      <button
        key={category}
        onClick={() => setFilter(category)}
        className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
          ${filter === category
            ? 'bg-blue-600 text-white border-blue-600 shadow focus:ring-blue-500'
            : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50 focus:ring-gray-300'
          }`}
      >
        {category === 'all' ? 'All Projects' : category.charAt(0).toUpperCase() + category.slice(1)}
      </button>
    ))}
  </div>
</div>

{/* Tech Stack Filter */}
<div>
  <h3 className="text-base font-semibold text-gray-800 mb-3 uppercase tracking-wide">
    Technology Stack
  </h3>
  <br />
  <div className="flex flex-wrap gap-3">
    {allTech.map(tech => (
      <button
        key={tech}
        onClick={() =>
          setSelectedTech(prev =>
            prev.includes(tech)
              ? prev.filter(t => t !== tech)
              : [...prev, tech]
          )
        }
        className={`inline-flex items-center px-3.5 py-1.5 rounded-md text-sm font-medium border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
          ${selectedTech.includes(tech)
            ? 'bg-blue-600 text-white border-blue-600 shadow-sm focus:ring-blue-500'
            : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50 focus:ring-gray-300'
          }`}
      >
        {tech}📚
      </button>
    ))}
  </div>
  </div>
</div>

  </div>

  {/* Projects List */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {filteredProjects.length > 0 ? (
    filteredProjects.map((project) => (
      <motion.div
        key={project._id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col"
      >
        {project.images?.[0] && (
          <div className="h-48 overflow-hidden rounded-t-xl">
            <LazyLoadImage
              src={project.images[0]}
              alt={project.title}
              effect="blur"
              className="object-cover w-full h-full"
            />
          </div>
        )}

        <div className="flex flex-col p-5 flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h3>
          <p className="text-gray-600 text-sm mb-4 flex-1">{project.description}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="mt-auto flex gap-3">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex justify-center items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition"
              >
                Live Demo
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex justify-center items-center px-4 py-2 text-sm font-medium text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-md border transition"
              >
                View Code
              </a>
            )}
          </div>
        </div>
      </motion.div>
    ))
  ) : (
    <div className="col-span-full text-center py-20 bg-gray-50 rounded-xl shadow-inner">
      <svg className="mx-auto h-14 w-14 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <h3 className="mt-4 text-lg font-semibold text-gray-800">No projects found</h3>
      <p className="mt-2 text-gray-600">Try adjusting your search or filters.</p>
      <button
        onClick={() => {
          setFilter('all');
          setSearchQuery('');
          setSelectedTech([]);
        }}
        className="mt-6 inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition"
      >
        Reset Filters
      </button>
    </div>
  )}
</div>

</section>

<br />


 {/*---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */}

        {/* Contact Section */}
        {/* Contact Section */}
<section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
  <div className="max-w-5xl mx-auto">
    <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">Let's Get in Touch</h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-8 rounded-2xl shadow-xl">
      
      {/* Contact Information */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Connect with Me</h3>
        <ul className="space-y-6">
          {displayProfile?.profile?.socialLinks?.github && (
            <li className="flex items-center space-x-4">
              <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2...Z" />
              </svg>
              <a href={displayProfile.profile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
                GitHub Profile
              </a>
            </li>
          )}

          {displayProfile?.profile?.socialLinks?.linkedin && (
            <li className="flex items-center space-x-4">
              <svg className="w-6 h-6 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452...Z" />
              </svg>
              <a href={displayProfile.profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
                LinkedIn Profile
              </a>
            </li>
          )}

          {displayProfile?.profile?.socialLinks?.personalWebsite && (
            <li className="flex items-center space-x-4">
              <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2...Z" />
              </svg>
              <a href={displayProfile.profile.socialLinks.personalWebsite} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
                Personal Website
              </a>
            </li>
          )}
        </ul>
      </div>
      <br />

      {/* Contact Form */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Send Me a Message</h3>
        <form className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
            <input
              type="text"
              id="name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              id="message"
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Your message here..."
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Send Message
          </button>
        </form>
      </div>

    </div>
  </div>
</section>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-600 mb-4 md:mb-0">
              © {new Date().getFullYear()} {displayProfile?.profile?.name || displayProfile?.username || 'Portfolio'}
            </div>
            <div className="flex space-x-6">
              {displayProfile?.profile?.socialLinks?.github && (
                <a href={displayProfile.profile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-800 transition-colors duration-200">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.115 22 16.379 22 12.017 22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              )}
              {displayProfile?.profile?.socialLinks?.linkedin && (
                <a href={displayProfile.profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-700 transition-colors duration-200">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              )}
              {displayProfile?.profile?.socialLinks?.twitter && (
                <a href={displayProfile.profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-400 transition-colors duration-200">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              )}
              {displayProfile?.profile?.socialLinks?.personalWebsite && (
                <a href={displayProfile.profile.socialLinks.personalWebsite} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-purple-600 transition-colors duration-200">
                  <span className="sr-only">Website</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" clipRule="evenodd" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </footer>
      <br />
    </div>
  );
}

// Sample data for preview purposes
const sampleProfile = {
  username: 'johndoe',
  profile: {
    name: 'John Doe',
    passionateText: 'Passionate about building scalable web applications',
    bio: 'Full-stack developer with 5+ years of experience in JavaScript, React, and Node.js',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    socialLinks: {
      github: 'https://github.com/johndoe',
      linkedin: 'https://linkedin.com/in/johndoe',
      twitter: 'https://twitter.com/johndoe',
      personalWebsite: 'https://johndoe.dev'
    },
    skills: [
      {
        techName: 'Frontend',
        skillsUsed: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS']
      },
      {
        techName: 'Backend',
        skillsUsed: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL']
      },
      {
        techName: 'DevOps',
        skillsUsed: ['Docker', 'AWS', 'CI/CD', 'Kubernetes']
      }
    ],
    education: [
      {
        collegeName: 'Stanford University',
        branch: 'Computer Science',
        course: 'Bachelor of Science',
        yearOfPassout: '2018'
      }
    ],
    workExperience: [
      {
        companyName: 'Tech Corp',
        position: 'Senior Software Engineer',
        duration: '2020 - Present',
        description: 'Leading a team of developers to build scalable web applications using modern technologies.',
        currentlyWorking: true
      },
      {
        companyName: 'Startup Inc',
        position: 'Software Engineer',
        duration: '2018 - 2020',
        description: 'Developed and maintained web applications using React and Node.js.',
        currentlyWorking: false
      }
    ]
  },
  projects: [
    {
      _id: '1',
      title: 'E-commerce Platform',
      description: 'A full-featured e-commerce platform with payment integration and admin dashboard.',
      techStack: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      category: 'web',
      images: ['https://via.placeholder.com/600x400?text=E-commerce+Platform'],
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com/example'
    },
    {
      _id: '2',
      title: 'Mobile Task Manager',
      description: 'A cross-platform mobile application for task management with offline support.',
      techStack: ['React Native', 'Firebase', 'Redux'],
      category: 'mobile',
      images: ['https://via.placeholder.com/600x400?text=Mobile+Task+Manager'],
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com/example'
    }
  ]
};