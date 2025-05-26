import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';

const templates = [
  {
    id: 'default',
    name: 'Default',
    description: 'Clean card-based layout with project filtering',
    image: 'https://cdn.dribbble.com/userupload/31670851/file/original-beaa8e9898aae5b41a8f498bb16e919c.png?resize=1200x799&vertical=center',
    enabled: true
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple single-column layout focused on content',
    image: 'https://cdn.dribbble.com/userupload/42342196/file/original-e6d784ce9be3970d08187be9a1a845af.png?resize=1200x900&vertical=center',
    enabled: false
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Modern layout with project showcases and detailed views',
    image: 'https://cdn.dribbble.com/userupload/24856091/file/original-7029f79343f21d6f55d9628cc0a840c5.jpg?resize=1504x1128&vertical=center',
    enabled: false
  }
];

export default function TemplateSelector({ currentTemplate, onTemplateSelected }) {
  const [selectedTemplate, setSelectedTemplate] = useState(currentTemplate);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setSelectedTemplate(currentTemplate);
  }, [currentTemplate]);

  const handleTemplateSelect = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/profiles/me/template', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template: selectedTemplate }),
        credentials: 'include'
      });

      if (!res.ok) {
        throw new Error('Failed to update template');
      }

      const data = await res.json();
      onTemplateSelected(data.template);
    } catch (err) {
      setError(err.message);
      console.error('Template update error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-6">Choose Your Template</h2>
      <p className="mb-6 text-gray-600">Select how your public portfolio will look to visitors.</p>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {templates.map(template => (
          <div
            key={template.id}
            onClick={() => template.enabled && setSelectedTemplate(template.id)}
            className={`border-2 rounded-lg p-4 transition-all ${
              template.enabled 
                ? selectedTemplate === template.id 
                  ? 'border-blue-500 bg-blue-50 shadow-md cursor-pointer' 
                  : 'border-gray-200 hover:border-gray-300 cursor-pointer'
                : 'border-gray-100 bg-gray-50 cursor-not-allowed'
            }`}
          >
            <div className="bg-gray-100 h-40 mb-3 rounded overflow-hidden relative">
              <img 
                src={template.image} 
                alt={template.name} 
                className="object-cover h-full w-full"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/300x160?text=Template+Preview';
                }}
              />
              {!template.enabled && (
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <span className="text-white font-medium bg-black bg-opacity-70 px-3 py-1 rounded-md">
                     
                  </span>
                </div>
              )}
            </div>
            <h3 className="font-medium text-center">
              {template.name}
              {!template.enabled && <span className="text-xs text-gray-500 ml-1">(Coming Soon)</span>}
            </h3>
            <p className="text-sm text-gray-600 mt-1 text-center">{template.description}</p>
            {selectedTemplate === template.id && (
              <div className="mt-2 text-sm text-blue-600 text-center">Currently selected</div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleTemplateSelect}
          disabled={selectedTemplate === currentTemplate || isSubmitting || !templates.find(t => t.id === selectedTemplate)?.enabled}
          className={`px-6 py-2 rounded-md transition-colors ${
            selectedTemplate === currentTemplate || !templates.find(t => t.id === selectedTemplate)?.enabled
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          } ${isSubmitting ? 'opacity-70' : ''}`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Applying...
            </span>
          ) : (
            'Apply Template'
          )}
        </button>
      </div>
    </div>
  );
}