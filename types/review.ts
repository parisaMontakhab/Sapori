export interface ReviewUser {
  id: string;
  name: string;
  photoUrl?: string;
}

export interface Review {
  id: string;
  review: string;
  rating: number;
  createdAt: string;
  user: ReviewUser;
  productId: string;
}

export interface ReviewPayload {
  review: string;
  rating: number;
}
