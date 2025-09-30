//-- Convert each todo into a proper object
export const recordMapper = (record) => {
  const todo = {
    id: record.id,
    ...record.fields,
  }
  if (!record.fields.isCompleted) {
    todo.isCompleted = false;
  }
  return todo;
}