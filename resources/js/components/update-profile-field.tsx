/**
 * @description      :
 * @author           : Ridho Fauzan
 * @group            :
 * @created          : 18/08/2025 - 23:07:51
 *
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 18/08/2025
 * - Author          : Ridho Fauzan
 * - Modification    :
 **/

import InputError from './input-error';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface UpdateProfileFieldProps {
    id: string;
    label: string;
    type: string;
    value: string;
    error?: string;
    onChange: (value: string) => void;
    autoComplete?: string;
    required?: boolean;
}

export default function UpdateProfileField({ id, label, type, value, error, onChange, autoComplete, required = false }: UpdateProfileFieldProps) {
    return (
        <div className="grid gap-2">
            <Label htmlFor={id}>{label}</Label>
            <Input
                id={id}
                type={type}
                className="mt-1 block w-full"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required={required}
                autoComplete={autoComplete}
            />
            <InputError className="mt-1" message={error} />
        </div>
    );
}
