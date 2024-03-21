import classNames from 'classnames';

type Props = {
  handleAllCompleted: () => void;
  allDone: boolean;
  handleSubmit: (event: { preventDefault: () => void }) => void;
  taskTitle: string;
  setTaskTitle: (e: string) => void;
};

export const ToDoHeader = ({
  handleAllCompleted,
  allDone,
  handleSubmit,
  taskTitle,
  setTaskTitle,
}: Props) => {
  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all', { active: allDone })}
        data-cy="ToggleAllButton"
        onClick={() => handleAllCompleted()}
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          value={taskTitle}
          onChange={event => setTaskTitle(event.target.value)}
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
