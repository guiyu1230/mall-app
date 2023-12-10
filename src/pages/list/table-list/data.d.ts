export type TableListItem = {
  key: number;
  disabled?: boolean;
  href: string;
  avatar: string;
  name: string;
  owner: string;
  desc: string;
  callNo: number;
  status: string;
  updatedAt: Date;
  createdAt: Date;
  progress: number;
};

export type TableListItem1 = {
  id: number;
  wine: string;
  wineType: 'Fragrance' | 'strongAroma' | 'sauceAroma';
  tier: 'all' | 'middle' | 'middleUp' | 'middleDown';
  wineAge: number;
  alcoholicStrength: number;
  unit: 'jin' | 'kilogram' | 'piece' | 'pot';
  costPrice: number;
  salePrice: number;
  showTime: Date;
};

export type TableListPagination = {
  total: number;
  pageSize: number;
  current: number;
};

export type TableListData = {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
};

export type TableListParams = {
  status?: string;
  name?: string;
  desc?: string;
  key?: number;
  pageSize?: number;
  currentPage?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};
