/**
 * @description      :
 * @author           : Ridho Fauzan
 * @group            :
 * @created          : 18/08/2025 - 15:00:10
 *
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 18/08/2025
 * - Author          : Ridho Fauzan
 * - Modification    :
 **/
import AppLogoOnly from './app-logo-only';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-auto size-10 w-20 items-center justify-center rounded-md text-sidebar-primary-foreground">
                <AppLogoOnly className="size-14 fill-current text-[#303182]" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <div className="mb-0.5 truncate leading-tight font-semibold">
                    <b className="line-clamp-4 text-xl font-bold tracking-widest">Lean</b>
                    <div>
                        <small className="font-light">Coffee Roastery</small>
                    </div>
                </div>
            </div>
        </>
    );
}
