/**
 * @description      :
 * @author           : Ridho Fauzan
 * @group            :
 * @created          : 13/09/2025 - 17:51:37
 *
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 13/09/2025
 * - Author          : Ridho Fauzan
 * - Modification    :
 **/
import GoogleIcon from '@/components/google-icon';
import InputError from '@/components/input-error';
import { PasswordInput } from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { BreadcrumbItem } from '@/types';
import { Form, Head } from '@inertiajs/react';
import { useState } from 'react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Login',
        href: '/login',
    },
];

export default function Login({ canResetPassword }: LoginProps) {
    const [password, setPassword] = useState('');

    return (
        <AuthLayout title="Login" description="Sign in to your account to continue your coffee journey" breadcrumbs={breadcrumbs}>
            <Head title="Login" />

            {/* CARD LOGIN */}
            <div className="mx-auto w-full max-w-md rounded-2xl border border-indigo-200 bg-white p-8 shadow-sm">
                <Form method="post" action={route('login')} resetOnSuccess={['password']} className="flex flex-col gap-6">
                    {({ processing, errors }) => (
                        <>
                            {/* Email */}
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-sm font-medium text-indigo-900">
                                    Email Address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="Your@email.com"
                                    className="rounded-full text-sm"
                                />
                                <InputError message={errors.email} />
                            </div>

                            {/* Password */}
                            <div className="grid gap-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-sm font-medium text-indigo-900">
                                        Password
                                    </Label>
                                    {canResetPassword && (
                                        <TextLink href={route('password.request')} className="text-xs text-indigo-700 hover:underline" tabIndex={5}>
                                            Forgot Password?
                                        </TextLink>
                                    )}
                                </div>
                                <PasswordInput
                                    id="password"
                                    // type="password" -- di handel di password-input.tsx
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Enter Your Password"
                                    className="rounded-full text-sm"
                                />
                                <InputError message={errors.password} />
                            </div>

                            {/* Remember Me */}
                            <div className="flex items-center space-x-2">
                                <Checkbox id="remember" name="remember" tabIndex={3} />
                                <Label htmlFor="remember" className="text-xs text-gray-600">
                                    Remember Me
                                </Label>
                            </div>

                            {/* Login Button */}
                            <Button
                                type="submit"
                                className="mt-2 w-full rounded-full bg-indigo-900 py-2 text-sm font-medium text-white hover:bg-indigo-800"
                                tabIndex={4}
                                disabled={processing}
                            >
                                Login
                            </Button>
                        </>
                    )}
                </Form>

                {/* Divider */}
                <div className="relative my-6 flex items-center">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="mx-3 flex-shrink text-xs text-gray-500">Or, Login with</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                {/* Google Button */}
                <a
                    href={route('auth.redirect', 'google')}
                    className="inline-flex w-full items-center justify-center rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                >
                    <GoogleIcon className="mr-2 h-5 w-5" />
                    Continue With Google
                </a>

                {/* Sign Up */}
                <div className="mt-6 text-center text-xs text-gray-500">
                    Not Account Yet?{' '}
                    <TextLink href={route('register')} className="font-semibold text-indigo-700 hover:underline" tabIndex={5}>
                        Sign Up
                    </TextLink>
                </div>
            </div>
        </AuthLayout>
    );
}
