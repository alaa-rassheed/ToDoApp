import { TODO_STATUS } from './constants';

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const getStatusColor = (status) => {
  switch (status) {
    case TODO_STATUS.PENDING:
      return 'var(--color-pending)';
    case TODO_STATUS.IN_PROGRESS:
      return 'var(--color-in-progress)';
    case TODO_STATUS.COMPLETED:
      return 'var(--color-completed)';
    default:
      return 'var(--text)';
  }
};
