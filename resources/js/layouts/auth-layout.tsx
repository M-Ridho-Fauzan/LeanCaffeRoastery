import { AppHeader } from '@/components/app-header';
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
            <AuthLayoutTemplate title={title} description={description} {...props}>
                {children}
            </AuthLayoutTemplate>
        </>
    );
}
