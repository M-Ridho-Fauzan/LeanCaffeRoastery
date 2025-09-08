import { Form, Head } from '@inertiajs/react';
import { ArrowLeft, LoaderCircle, Mail } from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function ForgotPassword() {
    return (
        <AuthLayout title="Reset Password" description="Enter your email address and we’ll send you a link to reset your password">
            <Head title="Forgot Password" />

            {/* Card Reset Password */}
            <div className="mx-auto w-full max-w-md rounded-2xl border border-indigo-200 bg-white p-8 shadow-sm">
                <Form method="post" action={route('password.email')}>
                    {({ processing, errors }) => (
                        <div className="grid gap-6">
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
                                    placeholder="Your@email.com"
                                    className="rounded-full text-sm"
                                />
                                <p className="text-xs text-gray-400">We’ll send password reset instructions to this email address</p>
                                <InputError message={errors.email} />
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full rounded-full bg-indigo-900 py-2 text-white hover:bg-indigo-800"
                                disabled={processing}
                            >
                                {processing ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
                                Send Reset Link
                            </Button>

                            {/* Back to Login */}
                            <div className="flex justify-center">
                                <TextLink href={route('login')} className="flex items-center gap-1 font-medium text-indigo-900 hover:underline">
                                    <ArrowLeft className="h-4 w-4" />
                                    Back To Login
                                </TextLink>
                            </div>
                        </div>
                    )}
                </Form>

                {/* Footer */}
                <div className="mt-6 text-center text-xs text-gray-500">
                    Not Account Yet?{' '}
                    <TextLink href={route('register')} className="font-semibold text-indigo-700 hover:underline">
                        Sign Up
                    </TextLink>
                </div>
            </div>
        </AuthLayout>
    );
}
