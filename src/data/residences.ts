export interface Residence {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  features: {
    beds: number;
    baths: number;
    sqft: number;
  };
  location: string;
  sold?: boolean;
}

export const residences: Residence[] = [
  {
    id: "villa-azure",
    name: "Villa Azure",
    description: "A stunning beachfront property with panoramic ocean views and direct access to the white sandy beach.",
    price: "$2,500,000",
    image: "/1.jpg",
    features: { beds: 5, baths: 6, sqft: 4500 },
    location: "Malibu, CA",
  },
  {
    id: "villa-verde",
    name: "Villa Verde",
    description: "Nestled in the lush hills, this eco-friendly villa offers total privacy and a connection with nature.",
    price: "$1,800,000",
    image: "/2.jpg",
    features: { beds: 4, baths: 4, sqft: 3200 },
    location: "Ubud, Bali",
  },
  {
    id: "the-glass-house",
    name: "The Glass House",
    description: "A modern architectural masterpiece featuring floor-to-ceiling windows and minimalist design.",
    price: "$3,200,000",
    image: "/3.jpg",
    features: { beds: 6, baths: 7, sqft: 5500 },
    location: "Beverly Hills, CA",
  },
  {
    id: "sunset-retreat",
    name: "Sunset Retreat",
    description: "Perfectly positioned to capture breathtaking sunsets, this villa features an infinity pool and outdoor lounge.",
    price: "$2,100,000",
    image: "/5.jpg",
    features: { beds: 4, baths: 5, sqft: 3800 },
    location: "Santorini, Greece",
  },
  {
    id: "mountain-view-estate",
    name: "Mountain View Estate",
    description: "A grand estate with sweeping mountain views, featuring a private vineyard and wine cellar.",
    price: "$4,500,000",
    image: "/6.jpg",
    features: { beds: 8, baths: 10, sqft: 8000 },
    location: "Tuscany, Italy",
  },
  {
    id: "palm-oasis",
    name: "Palm Oasis",
    description: "A tropical paradise surrounded by palm trees, featuring a lagoon-style pool and tiki bar.",
    price: "$1,950,000",
    image: "/7.jpg",
    features: { beds: 5, baths: 5, sqft: 4000 },
    location: "Miami, FL",
  },
  {
    id: "urban-sanctuary",
    name: "Urban Sanctuary",
    description: "A hidden gem in the heart of the city, offering a peaceful escape with a rooftop garden.",
    price: "$2,800,000",
    image: "/8.jpg",
    features: { beds: 3, baths: 3, sqft: 2500 },
    location: "New York, NY",
  },
  {
    id: "lakeside-manor",
    name: "Lakeside Manor",
    description: "A classic manor house situated on the edge of a serene lake, with a private dock and boathouse.",
    price: "$3,500,000",
    image: "/9.jpg",
    features: { beds: 6, baths: 6, sqft: 6000 },
    location: "Lake Como, Italy",
  },
  {
    id: "desert-mirage",
    name: "Desert Mirage",
    description: "A contemporary desert home designed to blend with the landscape, featuring a stargazing deck.",
    price: "$1,600,000",
    image: "/10.jpg",
    features: { beds: 3, baths: 4, sqft: 2800 },
    location: "Joshua Tree, CA",
  },
];
