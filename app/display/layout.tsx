import { ReactNode } from "react";

export default function DisplayLayout({ children }: { children: ReactNode }) {
    return (
        <div>
            {children}
        </div>
    );
}