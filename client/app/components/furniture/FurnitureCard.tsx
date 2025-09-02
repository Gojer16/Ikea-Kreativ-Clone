/**
 * FurnitureCard
 *
 * What:
 * - Card component that renders a single furniture item (image, meta, actions).
 */

import React, { useState } from 'react';
import Image from 'next/image';
import { Heart, Eye, Info, Star, Package } from 'lucide-react';
import { Button } from '../ui/Button';

interface FurnitureCardProps {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  price: number;
  rating: number;
  reviewCount: number;
  availability: 'in-stock' | 'low-stock' | 'out-of-stock';
  isFavorite?: boolean;
  onAddToRoom: () => void;
  onToggleFavorite: () => void;
  onViewDetails: () => void;
  className?: string;
}

const FurnitureCard: React.FC<FurnitureCardProps> = ({
  id,
  name,
  imageUrl,
  category,
  dimensions,
  price,
  rating,
  availability,
  reviewCount,
  isFavorite = false,
  onAddToRoom,
  onToggleFavorite,
  onViewDetails,
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const availabilityColors = {
    'in-stock': 'text-green-600 bg-green-100',
    'low-stock': 'text-orange-600 bg-orange-100',
    'out-of-stock': 'text-red-600 bg-red-100'
  };

  const availabilityText = {
    'in-stock': 'In Stock',
    'low-stock': 'Low Stock',
    'out-of-stock': 'Out of Stock'
  };

  return (
    <div
      id={`furniture-${id}`}
      data-furniture-id={id}
      className={`
        group relative bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden
        hover:shadow-lg hover:border-blue-300 transition-all duration-300
        focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2
        ${isHovered ? 'transform -translate-y-1' : ''}
        ${className}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        <Image
          src={imageUrl}
          alt={name}
          fill
          style={{ objectFit: 'cover' }}
          className={`transition-all duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"} ${isHovered ? "scale-105" : "scale-100"}`}
          onLoad={() => setImageLoaded(true)}
          sizes="(max-width: 768px) 100vw, 400px"
          priority={false}
        />
        
        {/* Loading Skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}

        {/* Overlay Actions */}
        {isHovered && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center space-x-2 transition-opacity duration-200">
            <Button
              variant="primary"
              size="sm"
              onClick={onAddToRoom}
              leftIcon={<Eye className="h-4 w-4" />}
              className="bg-white text-gray-900 hover:bg-gray-100"
            >
              Add to Room
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onViewDetails}
              className="bg-white text-gray-900 hover:bg-gray-100"
            >
              <Info className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Favorite Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleFavorite}
          className={`
            absolute top-2 right-2 w-8 h-8 p-0 rounded-full
            bg-white/90 hover:bg-white shadow-sm
            ${isFavorite ? "text-red-500" : "text-gray-400 hover:text-red-500"}
          `}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
        </Button>

        {/* Availability Badge */}
        <div className={`
          absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium
          ${availabilityColors[availability]}
        `}>
          {availabilityText[availability]}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Category & Rating */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
            {category}
          </span>
          <div className="flex items-center space-x-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-gray-900">{rating}</span>
            <span className="text-xs text-gray-500">({reviewCount})</span>
          </div>
        </div>

        {/* Name */}
        <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">
          {name}
        </h3>

        {/* Dimensions */}
        <div className="flex items-center space-x-1 text-xs text-gray-500">
          <Package className="h-3 w-3" />
          <span>
            {dimensions.width}″ × {dimensions.depth}″ × {dimensions.height}″
          </span>
        </div>

        {/* Price & Actions */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-lg font-bold text-gray-900">
            ${price.toLocaleString()}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onViewDetails}
              className="text-xs px-3 py-1"
            >
              Details
            </Button>
            
            <Button
              variant="primary"
              size="sm"
              onClick={onAddToRoom}
              className="text-xs px-3 py-1"
            >
              Add to Room
            </Button>
          </div>
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className={`
        absolute inset-0 border-2 border-blue-500 rounded-xl opacity-0
        transition-opacity duration-200
        ${isHovered ? "opacity-10" : ""}
      `} />
    </div>
  );
};

export default FurnitureCard;
