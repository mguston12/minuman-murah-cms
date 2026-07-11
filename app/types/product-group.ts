export type ProductGroupStatus = "ACTIVE" | "INACTIVE";

export interface ProductSubGroup {
  id: number;
  product_group_id: number;
  title: string;
  sort: number;
  status: ProductGroupStatus;
  created_at?: string;
  updated_at?: string;
}

export interface ProductGroup {
  id: number;
  key: string;
  title: string;
  description?: string | null;
  image?: string | null;
  image_url?: string | null;
  sort: number;
  status: ProductGroupStatus;
  created_at?: string;
  updated_at?: string;
  sub_groups?: ProductSubGroup[];
}

/**
 * Laravel pagination response
 */
export interface ProductGroupsResponse {
  success: boolean;
  data: {
    data: ProductGroup[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface ProductGroupResponse {
  success: boolean;
  message?: string;
  data: ProductGroup;
}

export interface ProductGroupCreatePayload {
  key: string;
  title: string;
  description?: string | null;
  image?: File | null;
  sort?: number;
  status: ProductGroupStatus;
}

export interface ProductGroupUpdatePayload extends ProductGroupCreatePayload {}
