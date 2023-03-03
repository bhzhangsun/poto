import { FluentProvider, teamsLightTheme } from "@fluentui/react-components";
import React from "react";
import { createRoot, Root } from 'react-dom/client'


export type ISetupHandler = () => Promise<unknown> | void;

class View {
    private handlers: ISetupHandler[] = [];
    private root: Root | null = null;

    setup(handler: ISetupHandler): View {
        this.handlers.push(handler);
        return this;
    }


    async render(child: React.ReactNode, container?: string) {
        for (const handler of this.handlers) {
            await handler();
        }
        this.root = createRoot(document.getElementById(container || "root") as HTMLElement);
        this.root.render(
            <React.StrictMode>
                <FluentProvider theme={teamsLightTheme}>
                    {child}
                </FluentProvider>
            </React.StrictMode>
        );
    }
}

const view = new View();
export default view;

