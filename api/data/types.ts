
export type User = {
  _id: string, name: string,
  email: string, password: string,
  dob: Date
}

export type Post = {
  _id: string, user: string,
  date: Date, content: string
};
