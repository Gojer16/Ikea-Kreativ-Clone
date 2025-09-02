import Image from 'next/image';
import { useFurnitureStore, CatalogItem } from '../store/useFurnitureStore';

const FurnitureSelector = () => {
  const available = useFurnitureStore((s) => s.available);
  const addToRoom = useFurnitureStore((s) => s.addToRoom);

  return (
    <div className="w-full bg-gray-50 p-4 rounded-lg shadow-inner">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Add Furniture</h3>
      <div className="flex gap-4 overflow-x-auto pb-3">
        {available.map((item: CatalogItem) => (
          <button
            key={item.id} // Use the catalog item's id as the key
            onClick={() => addToRoom(item)}
            aria-label={`Add ${item.name} to room`}
            className="
              flex-shrink-0 w-36 bg-white rounded-lg shadow-md border border-transparent 
              hover:shadow-xl hover:border-blue-500 focus:outline-none focus:ring-2 
              focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200
            "
          >
            <Image
              src={item.imageUrl}
              alt={item.name}
              width={144}
              height={96}
              className="w-full h-24 object-contain rounded-t-lg bg-gray-100 p-2"
              style={{ objectFit: 'contain', background: '#f3f4f6', padding: '0.5rem' }}
            />
            <div className="p-2 text-center">
              <p className="text-sm font-medium text-gray-700 truncate">{item.name}</p>
            </div>
          </button>
        ))}
        {available.length === 0 && (
          <p className="text-sm text-gray-500">No furniture available to add.</p>
        )}
      </div>
    </div>
  );
};

export default FurnitureSelector;