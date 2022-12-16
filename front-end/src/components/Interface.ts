export default interface User {
  email: string;
  username: string;
  password: string;
  isAdmin: string;
  _id: string;
}

export default interface Book {
  title: string;
  pageCount: number;
  description: string;
  image: string;
  author: string;
  _id: string;
}
