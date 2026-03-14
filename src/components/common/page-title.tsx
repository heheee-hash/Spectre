import { ReactNode } from "react";

interface PageTitleProps {
    title: string;
    description?: string;
    action?: ReactNode;
}

export function PageTitle({ title, description, action }: PageTitleProps) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
                {description && (
                    <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
                )}
            </div>
            {action && (
                <div className="flex items-center gap-2 shrink-0">{action}</div>
            )}
        </div>
    );
}
