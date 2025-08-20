/**
 * @description      :
 * @author           : Ridho Fauzan
 * @group            :
 * @created          : 18/08/2025 - 15:54:23
 *
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 18/08/2025
 * - Author          : Ridho Fauzan
 * - Modification    :
 **/
import { useNavigation } from '@/hooks/use-navigation';
import NavMainGroup from './nav-main-group';

export function NavMain() {
    const { visiblePlatformItems, visibleAdminItems, visibleAuthorItems } = useNavigation();

    return (
        <>
            <NavMainGroup title="Platform" items={visiblePlatformItems} />
            <NavMainGroup title="Admin Tools" items={visibleAdminItems} className="pt-4" />
            <NavMainGroup title="Author Tools" items={visibleAuthorItems} className="pt-4" />
        </>
    );
}
