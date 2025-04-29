// Create a new component for the rating system

// src/components/Rating/RestaurantRatingSystem.jsx
import { useState } from "react";
import { Star, StarHalf } from "lucide-react";
import restaurantService from "../../services/restaurant-service"; // Assuming this is your service for API calls

const RestaurantRatingSystem = ({ restaurant, onRatingSubmitted }) => {
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const handleRatingSubmit = async () => {
    if (userRating === 0) return;

    try {
      setSubmitting(true);
      // Assuming your restaurant service has a method to submit ratings
      await restaurantService.submitRating(restaurant._id, userRating);
      
      // Show thank you message
      setShowThankYou(true);
      setTimeout(() => setShowThankYou(false), 3000);
      
      // Notify parent component to update UI if needed
      if (onRatingSubmitted) {
        onRatingSubmitted(userRating);
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={20}
          className={`cursor-pointer ${
            (hoverRating || userRating) >= i
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          } transition-colors`}
          onClick={() => setUserRating(i)}
          onMouseEnter={() => setHoverRating(i)}
          onMouseLeave={() => setHoverRating(0)}
        />
      );
    }
    return stars;
  };

  // Display existing ratings from restaurant data
  const renderCurrentRating = () => {
    const rating = restaurant?.averageRating || 0;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    const stars = [];
    
    // Add full stars
    for (let i = 1; i <= fullStars; i++) {
      stars.push(
        <Star key={`full-${i}`} size={18} className="fill-yellow-400 text-yellow-400" />
      );
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" size={18} className="fill-yellow-400 text-yellow-400" />);
    }
    
    // Add empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 1; i <= emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={18} className="text-gray-300" />);
    }
    
    return stars;
  };

  return (
    <div className=" rounded-lg p-3 shadow-md  text-black">
      {showThankYou ? (
        <div className="text-center  text-black py-2 font-medium">
          Thank you for your rating!
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-2  text-black">
            <div className="flex items-center gap-1  text-black">
              {renderCurrentRating()}
              <span className="ml-1 font-medium  text-black">{restaurant?.averageRating?.toFixed(1) || "N/A"}</span>
            </div>
            <span className="text-xs  text-black">
              {restaurant?.totalRatings || 0} ratings
            </span>
          </div>
          
          <div className="border-t border-gray-200 pt-2">
            <p className="text-sm font-medium mb-1  text-black">Rate this restaurant:</p>
            <div className="flex items-center gap-1 mb-2">
              {renderStars()}
            </div>
            <button
              onClick={handleRatingSubmit}
              disabled={userRating === 0 || submitting}
              className={`w-full py-1 rounded text-sm font-medium ${
                userRating === 0
                  ? "bg-gray-200  text-black cursor-not-allowed"
                  : "bg-[#FC8A06] text-white hover:bg-[#E67E22]"
              } transition-colors`}
            >
              {submitting ? "Submitting..." : "Submit Rating"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default RestaurantRatingSystem;