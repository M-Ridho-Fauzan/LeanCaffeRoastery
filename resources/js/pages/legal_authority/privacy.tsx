/**
 * @description      :
 * @author           : Ridho Fauzan
 * @group            :
 * @created          : 21/08/2025 - 16:14:51
 *
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 21/08/2025
 * - Author          : Ridho Fauzan
 * - Modification    :
 **/
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
