import css from './NoteForm.module.css';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import type { NoteTag } from '../../types/note';

interface NoteFormProps {
  onSubmit: (values: {
    title: string;
    content: string;
    tag: NoteTag;
  }) => void;
}

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, 'Minimum 3 characters')
    .max(50, 'Maximum 50 characters')
    .required('Required'),
  content: Yup.string().max(500, 'Maximum 500 characters'),
  tag: Yup.string()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'])
    .required('Required'),
});

export default function NoteForm({ onSubmit }: NoteFormProps) {
  return (
    <Formik
      initialValues={{
        title: '',
        content: '',
        tag: 'Todo' as NoteTag,
      }}
      validationSchema={validationSchema}
      onSubmit={(values, actions) => {
        onSubmit(values);
        actions.resetForm();
      }}
    >
      <Form className={css.form}>
        <label>
          Title
          <Field className={css.input} type="text" name="title" />
          <ErrorMessage
            className={css.error}
            name="title"
            component="span"
          />
        </label>

        <label>
          Content
          <Field
            className={css.textarea}
            as="textarea"
            name="content"
          />
          <ErrorMessage
            className={css.error}
            name="content"
            component="span"
          />
        </label>

        <label>
          Tag
          <Field className={css.select} as="select" name="tag">
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
        </label>

        <button className={css.button} type="submit">
          Create note
        </button>
      </Form>
    </Formik>
  );
}