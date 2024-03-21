/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos } from './api/todos';
import { ToDoHeader } from './components/todoapp_header';
import { TodoList } from './components/todoapp_todolist';
import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { ErrorType } from './types/ErrorType';
import { Errors } from './components/todoapp_error';

export const App: React.FC = () => {
  const [tasks, setTasks] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [status, setStatus] = useState<Status>(Status.all);
  const [taskTitle, setTaskTitle] = useState('');
  const [allDone, setAllDone] = useState(false);

  const errorType: ErrorType = {
    empty: 'Title should not be empty',
    load: 'Unable to load todos',
  };

  const taskLeft = tasks.filter(task => !task.completed).length;

  const filterTodo: (todos: Todo[], mode: Status) => Todo[] = (todos, mode) => {
    switch (mode) {
      case Status.completed:
        return todos.filter(task => task.completed);
      case Status.active:
        return todos.filter(task => !task.completed);
      case Status.all:
      default:
        return tasks;
    }
  };

  const filteredTodos = filterTodo(tasks, status);

  if (!USER_ID) {
    return <UserWarning />;
  }

  // const errorCleaner = () => {
  //   setTimeout(() => setErrorMessage(''), 2000);
  // };

  const handleError: (errorMsg: string) => void = errorMsg => {
    setErrorMessage(errorMsg);
  };

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (!taskTitle) {
      handleError(errorType.empty);
    }
  };

  const handleAllCompleted = () => {
    const allCompleted = filteredTodos.map(todo => {
      if (!todo.completed) {
        setAllDone(true);

        return { ...todo, completed: true };
      }

      if (allDone && todo.completed) {
        setAllDone(false);

        return { ...todo, completed: false };
      }

      return todo;
    });

    setTasks(allCompleted);
  };

  const handleCompleted = (id: number) => {
    const newStateTodos = filteredTodos.map(todo => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }

      if (todo.completed) {
        setAllDone(false);
      }

      return todo;
    });

    setTasks(newStateTodos);
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    getTodos()
      .then(setTasks)
      .catch(() => handleError(errorType.load));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const timeoutId = setTimeout(() => setErrorMessage(''), 2000);

    return () => clearTimeout(timeoutId);
  }, [errorMessage]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <ToDoHeader
          handleAllCompleted={handleAllCompleted}
          allDone={allDone}
          handleSubmit={handleSubmit}
          taskTitle={taskTitle}
          setTaskTitle={setTaskTitle}
        />
        <TodoList
          filteredTodos={filteredTodos}
          handleCompleted={handleCompleted}
        />

        {/* Hide the footer if there are no todos */}
        {tasks.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {taskLeft} items left
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className="filter__link selected"
                data-cy="FilterLinkAll"
                onClick={() => setStatus(Status.all)}
              >
                All
              </a>

              <a
                href="#/active"
                className="filter__link"
                data-cy="FilterLinkActive"
                onClick={() => setStatus(Status.active)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className="filter__link"
                data-cy="FilterLinkCompleted"
                onClick={() => setStatus(Status.completed)}
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <Errors errorMessage={errorMessage} setErrorMessage={setErrorMessage} />
    </div>
  );
};
