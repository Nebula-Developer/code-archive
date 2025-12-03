export type DBType = {
  id: number;
  // createdAt: string;
  // updatedAt: string;
};

export type User = {
  username: string;
  email: string;
  password: string;
  role: string;
  jwt: string;
} & DBType;

export type Category = {
  attributes: {
    name: string;
  };
} & DBType;

export type Page = {
  attributes: {
    title: string;
    content?: string;
    category: any;
    hero?: any;
    slug: string;
  };
} & DBType;
