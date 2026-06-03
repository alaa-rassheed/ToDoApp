import { useForm } from 'react-hook-form';
import Input from '../common/Input';
import Button from '../common/Button';
import { TODO_STATUS } from '../../utils/constants';
import styles from './TodoForm.module.css';

export default function TodoForm({ defaultValues, onSubmit, loading, onCancel }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      status: TODO_STATUS.PENDING,
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <Input
        label="Title"
        placeholder="Enter todo title"
        error={errors.title?.message}
        register={register('title', { required: 'Title is required' })}
      />
      <div className={styles.field}>
        <label className={styles.label}>Description</label>
        <textarea
          className={styles.textarea}
          placeholder="Enter description (optional)"
          rows={3}
          {...register('description')}
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Status</label>
        <select className={styles.select} {...register('status')}>
          {Object.values(TODO_STATUS).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className={styles.actions}>
        <Button type="submit" loading={loading}>
          {defaultValues ? 'Update' : 'Create'} Todo
        </Button>
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
