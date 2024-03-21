import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 254;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const getTodosDone = () => {
  return client.get('/todos?userId=2&completed=true');
};

export const getTodosActive = () => {
  return client.get('/todos?userId=2&completed=false');
};

// Add more methods here
