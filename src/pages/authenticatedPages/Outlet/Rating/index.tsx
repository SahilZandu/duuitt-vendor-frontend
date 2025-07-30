import { useEffect, useState } from "react";
import PageTitle from "../../../../components/Ui/PageTitle";
import Loader from "../../../../components/loader/Loader";
import { fetchRestaurantReviews } from "../../../../api/RatingAndPaymentLogsApi";
interface Customer {
    name?: string;
    profile_pic?: string;
}

interface OrderItem {
    food_item_id: string;
    food_item_name?: string;
    quantity: number;
    food_item_price: number;
    food_item_image: string[];
}

interface Order {
    cart_items: OrderItem[];
}

interface Review {
    _id: string;
    customer?: Customer;
    food_review?: string;
    food_rating?: number;
    taste_rating?: number;
    packaging_rating?: number;
    value_rating?: number;
    images?: string[];
    food_item_image?: string[];
    order?: Order;
}

interface OverallReview {
    food_rating?: number;
    taste_rating?: number;
    packaging_rating?: number;
    value_rating?: number;
}

interface RatingResponse {
    overall_review: OverallReview;
    data: Review[];
}

const Rating = () => {
    const restaurant_id = localStorage.getItem("restaurant_id");
    const [ratingsData, setRatingsData] = useState<RatingResponse | null>(null);

    useEffect(() => {
        const fetchRatingData = async () => {
            try {
                if (!restaurant_id) return;
                const response = await fetchRestaurantReviews({
                    restaurant_id,
                    limit: 1000,
                });
                setRatingsData(response as RatingResponse);

            } catch (error) {
                console.error({ error });
            }
        };

        fetchRatingData();
    }, [restaurant_id]);

    if (!ratingsData) return <Loader />;

    const { overall_review, data: reviews } = ratingsData;

    const renderStars = (rating?: number) => {
        if (typeof rating !== "number" || rating < 0 || rating > 5) {
            return <span className="text-gray-400">N/A</span>;
        }

        return (
            <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                        key={i}
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill={i < rating ? "green" : "#d1d2d3ff"} // yellow-400 and gray-200
                        stroke="none"
                        className="transition-transform duration-200"
                    >
                        <path d="M12 17.27L18.18 21 16.54 13.97 
                        22 9.24l-7.19-.61L12 2 9.19 8.63 
                        2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                ))}
            </div>
        );
    };
    return (
        <div className="p-4 md:p-8">
            <PageTitle title="Customer Ratings" />

            {/* Overall Ratings */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 bg-white p-4 rounded-xl shadow text-sm">
                <div><span className="font-semibold text-gray-700">Restaurant:</span> {renderStars(overall_review?.food_rating)}</div>
                <div><span className="font-semibold text-gray-700">Taste:</span> {renderStars(overall_review?.taste_rating)}</div>
                <div><span className="font-semibold text-gray-700">Packaging:</span> {renderStars(overall_review?.packaging_rating)}</div>
                <div><span className="font-semibold text-gray-700">Price:</span> {renderStars(overall_review?.value_rating)}</div>
            </div>

            <h3 className="text-xl font-semibold mb-4 text-gray-800">Customer Reviews</h3>

            {Array.isArray(reviews) && reviews.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                    {reviews.map((review) => (
                        <div key={review._id} className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition">
                            <div className="flex items-center gap-4 mb-3">
                                <img
                                    src={
                                        review.customer?.profile_pic
                                            ? `${import.meta.env.VITE_BACKEND_BASE_URL}/${review.customer.profile_pic}`
                                            : "/default-user.png"
                                    }
                                    alt="customer"
                                    className="w-12 h-12 rounded-full object-cover border"
                                    crossOrigin="anonymous"
                                />
                                <span className="font-medium text-gray-800">{review.customer?.name || "Anonymous"}</span>
                            </div>

                            <p className="text-sm text-gray-600 mb-3 border-b border-gray-200 pb-2">{review?.food_review || "No review given."}</p>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm text-gray-700 mb-3">
                                <div>Restaurant: {renderStars(review.food_rating)}</div>
                                <div>Taste: {renderStars(review.taste_rating)}</div>
                                <div>Packaging: {renderStars(review.packaging_rating)}</div>
                                <div>Price: {renderStars(review.value_rating)}</div>
                            </div>

                            {Array.isArray(review?.order?.cart_items) &&
                                review?.order?.cart_items?.some(item => item?.food_item_image) && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {review.order.cart_items.map((item, idx) => {
                                            if (!item?.food_item_image) return null;

                                            return (
                                                <img
                                                    key={idx}
                                                    src={`${import.meta.env.VITE_BACKEND_BASE_URL}${item.food_item_image}`}
                                                    alt={`review-${idx}`}
                                                    crossOrigin="anonymous"
                                                    onError={(e) => {
                                                        e.currentTarget.onerror = null; 
                                                        e.currentTarget.src = "/public/images/default-food-image.png"; 
                                                    }}
                                                    className="w-20 h-20 object-cover rounded-md border"
                                                />
                                            );
                                        })}
                                    </div>
                                )}


                            <div className="mt-4">
                                <strong className="block mb-1 text-sm text-gray-700">Ordered Items:</strong>
                                {Array.isArray(review.order?.cart_items) && review.order.cart_items.length > 0 ? (
                                    <ul className="list-disc list-inside text-sm text-gray-700">
                                        {review.order.cart_items.map((item) => (
                                            <li key={item.food_item_id}>
                                                {item.food_item_name || "Unnamed item"} × {item.quantity}
                                                {/* – ₹{item.food_item_price} */}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-gray-500">No items listed.</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-gray-500">No reviews available.</div>
            )}
        </div>
    );
};

export default Rating;

