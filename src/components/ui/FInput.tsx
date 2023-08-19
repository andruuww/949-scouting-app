import { FieldHookConfig, useField } from 'formik';
import { useEffect, useRef, useState } from 'react';

const FInput = (props: FieldHookConfig<string>) => {
	const [field, meta, helpers] = useField(props);
	let [inputErrorStyle, setInputErrorStyle] = useState('');

	useEffect(() => {
		setInputErrorStyle(
			meta.touched && meta.error ? 'border-red-600 dark:border-red-300' : ''
		);
	}, [meta.touched, meta.error]);

	return (
		<>
			<input
				{...field}
				className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background 
                    file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground 
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
                    disabled:cursor-not-allowed disabled:opacity-50 ${props.className} ${inputErrorStyle}`}
				placeholder={props.placeholder}
				type={props.type}
			/>
			{meta.touched && meta.error && (
				<div className='input-error text-sm mt-2 text-red-600 dark:text-red-300'>
					{meta.error}
				</div>
			)}
		</>
	);
};

export default FInput;
