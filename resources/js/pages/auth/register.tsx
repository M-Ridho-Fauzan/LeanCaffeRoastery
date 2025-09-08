import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function Register() {
    return (
        <AuthLayout title="Register" description="Create your account and start your premium coffee experience">
            <Head title="Register" />

            {/* Card Register */}
            <div className="mx-auto w-full max-w-md rounded-2xl border border-indigo-200 bg-white p-8 shadow-sm">
                <Form
                    method="post"
                    action={route('register')}
                    resetOnSuccess={['password', 'password_confirmation']}
                    disableWhileProcessing
                    className="flex flex-col gap-6"
                >
                    {({ processing, errors }) => (
                        <>
                            {/* Full Name */}
                            <div className="grid gap-2">
                                <Label htmlFor="name" className="text-sm font-medium text-indigo-900">
                                    Full Name
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Enter Your Full Name"
                                    className="rounded-full text-sm"
                                />
                                <InputError message={errors.name} className="mt-1" />
                            </div>

                            {/* Email */}
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-sm font-medium text-indigo-900">
                                    Email Address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="Your@email.com"
                                    className="rounded-full text-sm"
                                />
                                <InputError message={errors.email} />
                            </div>

                            {/* Password */}
                            <div className="grid gap-2">
                                <Label htmlFor="password" className="text-sm font-medium text-indigo-900">
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Create Strong Password"
                                    className="rounded-full text-sm"
                                />
                                <InputError message={errors.password} />
                            </div>

                            {/* Confirm Password */}
                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation" className="text-sm font-medium text-indigo-900">
                                    Confirm Password
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Confirm Your Password"
                                    className="rounded-full text-sm"
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>

                            {/* Submit */}
                            <Button
                                type="submit"
                                className="mt-2 w-full rounded-full bg-indigo-900 py-2 text-sm font-medium text-white hover:bg-indigo-800"
                                tabIndex={5}
                                disabled={processing}
                            >
                                {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                Get Started
                            </Button>
                        </>
                    )}
                </Form>

                {/* Link Sign In */}
                <div className="mt-6 text-center text-xs text-gray-500">
                    Already have an account?{' '}
                    <TextLink href={route('login')} className="font-semibold text-indigo-700 hover:underline" tabIndex={6}>
                        Sign In
                    </TextLink>
                </div>
            </div>
        </AuthLayout>
    );
}
