import { useState } from 'react';

type OnboardingPasswordProps = {
    onChangeText: (text: string) => void;
}

export default function OnboardingPassword({ onChangeText }: OnboardingPasswordProps): JSX.Element {

    const [password, setPassword] = useState<string>('');

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChangeText(event.target.value)
        setPassword(event.target.value)
    }

    return (
        <>
            <input
                type="password"
                className="mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={password}
                onChange={onChange}></input>
        </>
    );
}
