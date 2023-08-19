'use client';

import { Button } from '@/components/ui/button';
import { LoginForm } from '@/lib/types';
import { loginSchema } from '@/lib/schemas';
import FInput from '@/components/ui/FInput';

import { useRouter } from 'next/navigation';
import { Form, Formik, FormikHelpers } from 'formik';
import MenuBar from '@/components/menu-bar';
import { useEffect } from 'react';

export default function Home() {
	const router = useRouter();

	const onSubmit = (values: LoginForm, actions: FormikHelpers<LoginForm>) => {
		if (typeof window !== 'undefined') {
			localStorage.setItem('scoutName', values.name);
		}
		router.push('/pit');
	};

	localStorage.removeItem('scoutName');

	// impement formik into the rest of the code sometime
	return (
		<>
			<main className='flex flex-col p-7 min-h-screen max-w-md mx-auto'>
				{/* <div className='text-2xl font-bold'>949 Scouting</div> */}
				<MenuBar></MenuBar>
				<Formik
					initialValues={{
						name: '',
					}}
					onSubmit={onSubmit}
					validationSchema={loginSchema}>
					<div className='flex flex-col flex-1 justify-center'>
						<Form className='flex flex-col' autoComplete='off'>
							<FInput
								className='text-center'
								name='name'
								placeholder='Enter your name'
							/>

							<Button type='submit' asChild={false} className='mt-5'>
								Login
							</Button>
						</Form>
					</div>
				</Formik>
			</main>
		</>
	);
}
