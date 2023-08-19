import * as yup from 'yup';

export const loginSchema = yup.object().shape({
	name: yup
		.string()
		.matches(
			/^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
			'Please enter a valid name'
		)
		.required('Required'),
});
