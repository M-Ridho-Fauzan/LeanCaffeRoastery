// pages/Privacy.tsx atau resources/js/Pages/Privacy.tsx

import PrivacyPolicy from '@/components/privacy-policy';
import AppHeaderLayout from '@/layouts/app/app-header-layout';
import React from 'react';

const PrivacyPage: React.FC = () => {
    return (
        <AppHeaderLayout>
            {/* Tambahkan meta tag, SEO, dll. di sini jika perlu */}
            <PrivacyPolicy />
        </AppHeaderLayout>
    );
};

export default PrivacyPage;
