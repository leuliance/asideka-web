// Authentication Types
export interface AuthenticateRequestDto {
  username: string;
  password: string;
}

export interface CreateAccountRequestDto {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

export interface AuthResponse {
  message: string;
  status: string;
  payload: {
    token: string;
    tokenExpiry: string;
    userProfile: UserProfile;
  };
}

export interface UserProfile {
  id: string;
  identityId: string;
  firstname: string;
  lastname: string;
  country: string;
  countryCode: string;
  profilePicture: string;
  bannerImage: string;
  bio: string;
  category: string;
  phoneNumber: string;
  email: string;
  website: string;
  profession: string;
  skills: string[];
  languages: string[];
  certifications: string[];
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role?: string;
  businessId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface VerifyTokenDto {
  token: string;
}

export interface ChangePasswordDto {
  token: string;
  newPassword: string;
}

// Business Types
export interface CreateBusinessDto {
  name: string;
  category: string;
  country: string;
  countryCode: string;
  bio: string;
  photos: string[];
}

export interface UpdateBusinessDto {
  name?: string;
  description?: string;
  category?: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
  logo?: string;
}

export interface Business {
  id: string;
  businessId: string;
  identityId: string;
  name: string;
  bio: string;
  category: string;
  categoryId: string;
  country: string;
  countryCode: string;
  email: string;
  phoneNumber: string;
  website: string;
  profilePicture: string;
  bannerImage: string;
  businessDocument: string;
}

export interface BusinessCategory {
  id: string;
  name: string;
  description?: string;
}

export interface VerifyBusinessUserDto {
  userId: string;
  businessId: string;
}

export interface DisableBusinessUserDto {
  userId: string;
  businessId: string;
}

export interface AddBusinessUserDto {
  email: string;
  businessId: string;
  role: string;
}

// Post Types
export interface CreatePostDto {
  title: string;
  content: string;
  businessId: string;
  images?: string[];
  pricing?: PostPricingDto;
}

export interface PostPricingDto {
  price: number;
  currency: string;
  priceType?: "fixed" | "negotiable" | "range";
  maxPrice?: number;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  businessId: string;
  userId: string;
  images?: string[];
  pricing?: PostPricingDto;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  business?: Business;
  user?: User;
}

// Interaction Types
export interface CreatePostInteractionDto {
  postId: string;
  type: "like" | "comment" | "share" | "view";
  comment?: string;
}

export interface Interaction {
  id: string;
  postId: string;
  userId: string;
  type: "like" | "comment" | "share" | "view";
  comment?: string;
  createdAt: string;
  updatedAt: string;
  post?: Post;
  user?: User;
}

export interface InteractionSummary {
  postId: string;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  viewCount: number;
}

// User Profile Types
export interface UpdateUserProfileRequestDto {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  bio?: string;
  avatar?: string;
  coverImage?: string;
}

// Message Types
export interface CreateMessageDto {
  message: string;
  subject: string;
  senderId: string;
  receiverId: string;
  senderType: string;
}

export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  attachments?: string[];
  read: boolean;
  createdAt: string;
  updatedAt: string;
  sender?: User;
  recipient?: User;
}

export interface ChatDto {
  message: string;
  threadId: string;
  senderId: string;
  receiverId: string;
  senderType: string;
}

export interface MessageThread {
  id: string;
  senderId: string;
  receiverId: string;
  senderName: string;
  receiverName: string;
  senderProfilePicture: string;
  receiverProfilePicture: string;
  lastMessage: string;
  updatedAt: string;
}

// Due Diligence Types
export interface RequestDueDiligenceDto {
  businessName: string;
  businessId: string;
  fullname: string;
  email: string;
  phoneNumber: string;
  ownedBusinessName: string;
  dueDiligencePurpose: string;
  urgencyLevel: string;
  infomationUsage: string;
  additionalRequirements: string;
}

export interface DueDiligence {
  id: string;
  businessName: string;
  businessId: string;
  fullname: string;
  email: string;
  phoneNumber: string;
  ownedBusinessName: string;
  dueDiligencePurpose: string;
  urgencyLevel: string;
  infomationUsage: string;
  additionalRequirements: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
  business?: Business;
  user?: User;
}

// Policy Types
export interface AiQueryDto {
  query: string;
  context?: string;
}

export interface AiQueryResponse {
  answer: string;
  sources?: string[];
}

export interface BusinessNews {
  article_id: string;
  link: string;
  title: string;
  description: string;
  content: string;
  keywords?: string[];
  creator?: string[];
  language: string;
  country?: string[];
  category?: string[];
  datatype: string;
  pubDate: string;
  pubDateTZ: string;
  fetched_at: string;
  image_url: string | null;
  video_url: string | null;
  source_id: string;
  source_name: string;
  source_priority: number;
  source_url: string;
  source_icon: string;
  duplicate: boolean;
}

// Search Types
export interface SearchParams {
  query: string;
  limit?: number;
  page?: number;
}

export interface SearchResult {
  businesses: Business[];
  posts: Post[];
  total: number;
}

// API Response wrapper
export interface ApiResponse<T> {
  message: string;
  status: string;
  payload: T;
}

// Pagination Types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  query?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
