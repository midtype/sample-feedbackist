/// <reference types="react-scripts" />

declare module 'atomize';

interface IUser {
  id: string;
  private: {
    name: string;
    email: string;
    photoUrl: string;
  };
}

interface ICategory {
  id: string;
  name: string;
  slug: string;
  hex: string;
  emoji: string;
}
