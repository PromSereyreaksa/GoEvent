// Mock data for event collaboration system
// This file can be easily deleted when no longer needed

export const mockUsers = [
  {
    id: 1,
    first_name: "John",
    last_name: "Smith",
    email: "john.vendor@example.com",
    role: "vendor",
    avatar: null
  },
  {
    id: 2,
    first_name: "Sarah",
    last_name: "Johnson",
    email: "sarah.client@example.com",
    role: "client",
    avatar: null
  },
  {
    id: 3,
    first_name: "Mike",
    last_name: "Davis",
    email: "mike.client@example.com",
    role: "client", 
    avatar: null
  },
  {
    id: 4,
    first_name: "Emily",
    last_name: "Wilson",
    email: "emily.client@example.com",
    role: "client",
    avatar: null
  },
  {
    id: 5,
    first_name: "David",
    last_name: "Brown",
    email: "david.vendor@example.com",
    role: "vendor",
    avatar: null
  }
];

export const mockEvents = [
  
    
  {
    id: 1,
    name: "Sarah & Mike's Wedding",
    title: "Sarah & Mike's Wedding",
    description: "A beautiful outdoor wedding ceremony followed by an elegant reception.",
    eventType: "wedding",
    category: "wedding",
    date: "2025-08-15",
    start_time: "15:00",
    startTime: "15:00",
    end_time: "23:00",
    endTime: "23:00",
    venue: "Grand Palace Hotel",
    venue_name: "Grand Palace Hotel",
    details: "A beautiful outdoor wedding ceremony followed by an elegant reception.",
    event_banner: "/placeholder.svg",
    image: "/placeholder.svg",
    guest_count: 150,
    googleMapLink: "https://maps.google.com/example1",
    youtubeUrl: "",
    createdBy: 1, // John Smith (vendor)
    teamMembers: [
      {
        id: 2,
        first_name: "Sarah",
        last_name: "Johnson", 
        email: "sarah.client@example.com",
        role: "client",
        addedAt: "2025-07-01T10:00:00Z",
        permissions: ["edit", "view", "invite"]
      },
      {
        id: 3,
        first_name: "Mike",
        last_name: "Davis",
        email: "mike.client@example.com", 
        role: "client",
        addedAt: "2025-07-01T10:05:00Z",
        permissions: ["edit", "view", "invite"]
      }
    ],
    hosts: [
      {
        id: Date.now(),
        name: "Sarah Johnson",
        parentNames: ["Robert Johnson", "Linda Johnson"]
      },
      {
        id: Date.now() + 1,
        name: "Mike Davis", 
        parentNames: ["William Davis", "Patricia Davis"]
      }
    ],
    agenda: [
      {
        id: Date.now(),
        date: "2025-08-15",
        title: "Wedding Day",
        activities: [
          { id: Date.now() + 1, time: "15:00", activity: "Wedding Ceremony" },
          { id: Date.now() + 2, time: "16:30", activity: "Cocktail Hour" },
          { id: Date.now() + 3, time: "18:00", activity: "Reception Dinner" },
          { id: Date.now() + 4, time: "21:00", activity: "Dancing & Entertainment" }
        ]
      }
    ],
    status: "planning",
    createdAt: "2025-07-01T09:00:00Z",
    updatedAt: "2025-07-08T14:30:00Z"
  },
  {
    id: 2,
    name: "Corporate Annual Gala 2025",
    title: "Corporate Annual Gala 2025", 
    description: "Annual corporate gala celebrating company achievements and team success.",
    eventType: "corporate",
    category: "corporate",
    date: "2025-09-20",
    start_time: "18:00",
    startTime: "18:00",
    end_time: "24:00",
    endTime: "24:00",
    venue: "Convention Center Downtown",
    venue_name: "Convention Center Downtown",
    details: "Annual corporate gala celebrating company achievements and team success.",
    event_banner: "/placeholder.svg",
    image: "/placeholder.svg",
    guest_count: 300,
    googleMapLink: "https://maps.google.com/example2", 
    youtubeUrl: "",
    createdBy: 5, // David Brown (vendor)
    teamMembers: [
      {
        id: 4,
        first_name: "Emily",
        last_name: "Wilson",
        email: "emily.client@example.com",
        role: "client",
        addedAt: "2025-07-05T14:00:00Z",
        permissions: ["edit", "view", "invite"]
      }
    ],
    hosts: [
      {
        id: Date.now() + 10,
        name: "Emily Wilson",
        parentNames: ["James Wilson"]
      }
    ],
    agenda: [
      {
        id: Date.now() + 20,
        date: "2025-09-20",
        title: "Gala Night",
        activities: [
          { id: Date.now() + 21, time: "18:00", activity: "Welcome Reception" },
          { id: Date.now() + 22, time: "19:30", activity: "Awards Ceremony" },
          { id: Date.now() + 23, time: "21:00", activity: "Dinner Service" },
          { id: Date.now() + 24, time: "22:30", activity: "Networking & Entertainment" }
        ]
      }
    ],
    status: "planning",
    createdAt: "2025-07-05T13:00:00Z", 
    updatedAt: "2025-07-08T16:15:00Z"
  }
];

// Helper function to get user by ID
export const getUserById = (id) => mockUsers.find(user => user.id === id);

// Helper function to get events by creator
export const getEventsByCreator = (creatorId) => 
  mockEvents.filter(event => event.createdBy === creatorId);

// Helper function to get events where user is a team member
export const getEventsByTeamMember = (userId) =>
  mockEvents.filter(event => 
    event.teamMembers?.some(member => member.id === userId)
  );
