import {
  Calendar,
  Users,
  TrendingUp,
  Heart,
  UserPlus,
  CreditCard,
} from "lucide-react";

// Analytics data
export const analyticsData = [
  {
    title: "Total Events",
    value: "24",
    change: "+12.5%",
    trend: "up",
    icon: Calendar,
    color: "text-blue-600",
  },
  {
    title: "Attendees",
    value: "1,247",
    change: "+8.2%",
    trend: "up",
    icon: Users,
    color: "text-green-600",
  },
  {
    title: "Revenue",
    value: "$12.4K",
    change: "+15.3%",
    trend: "up",
    icon: TrendingUp,
    color: "text-purple-600",
  },
  {
    title: "Satisfaction",
    value: "94%",
    change: "-2.1%",
    trend: "down",
    icon: Heart,
    color: "text-pink-600",
  },
];

// Notifications data
export const notifications = [
  {
    id: 1,
    title: "New Event Registration",
    description: "John Doe registered for Annual Company Retreat",
    time: "2 minutes ago",
    unread: true,
    icon: UserPlus,
  },
  {
    id: 2,
    title: "Event Update",
    description: "Product Launch Event venue has been changed",
    time: "1 hour ago",
    unread: true,
    icon: Calendar,
  },
  {
    id: 3,
    title: "Payment Received",
    description: "Payment of $299 received for Digital Marketing Workshop",
    time: "3 hours ago",
    unread: false,
    icon: CreditCard,
  },
];

// Sample events data
export const sampleEvents = [
  {
    id: 1,
    eventType: "wedding",
    name: "Sarah & John's Wedding",
    details:
      "Join us for a beautiful three-day wedding celebration filled with love, joy, and unforgettable moments. From the traditional ceremony to the grand reception, every moment will be cherished.",
    agenda: [
      {
        id: 1,
        date: "2024-03-14",
        title: "Pre-Wedding Celebration",
        activities: [
          { id: 1, time: "14:00", activity: "Guest arrival and check-in" },
          { id: 2, time: "16:00", activity: "Welcome tea ceremony" },
          { id: 3, time: "18:00", activity: "Traditional henna ceremony" },
          {
            id: 4,
            time: "20:00",
            activity: "Dinner and cultural performances",
          },
        ],
      },
      {
        id: 2,
        date: "2024-03-15",
        title: "Wedding Ceremony",
        activities: [
          {
            id: 5,
            time: "08:00",
            activity: "Bridal preparation and photography",
          },
          { id: 6, time: "10:00", activity: "Groom's procession (Baraat)" },
          { id: 7, time: "11:00", activity: "Wedding ceremony begins" },
          {
            id: 8,
            time: "13:00",
            activity: "Ceremony conclusion and blessings",
          },
          { id: 9, time: "14:00", activity: "Lunch and family photos" },
        ],
      },
      {
        id: 3,
        date: "2024-03-16",
        title: "Reception & Celebration",
        activities: [
          { id: 10, time: "17:00", activity: "Cocktail hour and networking" },
          { id: 11, time: "19:00", activity: "Grand entrance and first dance" },
          { id: 12, time: "20:00", activity: "Dinner service begins" },
          { id: 13, time: "21:30", activity: "Speeches and toasts" },
          { id: 14, time: "22:00", activity: "Dancing and entertainment" },
          { id: 15, time: "24:00", activity: "Late night snacks and farewell" },
        ],
      },
    ],
    venue: "Grand Palace Resort",
    hosts: [
      {
        id: 1,
        name: "Sarah Johnson",
        parentNames: ["Michael Johnson", "Lisa Johnson"],
      },
      {
        id: 2,
        name: "John Smith",
        parentNames: ["Robert Smith", "Mary Smith"],
      },
    ],
    date: "2024-03-15",
    startTime: "10:00",
    endTime: "24:00",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    googleMapLink: "https://maps.google.com/maps?q=Grand+Palace+Resort",
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: 2,
    eventType: "wedding",
    name: "Emily & David's Wedding",
    details:
      "A romantic beach wedding celebration with an intimate ceremony followed by a spectacular reception under the stars.",
    agenda: [
      {
        id: 4,
        date: "2024-04-20",
        title: "Beach Wedding Day",
        activities: [
          { id: 16, time: "15:00", activity: "Beach ceremony setup" },
          {
            id: 17,
            time: "16:00",
            activity: "Guest seating and welcome drinks",
          },
          { id: 18, time: "17:00", activity: "Beach wedding ceremony" },
          { id: 19, time: "18:00", activity: "Sunset photography session" },
          { id: 20, time: "19:30", activity: "Cocktail reception on terrace" },
          { id: 21, time: "20:30", activity: "Dinner and dancing under stars" },
        ],
      },
    ],
    venue: "Seaside Beach Resort",
    hosts: [
      {
        id: 3,
        name: "Emily Davis",
        parentNames: ["James Davis", "Lisa Davis"],
      },
      {
        id: 4,
        name: "David Wilson",
        parentNames: ["Thomas Wilson", "Susan Wilson"],
      },
    ],
    date: "2024-04-20",
    startTime: "16:00",
    endTime: "23:00",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    googleMapLink: "https://maps.google.com/maps?q=Seaside+Beach+Resort",
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: 3,
    eventType: "wedding",
    name: "Priya & Raj's Wedding",
    details:
      "A traditional Indian wedding celebration spanning multiple days with rich cultural ceremonies, vibrant colors, and joyous festivities.",
    agenda: [
      {
        id: 5,
        date: "2024-05-08",
        title: "Sangam & Mehndi",
        activities: [
          {
            id: 22,
            time: "10:00",
            activity: "Sangam ceremony - families meet",
          },
          { id: 23, time: "14:00", activity: "Lunch and cultural programs" },
          { id: 24, time: "16:00", activity: "Mehndi ceremony begins" },
          { id: 25, time: "20:00", activity: "Traditional dinner and music" },
        ],
      },
      {
        id: 6,
        date: "2024-05-09",
        title: "Sangeet Night",
        activities: [
          { id: 26, time: "18:00", activity: "Sangeet ceremony preparations" },
          { id: 27, time: "19:00", activity: "Dance performances by families" },
          { id: 28, time: "21:00", activity: "Couple's special dance" },
          {
            id: 29,
            time: "22:00",
            activity: "Open dance floor and celebration",
          },
        ],
      },
      {
        id: 7,
        date: "2024-05-10",
        title: "Wedding Day",
        activities: [
          { id: 30, time: "06:00", activity: "Ganesh Puja and preparations" },
          { id: 31, time: "09:00", activity: "Baraat - Groom's procession" },
          { id: 32, time: "11:00", activity: "Jaimala and wedding rituals" },
          { id: 33, time: "13:00", activity: "Pheras and sacred vows" },
          { id: 34, time: "15:00", activity: "Wedding lunch and blessings" },
          { id: 35, time: "19:00", activity: "Reception and grand feast" },
        ],
      },
    ],
    venue: "Heritage Palace Hotel",
    hosts: [
      {
        id: 5,
        name: "Priya Sharma",
        parentNames: ["Rajesh Sharma", "Sunita Sharma"],
      },
      {
        id: 6,
        name: "Raj Patel",
        parentNames: ["Vikram Patel", "Meera Patel"],
      },
    ],
    date: "2024-05-10",
    startTime: "06:00",
    endTime: "22:00",
    youtubeUrl: "",
    googleMapLink: "https://maps.google.com/maps?q=Heritage+Palace+Hotel",
    image: "/placeholder.svg?height=200&width=400",
  },
];
