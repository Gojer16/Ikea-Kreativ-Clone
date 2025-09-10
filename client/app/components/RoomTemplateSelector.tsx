import Image from 'next/image';
import { roomTemplates } from '../constants/roomTemplate';
import { useRoomStore } from '../store/roomStore';

const RoomTemplateSelector = () => {
  // Get both setters and current state from the store
  const { 
    setTemplateId, 
    currentTemplateId, // Assuming this is the name in your store
    backgroundType 
  } = useRoomStore((state) => ({
    setTemplateId: state.setTemplateId,
    currentTemplateId: state.templateId, // Get the currently active template ID
    backgroundType: state.backgroundType,
  }));

  const handleSelect = (templateId: string) => {
    const template = roomTemplates.find((t) => t.id === templateId);
    if (!template) return;

    setTemplateId(template.id);
  };

  return (
    // Added a label for better screen reader context
    <div role="region" aria-labelledby="template-selector-label">
      <h3 id="template-selector-label" className="sr-only">Choose a Room Template</h3>
      <div className="flex gap-4 overflow-x-auto p-4">
        {roomTemplates.map((template) => {
          // SUGGESTION 1: Check if this template is the currently active one
          const isSelected = backgroundType === 'template' && currentTemplateId === template.id;

          return (
            <button
              key={template.id}
              onClick={() => handleSelect(template.id)}
              // SUGGESTION 2: Use aria-pressed for accessibility
              aria-pressed={isSelected}
              aria-label={`Select ${template.name} template`}
              // SUGGESTION 1 & 2: Conditional styling for selection and focus
              className={`
                min-w-[150px] flex-shrink-0 rounded-lg border shadow-md transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                ${isSelected 
                  ? 'border-blue-500 ring-2 ring-blue-500' // Style for selected item
                  : 'border-gray-300 hover:border-gray-400 hover:shadow-lg'
                }
              `}
            >
              <Image
                src={template.imageUrl}
                alt={template.name}
                width={150}
                height={96}
                className="w-full h-24 object-cover rounded-t-lg pointer-events-none"
              />
              <div className="text-sm text-center p-2 font-medium">{template.name}</div>
            </button>
          )
        })}
      </div>
    </div>
  );
};

export default RoomTemplateSelector;