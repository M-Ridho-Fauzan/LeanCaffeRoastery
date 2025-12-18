import { AppHeader } from '@/components/app-header';
import { Toaster } from '@/components/ui/sonner';
import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout';
import { BreadcrumbItem } from '@/types';

export default function AuthLayout({
    children,
    title,
    description,
    breadcrumbs,
    ...props
}: {
    children: React.ReactNode;
    title: string;
    description: string;
    breadcrumbs?: BreadcrumbItem[];
}) {
    return (
        <>
            <AppHeader breadcrumbs={breadcrumbs} />
            <Toaster theme="light" richColors position="top-right" />
            <AuthLayoutTemplate title={title} description={description} {...props}>
                {children}
            </AuthLayoutTemplate>
        </>
    );
}
